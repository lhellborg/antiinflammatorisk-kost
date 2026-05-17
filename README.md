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
recept.html            Alla recept (inbyggda + egna), filtrerbara på måltid, tid, allergener
veckomeny.html         "Smart veckomeny" – genererar en veckas matsedel + inköpslista
festmaltid.html        "Festmåltid" – välj förrätt/huvudrätt/efterrätt var för sig eller alla tre
om-kosten.html         "Ät mer / mindre av" + fakta om inflammation (klickbara delar) + ätordning
forbattra.html         "Förbättra ett recept" – mata in en rätt, få byten, spara som eget recept (nås via Recept-sidan/-korten, ej i toppmenyn)
fakta.html             Liten omdirigering till om-kosten.html (sidan slogs ihop dit)
inkopslista.html       Inköpslista för de recept man markerat
css/style.css          Utseende (färgerna ligger högst upp i filen, under :root)
js/labels.js           Gemensamma listor + mängd-/portions-/matchningsfunktioner
js/ui.js               Portionsväljare och ingredienslista (återanvänds)
js/store.js            Inköpslistan – lagras i webbläsaren (localStorage)
js/myrecipes.js        Egna recept – lagras i webbläsaren; allRecipes() = inbyggda + egna
js/weekplan.js         Veckomenyn – lagras i webbläsaren
js/pantry.js           "Vad har du hemma?" – råvaror man har hemma; lagras i webbläsaren (delas av veckomeny + inköpslista)
js/forslag.js          Logiken bakom "Vad ska jag äta?"
js/lista.js            Logiken bakom receptlistan
js/inkopslista-sida.js Logiken bakom inköpslistan
js/forbattra.js        Logiken bakom "Förbättra ett recept"
js/veckomeny.js        Logiken/generatorn bakom veckomenyn
js/festmaltid.js       Logiken bakom festmåltidssidan
data/recept.js         ALLA INBYGGDA RECEPT – det är den här filen du redigerar
data/byten.js          Bytestabell + tilläggstips för "Förbättra ett recept"
```

Toppmenyn (5 flikar): Hem · Recept · Veckomeny · Om kosten · Inköpslista.
"Förbättra recept" nås via en knapp på Recept-sidan och "Gör en egen
version"-knapparna på receptkorten.

"Om kosten" är vanlig HTML – ändra texten direkt i filen. De "klickbara
delarna" är vanliga `<details>`-element.

### Smart veckomeny

`veckomeny.html` genererar en veckas matsedel av recepten (inbyggda + egna):
varierad (ingen middag/lunch upprepas), balanserad (siktar på minst ett par
fiskmiddagar, mest växtbaserat, högst en med rött kött), med valbar tidsgräns
på vardagsmiddagar och möjlighet att laga större sats (grytor/soppor o.d.) som
"rester" till lunch dagen efter. Du kan byta ut/låsa enskilda rutor, slumpa om
hela veckan, lägga hela veckan i inköpslistan (skalat till antal personer) och
skriva ut den. Veckan sparas i besökarens webbläsare. Generatorn ligger i
`js/veckomeny.js` – t.ex. balansreglerna (`recipeTyp`, `score`) och vilka
rätter som räknas som "lagar-en-gång-i-större-sats" (`isBatchFriendly`).

"Vad har du hemma?" på veckomenyn viktar inte bara förslagen utan sparas också
i `window.Pantry` (`js/pantry.js`). På inköpslistan flyttas de råvarorna då till
en egen sektion – "Det du sa att du har hemma – kolla att mängden räcker" – med
den totala mängd som behövs, så man ser om man behöver köpa mer. (Markeringen
görs på veckomenyn; inköpslistan visar bara resultatet.)

Varje rätt i veckomenyn har också:
- **Receptnamnet som länk** – klick öppnar "Förbättra ett recept" med rätt
  parametrar (`?from=…&slot=…` eller `?edit=…&slot=…`). När du sparar sparas
  receptet i din receptbok OCH rutan i veckomenyn pekas om till det. Inbyggda
  recept ändras aldrig – det blir alltid en egen version. `WeekPlan.setSlotRecipeFromEdit`
  i `js/weekplan.js` håller eventuella rester-rutor i synk.
- **"Välj …"-knapp** – öppnar en dialog där du själv kan välja vilken rätt
  som ska in i rutan (söker i alla recept som passar måltiden + dina allergenfilter).

### Festmåltid

`festmaltid.html` låter besökaren välja förrätt, huvudrätt och/eller efterrätt
var för sig – eller alla tre på en gång ("Hela festmenyn") – och slumpar ihop en
festmeny av recepten. Byt ut per rätt, justera antal gäster, lägg hela menyn i
inköpslistan, skriv ut. Måltidstyperna `forratt` och `efterratt` finns i
`window.MALTIDER` (i `js/labels.js`), och festrätter taggas med moodet `fest`.
Huvudrätten väljs bland `middag`-recept som är märkta `fest` eller `vill-bjuda`.
Festmenyn sparas i besökarens webbläsare.

### Förbättra ett recept / egna recept

På `forbattra.html` kan besökaren mata in en egen rätt, få förslag på byten
(t.ex. crème fraiche → grekisk yoghurt) och tillägg, och spara resultatet.
Sidan har tre lägen:
- tomt formulär (mata in från noll),
- `?from=<recept-id>` – gör en **egen version av ett befintligt recept**
  (nås via "Gör en egen version"-knappen på receptkorten); ingredienserna
  laddas in och kan ändras, t.ex. med **"byt ut en del"** på en rad som delar
  raden (default hälften/hälften) och föreslår ersättningar i samma "familj"
  (linser → kikärtor/bönor/quinoa osv., från `data/byten.js`'s `LIKNANDE`-lista),
- `?edit=<recept-id>` – redigera ett eget recept man redan sparat.

Ändrar man portionsväljaren på sidan skalas mängderna i raderna proportionellt.
Egna recept (inkl. versioner) lagras i besökarens egen webbläsare
(`localStorage`) – de syns i receptlistan (märkta "Eget recept", versioner får
beskrivningen "Egen version av «…»"), kan läggas i inköpslistan och skalas efter
portioner precis som de inbyggda. Inget skickas till någon server.

**"Mycket av något?":** när en rätt lutar sig tungt på en stapelvara (linser,
kikärtor, bönor – eller ris/pasta/potatis) flaggas det automatiskt på
"Förbättra ett recept", med ett klick för att byta ut hälften (eller allt) mot
något i samma familj. Gränserna ("rimlig mängd per portion") ligger i
`data/byten.js` → `STAPLE_GRANSER`. I veckomenyn dyker det också upp en notis
om hela veckan blir baljväxttung, med en knapp som byter ut en av de rätterna.

Vill du fylla på förslagen: redigera `data/byten.js` – `BYTEN` (byt-ut-förslag),
`LIKNANDE` (ersättningar i samma familj), `STAPLE_GRANSER` (vad som flaggas som
"för mycket"), `LAGG_TILL_TIPS`, `TILLAGNINGSTIPS`, `MINDRE_BRA_CHIPS` (formatet
står i filen). "Skicka in"-knappen öppnar ett mejl till adressen i
`js/forbattra.js` (sök efter `mailto:`) – byt den eller koppla in ett
formulärverktyg om du vill ha inskicken någon annanstans.

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
| `mood` | en eller flera av id:na i `window.MOODS` i `js/labels.js` (`trott`, `stressad`, `forkyld`, `ont-i-magen`, `dalig-somn`, `efter-traning`, `sugen-pa-gront`, `sugen-pa-sott`, `varmt-och-matigt`, `vill-ata-latt`, `vill-bjuda`, `snabbt`) |
| `allergener` | t.ex. `gluten`, `notter`, `agg`, `fisk`, `mjolk`, `soja` (eller `[]`) |
| `plus` | de mest antiinflammatoriska ingredienserna – visas som gröna taggar |
| `beskrivning` | en kort mening |
| `steg` | lista med tillagningssteg (mängderna står i `ingredienser`) |

Exempel på en ingrediensrad: `{ id: "havregryn", mangd: 1, enhet: "dl" }`.

Vill du lägga till en ny råvara i kryssrutorna eller en ny "mood" – ändra
listorna i `js/labels.js`. Lägger du till en ny råvara: ta gärna med den i
rätt grupp i `KATEGORIER` (samma fil) så hamnar den under rätt rubrik i
inköpslistan.

## Köra testerna

```bash
node test.js
```

Kör datavalidering (unika recept-id, alla ingredienser i `RAVAROR`,
kategoriserade, giltiga måltider/moods/allergener), hjälpfunktioner
(`scaleAmount`, `formatAmount`, `combineAmounts`, `matchRavara` m.fl.),
stapelvaru-flaggning (`stapleFlags` / `recipeStapleHeavy`) och alla
fyra storerna (`Cart`, `MyRecipes`, `WeekPlan` inkl. att
`setSlotRecipeFromEdit` följer rester-relationen, `Pantry`). UI-flöden
(modaler, knappar, formulär) testas inte – kör dem manuellt på sidan.

Lägger du till ett nytt recept, en ny mood eller en ny råvara: kör
`node test.js` så fångar testerna typiska misstag (saknad kategori,
felstavat mood, ingrediens-id som inte finns i `RAVAROR` osv.).

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
