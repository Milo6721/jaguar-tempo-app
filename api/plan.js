// Vercel serverless function: POST /api/plan  { prompt: string }
// The browser never sees the API key. It lives in ANTHROPIC_API_KEY on Vercel.
import { createHash, timingSafeEqual } from "node:crypto";
import Anthropic from "@anthropic-ai/sdk";

export const config = { maxDuration: 60 };

const MODEL = process.env.TEMPO_MODEL || "claude-sonnet-5-5";
const MAX_PROMPT_CHARS = 60_000;
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = Math.max(1, Number(process.env.TEMPO_RATE_PER_MINUTE) || 6);
const USE_FALLBACKS = process.env.TEMPO_FALLBACKS !== "off";

// Best effort only: each serverless instance keeps its own counter.
const hits = new Map();
function rateLimited(key) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return recent.length > MAX_PER_WINDOW;
}

function sameSecret(a, b) {
  const ha = createHash("sha256").update(String(a)).digest();
  const hb = createHash("sha256").update(String(b)).digest();
  return timingSafeEqual(ha, hb);
}

function extractJson(text) {
  const t = String(text || "").trim();
  try { return JSON.parse(t); } catch {}
  const fence = /```(?:json)?\s*([\s\S]*?)```/i.exec(t);
  if (fence) { try { return JSON.parse(fence[1]); } catch {} }
  const a = t.indexOf("{");
  const b = t.lastIndexOf("}");
  if (a !== -1 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
  return null;
}

function reply(res, status, body) {
  res.setHeader("cache-control", "no-store");
  res.status(status).json(body);
}

async function ask(client, prompt, withFallback) {
  const params = { model: MODEL, max_tokens: 16000, messages: [{ role: "user", content: prompt }] };
  if (withFallback) {
    // If a safety classifier declines, the API re-runs the request on a fallback model.
    return client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" });
  }
  return client.messages.create(params);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    // Status only: no secrets. Lets the page show whether AI is really available.
    return reply(res, 200, { ok: true, configured: Boolean(process.env.ANTHROPIC_API_KEY), needsCode: Boolean(process.env.TEMPO_ACCESS_CODE), model: MODEL });
  }
  if (req.method !== "POST") {
    res.setHeader("allow", "GET, POST");
    return reply(res, 405, { code: "method_not_allowed", message: "Use POST." });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return reply(res, 503, { code: "not_configured", message: "ANTHROPIC_API_KEY is not set on the server." });
  }

  const required = process.env.TEMPO_ACCESS_CODE;
  if (required && !sameSecret(req.headers["x-tempo-code"] || "", required)) {
    return reply(res, 401, { code: "needs_code", message: "Access code required." });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (rateLimited(ip)) {
    return reply(res, 429, { code: "rate_limited", message: "Too many requests. Wait a minute and try again." });
  }

  const prompt = req.body && typeof req.body === "object" ? req.body.prompt : undefined;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return reply(res, 400, { code: "invalid_request", message: "Body must be JSON with a non-empty prompt string." });
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    return reply(res, 413, { code: "prompt_too_large", message: "Prompt is too long." });
  }

  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
  try {
    let message;
    try {
      message = await ask(client, prompt, USE_FALLBACKS);
    } catch (e) {
      // Fallback parameter rejected for this account or model: retry once without it.
      if (USE_FALLBACKS && e instanceof Anthropic.BadRequestError) message = await ask(client, prompt, false);
      else throw e;
    }

    if (message.stop_reason === "refusal") {
      return reply(res, 200, { code: "refused", message: "Claude declined this request." });
    }
    const text = (message.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n");
    const plan = extractJson(text);
    if (!plan || typeof plan !== "object") {
      return reply(res, 502, { code: "invalid_json", message: "The model did not return a valid plan." });
    }
    return reply(res, 200, { ok: true, plan, model: message.model });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
      return reply(res, 503, { code: "not_configured", message: "The server's API key was rejected." });
    }
    if (e instanceof Anthropic.RateLimitError) {
      return reply(res, 429, { code: "rate_limited", message: "The AI service is busy. Try again shortly." });
    }
    if (e instanceof Anthropic.APIError) {
      return reply(res, 502, { code: "upstream_error", message: "The AI service returned an error." });
    }
    return reply(res, 500, { code: "upstream_error", message: "Unexpected server error." });
  }
}
