# Tempo na Vercelu

Zawartość folderu:

- `index.html` to cała aplikacja (strona).
- `api/plan.js` to funkcja serwerowa, która pyta Claude. Klucz API jest tylko po stronie serwera.
- `package.json` mówi Vercelowi, żeby zainstalował SDK Anthropic.

## Wdrożenie

1. Na github.com utwórz nowe repo (np. `tempo`) i wgraj do niego całą zawartość tego folderu (**Add file → Upload files**, przeciągnij `index.html`, `package.json` i folder `api`). Plików `.env.example` i `README.md` nie musisz wgrywać.
2. Na vercel.com: **Add New → Project**, wybierz repo, **Deploy**. Framework zostaw na "Other".
3. W projekcie wejdź w **Settings → Environment Variables** i dodaj:
   - `ANTHROPIC_API_KEY` z kluczem z console.anthropic.com (wymagane),
   - `TEMPO_ACCESS_CODE` z dowolnym kodem (zalecane, bez niego każdy z linkiem zużywa Twój budżet),
   - `TEMPO_MODEL` np. `claude-sonnet-5-5`, jeśli chcesz taniej i szybciej (domyślnie `claude-opus-5-5`).
4. Zrób **Redeploy** (Deployments → trzy kropki → Redeploy), żeby zmienne zadziałały.
5. W konsoli Anthropic ustaw miesięczny limit wydatków dla tego klucza.

## Jak to działa

- Strona wysyła opis dnia do `/api/plan`. Funkcja woła Claude i zwraca gotowy plan w JSON.
- Gdy serwer nie ma klucza albo jest niedostępny, strona sama przełącza się na wbudowany planer.
- Gdy ustawisz `TEMPO_ACCESS_CODE`, odbiorca wpisze kod raz w oknie czatu, a przeglądarka go zapamięta.
- Limit: domyślnie 6 zapytań na minutę na osobę (`TEMPO_RATE_PER_MINUTE`).

## Jak sprawdzić, czy AI działa

Wejdź w zakładkę **Assistant**. Na górze karty czatu jest napis o planerze:

- `Planner: Claude (server)` oznacza, że serwer ma klucz i AI odpowiada.
- `Planner: built-in (AI server has no API key yet)` oznacza, że funkcja działa, ale brakuje `ANTHROPIC_API_KEY` albo nie zrobiłeś Redeploy po jego dodaniu.
- `Planner: built-in (no AI server found at /api/plan)` oznacza, że folder `api` nie trafił do repo.
- Jeśli ustawiłeś `TEMPO_ACCESS_CODE`, nad polem wiadomości pojawi się prośba o kod.

Możesz też otworzyć `twoj-adres.vercel.app/api/plan` w przeglądarce. Powinieneś zobaczyć krótki JSON z polem `"configured": true`.
