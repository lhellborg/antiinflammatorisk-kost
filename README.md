# Antiinflammatorisk kost

En enkel, statisk webbsida med kort fakta om antiinflammatorisk kost och recept för
**frukost, lunch, middag och mellanmål** – plus en "Vad ska jag äta?"-funktion som
ger ett matförslag utifrån vad du har hemma och hur du känner dig. Man kan ändra
antal portioner per recept (mängderna räknas om) och samla recept i en **inköpslista**
som slår ihop ingredienserna och går att skriva ut.

Ingen server, ingen databas, inga byggsteg. Bara HTML, CSS och lite JavaScript.
Inköpslistan sparas i besökarens egen webbläsare (localStorage).

## Filer

```
index.html             Startsida + "Vad ska jag äta?"
recept.html            Alla recept, filtrerbara på måltid, tid och allergener
om-kosten.html         Faktasida om antiinflammatorisk kost
inkopslista.html       Inköpslista för de recept man markerat
css/style.css          Utseende (färgerna ligger högst upp i filen, under :root)
js/labels.js           Gemensamma listor + mängd-/portionsuträkningar
js/ui.js               Portionsväljare och ingredienslista (återanvänds)
js/store.js            Inköpslistan – lagras i webbläsaren (localStorage)
js/forslag.js          Logiken bakom "Vad ska jag äta?"
js/lista.js            Logiken bakom receptlistan
js/inkopslista-sida.js Logiken bakom inköpslistan
data/recept.js         ALLA RECEPT – det är den här filen du redigerar
```

## Lägga till eller ändra ett recept

1. Öppna `data/recept.js`.
2. Kopiera ett helt block `{ ... }` (inklusive kommatecknet efter).
3. Klistra in det och ändra texten.
4. Spara. Sidan plockar upp ändringen direkt – ladda om i webbläsaren.

Fälten är dokumenterade högst upp i `data/recept.js`. Kort version:

| Fält | Vad |
|---|---|
| `id` | unik liten text utan mellanslag, t.ex. `"lax-quinoa"` |
| `namn` | rättens namn |
| `maltid` | en eller flera av `frukost`, `lunch`, `middag`, `mellanmal` |
| `tid` | ungefärlig tid i minuter |
| `portioner` | hur många portioner mängderna nedan gäller för (besökaren kan ändra antalet, då räknas allt om) |
| `ingredienser` | lista med `{ id, mangd, enhet }` – `id` ska matcha en råvara i `js/labels.js`; `enhet` är t.ex. `"dl"`, `"msk"`, `"tsk"`, `"krm"`, `"st"`, `"g"`, `"klyfta"`, `"burk"`, `"näve"`; sätt `mangd: null` om mängd inte är relevant |
| `mood` | t.ex. `trott`, `stressad`, `forkyld`, `ont-i-magen`, `sugen-pa-sott`, `varmt-och-matigt`, `snabbt` |
| `allergener` | t.ex. `gluten`, `notter`, `agg`, `fisk`, `mjolk`, `soja` (eller `[]`) |
| `plus` | de mest antiinflammatoriska ingredienserna – visas som gröna taggar |
| `beskrivning` | en kort mening |
| `steg` | lista med tillagningssteg (mängderna står i `ingredienser`) |

Exempel på en ingrediensrad: `{ id: "havregryn", mangd: 1, enhet: "dl" }`.

Vill du lägga till en ny råvara i kryssrutorna eller en ny "mood" – ändra
listorna i `js/labels.js`. Lägger du till en ny råvara: ta gärna med den i
rätt grupp i `KATEGORIER` (samma fil) så hamnar den under rätt rubrik i
inköpslistan.

## Titta på sidan lokalt

Dubbelklicka på `index.html` så öppnas den i webbläsaren. (Det fungerar eftersom
recepten ligger i en `.js`-fil och inte hämtas via nätverket.)

Vill du ändå köra en lokal server:

```bash
python3 -m http.server 8000
# öppna sedan http://localhost:8000
```

## Publicera gratis med GitHub Pages

1. Skapa ett nytt repo på GitHub och pusha den här mappen dit.
2. Gå till **Settings → Pages**.
3. Under **Build and deployment**: välj **Deploy from a branch**, branch `main`, mapp `/ (root)`. Spara.
4. Efter någon minut ligger sidan på `https://<ditt-användarnamn>.github.io/<repo-namn>/`.

Sen kan du redigera `data/recept.js` direkt på github.com (penn-ikonen) – ändringen
går live automatiskt. Alternativt funkar [Netlify](https://www.netlify.com/) eller
[Cloudflare Pages](https://pages.cloudflare.com/) lika bra och lika gratis – dra
bara in mappen eller koppla repot.

## Obs

Sidan är inspiration, inte medicinsk rådgivning. Vid sjukdom eller särskild
kosthållning – prata med vården eller en dietist.
