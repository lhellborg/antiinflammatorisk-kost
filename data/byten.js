/* ============================================================
   BYTESTABELL för "Förbättra ett recept"
   ------------------------------------------------------------
   Tre listor:
     BYTEN          – "byt ut X mot Y" + varför
     LAGG_TILL_TIPS – saker man kan lägga till för extra effekt
     TILLAGNINGSTIPS – råd om själva tillagningen

   Lägg till ett nytt byte: kopiera ett block i BYTEN och ändra.
     traffar   = ord/fraser (gemener) som ska kännas igen i en ingredienslista.
                 Matchas om ingrediensnamnet *innehåller* någon av strängarna.
     byt_namn  = vad det föreslås bytas till (visas i förslaget och som ny rad)
     behall    = true om mängd och enhet kan behållas oförändrade vid bytet
     varfor    = kort, faktabaserad förklaring
   ============================================================ */

window.BYTEN = [
  {
    traffar: ["crème fraiche", "creme fraiche", "gräddfil", "graddfil"],
    byt_namn: "naturell yoghurt (grekisk eller turkisk)",
    behall: true,
    varfor: "Fermenterade mjölkprodukter som naturell yoghurt går bra på antiinflammatorisk kost, till skillnad från crème fraiche som är fetare och mer processad."
  },
  {
    traffar: ["vetemjöl", "vetemjol", "vitt mjöl", "vitt mjol", "vetemjöl special"],
    byt_namn: "fullkorns- eller bovetemjöl (ev. hälften vardera)",
    behall: true,
    varfor: "Mer fibrer ger jämnare blodsocker. Bovetemjöl är dessutom glutenfritt."
  },
  {
    traffar: ["vitt ris", "jasminris", "basmatiris"],
    byt_namn: "fullkornsris eller quinoa",
    behall: true,
    varfor: "Mer fibrer och ett lägre, flackare blodsockersvar."
  },
  {
    traffar: ["pasta", "spaghetti", "makaroner", "penne"],
    byt_namn: "fullkornspasta",
    behall: true,
    varfor: "Mer fibrer → jämnare blodsocker. Koka gärna al dente, det sänker blodsockersvaret ytterligare."
  },
  {
    traffar: ["smör", "margarin", "bordsmargarin"],
    byt_namn: "olivolja (eller rapsolja)",
    behall: false,
    varfor: "Omättat fett i stället för mättat. Olivolja innehåller dessutom egna inflammationsdämpande ämnen."
  },
  {
    traffar: ["socker", "strösocker", "strosocker", "farinsocker", "sirap"],
    byt_namn: "mosad banan eller mixade dadlar – och mindre mängd",
    behall: false,
    varfor: "Mindre tillsatt socker dämpar blodsockertoppar och insulinpåslag. Frukt ger sötma plus fibrer."
  },
  {
    traffar: ["grädde", "gradde", "vispgrädde", "matlagningsgrädde"],
    byt_namn: "havredryck/kokosmjölk light – eller cashewgrädde",
    behall: true,
    varfor: "Mindre mättat fett. Vill du ha krämighet utan mejeri funkar inkokt cashewnöt eller silken tofu också."
  },
  {
    traffar: ["korv", "bacon", "chark", "falukorv", "prinskorv", "salami", "skinka"],
    byt_namn: "linser eller bönor (helt eller delvis)",
    behall: false,
    varfor: "Processat kött är bland det som tydligast kopplas till inflammation. Baljväxter ger protein och massor av fibrer i stället."
  },
  {
    traffar: ["nötfärs", "notfars", "blandfärs", "blandfars", "fläskfärs", "flaskfars", "köttfärs", "kottfars"],
    byt_namn: "hälften färs + hälften röda linser (eller sojafärs)",
    behall: true,
    varfor: "Minskar mängden rött kött och ökar fibrerna – utan att smaken försvinner."
  },
  {
    traffar: ["vitt bröd", "vitt brod", "baguette", "fralla", "formfranska", "rostbröd"],
    byt_namn: "fullkorns- eller surdegsbröd",
    behall: true,
    varfor: "Mer fibrer och långsammare blodsockerstegring."
  },
  {
    traffar: ["ströbröd", "strobrod"],
    byt_namn: "mald havre, mandelmjöl eller krossade fullkornsflingor",
    behall: true,
    varfor: "Byter raffinerat vetebröd mot något fiberrikare."
  },
  {
    traffar: ["majonnäs", "majonnas", "remoulad"],
    byt_namn: "grekisk yoghurt med senap och citron",
    behall: true,
    varfor: "Mindre mättat fett och inga tillsatser; smaken blir fräschare."
  },
  {
    traffar: ["buljongtärning", "buljongtarning", "fond med tillsatser"],
    byt_namn: "hemkokt buljong eller grönsaks-/svampfond utan tillsatser",
    behall: true,
    varfor: "Mindre salt och färre tillsatser."
  },
  {
    traffar: ["helmjölk", "helmjolk", "mellanmjölk", "standardmjölk"],
    byt_namn: "en mindre mängd – eller havre-/sojadryck",
    behall: true,
    varfor: "Fermenterad mjölk är ok, men i recept funkar ofta en växtdryck lika bra."
  },
  {
    traffar: ["potatismos", "pommes", "stekt potatis", "potatisgratäng"],
    byt_namn: "rotfruktsmos (morot/palsternacka) eller blomkålsmos – eller kokt potatis med skal",
    behall: false,
    varfor: "Mer fibrer och lägre blodsockerpåverkan; kokt potatis (gärna kall i sallad) är dessutom snällare än stekt."
  },
  {
    traffar: ["ketchup", "bbq-sås", "bbq-sas", "sweet chili"],
    byt_namn: "krossade tomater med kryddor – eller mindre mängd",
    behall: false,
    varfor: "Färdiga såser innehåller ofta mycket socker."
  },
  {
    traffar: ["läsk", "lask", "saft", "juice", "energidryck"],
    byt_namn: "vatten med citron/gurka, eller sockerfritt bubbel",
    behall: false,
    varfor: "Söta drycker ger snabba blodsockertoppar utan mättnad."
  }
];

