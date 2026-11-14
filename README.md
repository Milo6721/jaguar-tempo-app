# Tempo na Vercelu

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
- Zmiana kolejności: na komputerze złap zadanie w dowolnym miejscu i przeciągnij w górę lub w dół. Na telefonie przytrzymaj zadanie chwilę, aż się uniesie, i wtedy przeciągnij (albo ciągnij od razu za kolorowy kafelek). W menu "⋯" zadania są też "Move up" i "Move down". Godziny przeliczą się same, a zadanie upuszczone pod stałym punktem dnia (np. kolacją) zostaje po nim.
- Pole "Quick add" rozumie np. `Call the accountant 20 min`, `Gym 1h tomorrow at 6pm !high`.
- Strzałka cofania przy tytule harmonogramu cofa ostatnią akcję. Menu "⋯" obok ma: re-plan, sortowanie po priorytecie, przerwę, ochronę czasu, przeniesienie reszty na jutro, czyszczenie ukończonych, kopiowanie planu i "Delete all tasks".

## Co doszło w wersji 5

- **Zadania powtarzalne**: w edytorze zadania jest pole "Repeat" (codziennie, dni robocze, co tydzień, dwa razy dziennie). Działa też dla czasu chronionego, np. "Chill" co wieczór. Tempo samo tworzy wystąpienia na tydzień do przodu, a usunięte wystąpienie nie wraca. Asystent też to umie: "Add Chill at 9 PM as protected time every day".
- **Tempo Intelligence**: liczby są spójne (kafelki Free / Work / Spare liczą się z tego samego wzoru), a tempo dnia pojawia się dopiero po dwóch zmierzonych zadaniach i nie przesadza z procentami.
- **Płatność**: bez formularza z danymi. Wybierasz metodę, przechodzisz captchę "Press the mouse" (liczy się mysz zwierzę i myszka od komputera), potem odcisk palca albo narysowanie pokazanego wzoru. Napisy o "demo" zniknęły.
- **Ikony z AI** mają teraz takie samo tło jak wbudowane (kolor kategorii), więc nie odstają.
- **Asystent**: nowy mikrofon i spokojniejsze ostrzeżenia zamiast żółtych pasków. Rozumie "Improve my day" i podobne ("optimize", "make it better").
- **Animacje**: litery tytułu płynnie unoszą się i rozpływają w światło, z którego wyrasta dżungla. W trybie Focus (także na pełnym ekranie) animacja gra na całym ekranie; naprawiony błąd, przez który na pełnym ekranie nie było jej widać.
- **Harmonogram**: ukończone zadania zwijają się do kompaktowych wierszy, nagłówek sprintu pokazuje ile zostało i na ile godzin.
- Dźwięk: każdy dźwięk zakolejkowany przed pierwszym kliknięciem odtworzy się, gdy przeglądarka pozwoli na audio. Jeśli nadal nic nie słychać, sprawdź suwak głośności w Preferences i wycisz karty w przeglądarce.

## Co doszło w wersji 4

- **Timer na bieżącym zadaniu**: zadanie, które właśnie trwa, ma odliczanie co sekundę, pasek postępu i przycisk startu timera.
- **Zielona pigułka na żywo**: "Done by ..." pokazuje, o której naprawdę skończysz. Przelicza się z zegara i z tego, co odhaczysz, i porównuje z Twoim celem.
- **Automatyczne przesuwanie godzin**: odhaczysz wcześniej, to kolejne bloki podjeżdżają w górę. Przeciągniesz zadanie w czasie, to przesuwają się w dół. Wyłączysz to w Preferences ("Adjust times when I tick a task off").
- **Asystent**: nowy wygląd czatu oraz polecenia grupowe, np. `delete the postponed stuff`, `move the postponed tasks to tomorrow`, `bring the postponed back`, `clear the completed ones`.
- **Tempo Intelligence**: tempo dnia, oś dnia z prognozą końca, seria dni, czas skupienia, konkretna podpowiedź, a po "More detail" podział czasu na rodzaje pracy i Twoje najlepsze godziny.
- **Today view w Preferences**: wybierasz, które karty widać na ekranie Today i czy harmonogram jest na górze.
- **Konto i plany**: przycisk z Twoim imieniem w lewym dolnym rogu (na telefonie w "More") otwiera plany Free / Pro ($25) / Ultra ($60). Płatność jest w całości na niby: nic nie jest pobierane i żadne dane nie opuszczają przeglądarki. Plany niczego nie zmieniają poza jednym: Ultra odblokowuje **AI icon maker** w zakładce Icons (opisujesz ikonę, Claude ją rysuje).
- **Animacje**: animacja po zadaniu gra zawsze na środku ekranu (także nad trybem Focus), a duża animacja dnia odpala się, gdy skończysz wszystkie zadania, nawet jeśli stałe punkty dnia (np. kolacja) nie są odhaczone. Asystent też ją uruchamia, gdy napiszesz mu, że coś skończyłeś.
- "Hide completed" i "Show completed" to teraz jeden przełącznik, który działa w obie strony.

## Co doszło w wersji 3

- **Suggestions for the day** i **Tempo Intelligence** na górze ekranu Today. Każda sugestia ma przycisk OK, który od razu ją wykonuje.
- **Memory**: zakładka z tym, co Tempo zapamiętało z rozmów, z możliwością dodawania i usuwania.
- **Weekly overview**: wykresy tygodnia, pasy dni z paskiem obciążenia, przeciąganie zadań między dniami, karta "You saved with Tempo" (to szacunek, opis jest na karcie).
- **Icons**: własne ikony rysowane kształtami lub odręcznie, z tłem i opisem, kiedy AI ma ich używać.
- **Focus mode**: pełnoekranowy timer z krokami i notatkami do zadania.
- Zegar przy każdym zadaniu (zielony, żółty, czerwony), własne priorytety z kolorem, kolor wyróżnienia zadania, checklisty tylko dla dłuższych zadań.
- Dźwięk przy otwarciu i przy ukończeniu zadania oraz dwie animacje z jaguarem. Jedno i drugie wyłączysz w Preferences.

## Dla programisty

Źródła są w `tempo/src` (części CSS i JS). `sh tempo/build.sh` składa je w `tempo-deploy/index.html`, a `sh tempo/tools/check.sh` dodatkowo sprawdza składnię i uruchamia testy silnika. Node nie jest potrzebny.
