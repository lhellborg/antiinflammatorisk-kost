# Antiinflammatorisk kost

En enkel, statisk webbsida med kort fakta om antiinflammatorisk kost och recept för
**frukost, lunch, middag och mellanmål** – plus en "Vad ska jag äta?"-funktion som
ger ett matförslag utifrån vad du har hemma och hur du känner dig.

Ingen server, ingen databas, inga byggsteg. Bara HTML, CSS och lite JavaScript.

## Filer

```
index.html        Startsida + "Vad ska jag äta?"
recept.html       Alla recept, filtrerbara på måltid, tid och allergener
om-kosten.html    Faktasida om antiinflammatorisk kost
css/style.css     Utseende (färgerna ligger högst upp i filen, under :root)
js/labels.js      Gemensamma listor: måltider, "moods", råvaror, allergener
js/forslag.js     Logiken bakom "Vad ska jag äta?"
js/lista.js       Logiken bakom receptlistan
data/recept.js    ALLA RECEPT – det är den här filen du redigerar
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
| `portioner` | antal portioner |
| `ingredienser` | råvaror – använd samma namn som i listan i `js/labels.js` så matchningen funkar |
| `mood` | t.ex. `trott`, `stressad`, `forkyld`, `ont-i-magen`, `sugen-pa-sott`, `varmt-och-matigt`, `snabbt` |
| `allergener` | t.ex. `gluten`, `notter`, `agg`, `fisk`, `mjolk`, `soja` (eller `[]`) |
| `plus` | de mest antiinflammatoriska ingredienserna – visas som gröna taggar |
| `beskrivning` | en kort mening |
| `steg` | lista med tillagningssteg |

Vill du lägga till en ny råvara i kryssrutorna eller en ny "mood" – ändra
listorna i `js/labels.js`.

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
