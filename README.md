# Tempo (Jaguar Sprint) na Vercelu

Zawartość folderu:

- `index.html` to cała aplikacja (strona). **Zmienił się w tej wersji.**
- `api/plan.js` to funkcja serwerowa, która pyta Claude. Klucz API jest tylko po stronie serwera. Bez zmian od wersji z modelem Sonnet 5.5.
- `package.json` mówi Vercelowi, żeby zainstalował SDK Anthropic. Bez zmian.

## Aktualizacja istniejącego wdrożenia

1. Na GitHubie otwórz repo, kliknij `index.html`, potem ikonę ołówka albo **Add file → Upload files**, i podmień plik na nowy z tego folderu.
2. Zrób commit. Vercel sam zbuduje nową wersję.
3. Zmienne środowiskowe (`ANTHROPIC_API_KEY`, `TEMPO_ACCESS_CODE`, `TEMPO_MODEL`) zostają bez zmian.

Twoje zapisane zadania zostają: nowa wersja czyta dane starej z tej samej przeglądarki.

## Pierwsze wdrożenie od zera

1. Na github.com utwórz repo i wgraj `index.html`, `package.json` i folder `api`.
2. Na vercel.com: **Add New → Project**, wybierz repo, **Deploy** (Framework: "Other").
3. W **Settings → Environment Variables** dodaj `ANTHROPIC_API_KEY` (wymagane, oznacz jako Sensitive) i `TEMPO_ACCESS_CODE` (zalecane). `TEMPO_MODEL` jest opcjonalne: domyślnie `claude-sonnet-5-5`.
4. Zrób **Redeploy**, żeby zmienne zadziałały.
5. W konsoli Anthropic ustaw miesięczny limit wydatków dla tego klucza.

## Jak sprawdzić, czy AI działa

W asystencie (zakładka albo okno z przycisku "Jaguar Assistant") na górze jest napis o planerze:

- `Planner: Claude (server)` oznacza, że serwer ma klucz i AI odpowiada.
- `Planner: built-in (AI server has no API key yet)` oznacza brak `ANTHROPIC_API_KEY` albo brak Redeploy po jego dodaniu.
- `Planner: built-in (no AI server found at /api/plan)` oznacza, że folder `api` nie trafił do repo.

Możesz też otworzyć `twoj-adres.vercel.app/api/plan`. Powinien pokazać JSON z `"configured": true`.

## Gesty i skróty

- Przesunięcie zadania w lewo usuwa je, w prawo oznacza jako zrobione. Po każdej akcji jest "Undo".
- Kolorowy kafelek z ikoną to uchwyt: przeciągnij go w górę lub w dół, żeby zmienić kolejność. Godziny przeliczą się same.
- Pole "Quick add" rozumie np. `Biology 40 min`, `Essay 1h tomorrow at 5pm !high`.
- Menu "⋯" przy tytule harmonogramu ma "Delete all tasks" dla wybranego dnia.