window.LAGG_TILL_TIPS = [
  { namn: "spenat eller grönkål", mangd: 1, enhet: "näve", text: "En näve bladgrönt – fibrer och antioxidanter, syns knappt i grytor, såser och smoothies." },
  { namn: "gurkmeja", mangd: 1, enhet: "tsk", text: "Gurkmeja plus en nypa svartpeppar (pepparen gör gurkmejan mer tillgänglig för kroppen)." },
  { namn: "ingefära", mangd: 1, enhet: "tsk", text: "Riven ingefära – passar i grytor, woks, dressingar och smoothies." },
  { namn: "vitlök", mangd: 1, enhet: "klyfta", text: "En extra vitlöksklyfta." },
  { namn: "olivolja", mangd: 1, enhet: "msk", text: "Byt en del av fettet mot olivolja, eller ringla över precis innan servering." },
  { namn: "valnötter eller solrosfrön", mangd: 1, enhet: "msk", text: "Toppa med nötter eller frön – bra fetter och knaprighet." },
  { namn: "linser eller bönor", mangd: 1, enhet: "dl", text: "Dryga ut med linser eller bönor – mer fibrer och protein, mindre kött behövs." },
  { namn: "citron", mangd: 0.5, enhet: "st", text: "Pressa citron över på slutet – lyfter smaken så att man behöver mindre salt." },
  { namn: "bär", mangd: 1, enhet: "dl", text: "Bär vid sidan av eller på toppen – antioxidanter och naturlig sötma." }
];

// Snabbval: vanliga "mindre bra" ingredienser man kan bocka i för att lägga till
// dem som rader i sitt recept. namn ska matcha någon "traffar" i BYTEN ovan.
window.MINDRE_BRA_CHIPS = [
  { label: "Crème fraiche", namn: "crème fraiche" },
  { label: "Grädde",        namn: "grädde" },
  { label: "Vetemjöl",      namn: "vetemjöl" },
  { label: "Vitt ris",      namn: "vitt ris" },
  { label: "Pasta",         namn: "pasta" },
  { label: "Smör",          namn: "smör" },
  { label: "Margarin",      namn: "margarin" },
  { label: "Socker",        namn: "socker" },
  { label: "Korv / chark",  namn: "korv" },
  { label: "Köttfärs",      namn: "köttfärs" },
  { label: "Vitt bröd",     namn: "vitt bröd" },
  { label: "Ströbröd",      namn: "ströbröd" },
  { label: "Majonnäs",      namn: "majonnäs" },
  { label: "Buljongtärning",namn: "buljongtärning" },
  { label: "Helmjölk",      namn: "helmjölk" },
  { label: "Stekt potatis / pommes", namn: "stekt potatis" },
  { label: "Ketchup / BBQ-sås", namn: "ketchup" }
];

window.TILLAGNINGSTIPS = [
  "Koka, ånga eller tillaga på lägre värme i stället för att steka eller grilla hårt – då bildas mindre AGE:er.",
  "Koka pasta och ris al dente; servera gärna potatis och pasta avsvalnad (t.ex. i sallad) – det ger ett lägre blodsockersvar.",
  "Servera grönsakerna först i måltiden, kolhydraterna sist – se avsnittet om ätordning under «Om kosten».",
  "Smaka av med citron, örter och kryddor i stället för extra salt och färdiga såser.",
  "Byt en del av det röda köttet mot baljväxter eller fisk – behöver inte vara allt."
];
