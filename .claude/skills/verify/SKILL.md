# Verify: antiinflammatorisk-kost

Statisk sajt utan byggsteg – verifiering = servera + kör i headless Chrome.

## Enhetstester (stores, data, hjälpfunktioner)

```bash
node test.js
```

Kör mot stubbar för localStorage/document. Täcker receptdata, labels,
Cart/MyRecipes/WeekPlan/Pantry och profiler. UI testas inte här.

## Kör sajten i webbläsare

```bash
python3 -m http.server 8137          # servera repo-roten
npm install puppeteer-core           # i en scratch-katalog, ej i repot
```

Systemets Chrome finns på `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`
(Playwright är inte installerat). Kör puppeteer-core med den som `executablePath`.

## Flöden värda att köra

- **recept.html**: 71 kort byggs; sök + måltids-/tids-/allergenfilter;
  lägg i inköpslista (kortknapp, cartbar, meny-badge); portionsstepper.
  Sökfältet är debouncat (~150 ms) – vänta ≥400 ms efter input innan assert.
- **index.html**: kryssa mood/råvara, "Ge mig ett förslag" → result-hero + 3 alternativ.
- **veckomeny.html**: klicka `#vm-generate` → `#vm-grid` fylls.
- **inkopslista.html**: kräver recept i carten; kollar aggregering + kategorirubriker.
- **profiler**: `Profiles.add/switch` i sidkontext – cart/recept ska följa profilen
  (store-cacharna invalideras via nyckelbyte och `profile:changed`).

## Gotchas

- Filterchips: sätt värden via `input.click()` i `page.evaluate` (change-eventet
  ska bubbla); rensa sökfältet med `value = ""` + dispatchat `input`-event –
  trippelklick + Backspace rensar inte pålitligt.
- `/favicon.ico` 404:ar alltid (sajten har ingen) – filtrera bort i konsolfels-koll.
- Skripten laddas med `defer` i `<head>`; inline-`markNav` körs på DOMContentLoaded.
  Allt ska vara klart vid `networkidle0`.
- localStorage delas mellan sidor i samma browser-session – börja med
  `localStorage.clear()` + reload för ren utgångspunkt.
