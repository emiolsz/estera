# Pracownia Estery — sny i synchroniczność

Osobny projekt. Nie zmienia Soul Decodera. Zachowuje jego logo, grafikę Kodu Duszy, czcionki i kolorystykę. Kafelki Sennik i Język aniołów zawierają oryginalne ilustracje użytkowniczki.

## Przygotowane funkcje

- Trzy kafelki: Interpretator snu, Synchroniczność / język aniołów, Kod Duszy (link do obecnej aplikacji).
- Jednorazowa interpretacja bez zapisu; zalogowany użytkownik może zapisywać sny w D1 i wybrać do 10 własnych wpisów jako kontekst.
- Dziennik jest filtrowany według zaufanego identyfikatora użytkownika z Sites. Nie polega na lokalnej pamięci przeglądarki. Wpisy można usuwać i eksportować jako JSON lub PDF.
- Eksport PDF obsługuje polskie znaki. Wysyłka PDF tylko na zweryfikowany adres zalogowanego użytkownika, po potwierdzeniu.
- Czytelnia z tytułami i podtytułami, pełne treści po rozwinięciu. W administracji szkic i publikacja są oddzielone.
- Prywatna publikacja do oceny. Uruchomienie anonimowego dostępu wymaga świadomej zmiany dostępności strony.

## Konfiguracja przed uruchomieniem AI i wysyłki

Sekrety wyłącznie w ustawieniach runtime Sites, nigdy w źródłach ani w przeglądarce:

- `OPENAI_API_KEY`: wymagane podłączenie OpenAI Developers i zatwierdzenie klucza zgodnie z instrukcją tej integracji. Nie wpisywać klucza w czacie.
- `OPENAI_MODEL`: opcjonalnie; domyślnie `gpt-4.1-mini`. Model musi być dostępny dla danego konta API.
- `RESEND_API_KEY` i `MAIL_FROM`: wysyłka przez API Resend z zatwierdzonego adresu/domeny nadawcy. Nie skonfigurowano konta ani nie wysłano testowego maila.
- `ADMIN_EMAIL`: adres konta ChatGPT administratorki. Nie zgadywać; przypisać właściwe konto przed redakcją czytelni.

Brak kluczy nie powoduje pozorowanych interpretacji ani fałszywego potwierdzenia wysyłki. Dziennik i eksport PDF działają niezależnie od AI. Treści z interpretacji generuje model po wyraźnym kliknięciu i zgodzie. `store:false` wyłącza utrwalanie obiektu odpowiedzi w Responses API; nie jest to obietnica całkowitego braku retencji po stronie dostawcy.

Limity: 3 interpretacje dziennie dla anonimowego korzystania, 20 dla konta, 200 łącznie; 10 wiadomości dziennie na konto. Użytkownik korzysta bezpłatnie, ale API może generować koszty właścicielki. To limity startowe do uzgodnienia.

## Przed publiczną premierą

Uzupełnić grafiki, regulamin i politykę prywatności dopasowaną do rzeczywistych dostawców i przekazywania snów do AI. Sprawdzić właścicielkę administratora, działanie logowania, izolację dwóch kont, rzeczywistą interpretację i dostarczenie e-maila. Nie kopiować bazy, klientów, sekretów, płatności ani interpretacji Soul Decodera.

## Walidacja

`node node_modules/typescript/bin/tsc --noEmit`

`node /root/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-a.1/scripts/build-site.mjs`

Przy braku narzędzia control-browser nie uruchamiano lokalnego serwera podglądu ani testów przeglądarkowych. Weryfikacja budowania nie potwierdza podłączenia OpenAI, dostarczenia e-maila ani zachowania dwóch różnych kont.

## Paczka do GitHuba

Rozpakuj ZIP i wgraj jego zawartość do osobnego repozytorium. Nie nadpisuj repozytorium Soul Decodera. Paczka zawiera źródła i ilustracje, bez sekretów, bazy użytkowników i node_modules.

To aplikacja Vinext / Cloudflare Workers z bazą D1 i logowaniem Sites. Zapisanie kodu w GitHubie nie podłącza AI, poczty ani bazy. Repozytorium nie jest gotowym wdrożeniem Vercel ani pojedynczym statycznym HTML-em. Działająca prywatna wersja jest dostępna pod adresem https://pracownia-estery-sny.idealkid512.chatgpt.site.

Plik .openai/hosting.json wskazuje istniejącą stronę i wiązanie D1. Nie zawiera hasła ani klucza. Baza dziennika nie jest częścią archiwum; swoje sny eksportuje się osobno z aplikacji. Integracje AI i poczty wymagają konfiguracji opisanej wyżej.

Bezpłatny eksport wpisanego snu: w formularzu przycisk „Pobierz wpisany sen jako PDF” działa bez AI, newslettera, zgody marketingowej, adresu e-mail i konta dziennika. Zawiera datę, tytuł, wpisaną treść i ewentualną dostępną interpretację. Strona jest na razie prywatna do oceny właścicielki.
