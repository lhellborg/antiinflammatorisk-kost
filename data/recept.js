/* ============================================================
   RECEPTDATA
   ------------------------------------------------------------
   Så här lägger du till ett nytt recept:
     1. Kopiera ett helt block { ... } nedan, inklusive kommatecknet.
     2. Klistra in det och ändra texten.
     3. Spara filen. Klart – sidan plockar upp det automatiskt.

   Fält:
     id            unik liten text utan mellanslag (t.ex. "lax-quinoa")
     namn          rättens namn
     maltid        en eller flera av: "frukost", "lunch", "middag", "mellanmal"
     tid           ungefärlig tid i minuter
     portioner     hur många portioner mängderna nedan gäller för
                   (besökaren kan ändra antal portioner och då räknas allt om)
     ingredienser  lista med { id, mangd, enhet } där:
                     id    = råvarans id (matcha namnen i js/labels.js)
                     mangd = mängd för "portioner" ovan (null om mängd inte är relevant)
                     enhet = "dl", "msk", "tsk", "krm", "st", "g", "klyfta",
                             "burk", "näve", "cm" ... (tom sträng om ingen enhet)
     mood          en eller flera av:
                     "trott"            – trött / energilös
                     "stressad"         – stressad / behöver något lugnande
                     "forkyld"          – förkyld / krasslig
                     "ont-i-magen"      – orolig mage, vill ha något skonsamt
                     "sugen-pa-sott"    – sugen på något sött
                     "varmt-och-matigt" – vill ha något varmt och mättande
                     "snabbt"           – vill bara ha något snabbt
     allergener    en eller flera av: "gluten", "notter", "agg", "fisk", "mjolk", "soja"
                     (lämna [] om inga av dessa finns med)
     plus          de mest antiinflammatoriska ingredienserna i rätten (visas som taggar)
     beskrivning   en kort mening om rätten
     steg          lista med tillagningssteg (beskriver tillvägagångssättet –
                   mängderna står i ingredienslistan)
   ============================================================ */

window.RECEPT = [

  /* ---------- FRUKOST ---------- */
  {
    id: "bar-chiagrot",
    namn: "Bär- och chiagröt",
    maltid: ["frukost", "mellanmal"],
    tid: 10,
    portioner: 1,
    ingredienser: [
      { id: "havregryn",        mangd: 1, enhet: "dl" },
      { id: "chiafron",         mangd: 1, enhet: "msk" },
      { id: "bar",              mangd: 1, enhet: "dl" },
      { id: "valnotter",        mangd: 1, enhet: "msk" },
      { id: "kanel",            mangd: 1, enhet: "krm" },
      { id: "naturell yoghurt", mangd: 1, enhet: "msk" }
    ],
    mood: ["trott", "ont-i-magen", "snabbt", "sugen-pa-sott"],
    allergener: ["gluten", "notter", "mjolk"],
    plus: ["bär", "chiafrön", "havre", "kanel"],
    beskrivning: "Krämig havregröt toppad med bär, chiafrön och en klick yoghurt.",
    steg: [
      "Koka havregrynen med vatten enligt paketet, rör i chiafröna mot slutet.",
      "Häll upp, toppa med bär, hackade valnötter och kanel.",
      "Lägg en klick naturell yoghurt vid sidan."
    ]
  },
  {
    id: "gron-smoothie",
    namn: "Grön smoothie med spenat och banan",
    maltid: ["frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "spenat",           mangd: 1, enhet: "näve" },
      { id: "banan",            mangd: 1, enhet: "st" },
      { id: "bar",              mangd: 1, enhet: "dl" },
      { id: "chiafron",         mangd: 1, enhet: "msk" },
      { id: "naturell yoghurt", mangd: 1, enhet: "dl" },
      { id: "ingefara",         mangd: 1, enhet: "tsk" }
    ],
    mood: ["snabbt", "trott", "stressad"],
    allergener: ["mjolk"],
    plus: ["spenat", "bär", "chiafrön", "ingefära"],
    beskrivning: "Snabb smoothie som ger fart på morgonen utan socker.",
    steg: [
      "Lägg spenat, banan, bär, riven ingefära och yoghurt i en mixer.",
      "Tillsätt lite vatten och mixa slätt.",
      "Häll upp och strö över chiafrön."
    ]
  },
  {
    id: "agg-avokado-rag",
    namn: "Pocherat ägg på rågbröd med avokado",
    maltid: ["frukost", "lunch"],
    tid: 12,
    portioner: 1,
    ingredienser: [
      { id: "agg",      mangd: 1,    enhet: "st" },
      { id: "avokado",  mangd: 0.5,  enhet: "st" },
      { id: "ragbrod",  mangd: 1,    enhet: "st" },
      { id: "tomat",    mangd: 1,    enhet: "st" },
      { id: "citron",   mangd: 0.25, enhet: "st" },
      { id: "olivolja", mangd: 1,    enhet: "tsk" }
    ],
    mood: ["varmt-och-matigt", "trott"],
    allergener: ["agg", "gluten"],
    plus: ["avokado", "olivolja"],
    beskrivning: "Mättande frukost med bra fetter och protein.",
    steg: [
      "Rosta rågbrödet och bred på mosad avokado med en skvätt citron.",
      "Pochera ägget i sjudande vatten ca 3 minuter.",
      "Lägg ägget ovanpå, toppa med tomatklyftor, olivolja och svartpeppar."
    ]
  },
  {
    id: "overnight-oats",
    namn: "Overnight oats med blåbär och linfrö",
    maltid: ["frukost"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "havregryn",        mangd: 1,   enhet: "dl" },
      { id: "naturell yoghurt", mangd: 1.5, enhet: "dl" },
      { id: "bar",              mangd: 1,   enhet: "dl" },
      { id: "chiafron",         mangd: 1,   enhet: "msk" },
      { id: "linfro",           mangd: 1,   enhet: "msk" },
      { id: "valnotter",        mangd: 1,   enhet: "msk" },
      { id: "kanel",            mangd: 1,   enhet: "krm" }
    ],
    mood: ["snabbt", "ont-i-magen", "sugen-pa-sott"],
    allergener: ["gluten", "mjolk", "notter"],
    plus: ["havre", "bär", "chiafrön", "linfrö", "kanel"],
    beskrivning: "Förbered kvällen innan – klar att äta direkt på morgonen.",
    steg: [
      "Blanda havregryn, yoghurt, chiafrön och linfrö i en burk.",
      "Rör i lite vatten eller växtdryck tills det blir krämigt.",
      "Ställ i kylen över natten. Toppa med bär, valnötter och kanel innan servering."
    ]
  },

  /* ---------- LUNCH ---------- */
  {
    id: "quinoabowl-kikartor",
    namn: "Quinoabowl med rostade kikärtor",
    maltid: ["lunch", "middag"],
    tid: 25,
    portioner: 2,
    ingredienser: [
      { id: "quinoa",   mangd: 1.5, enhet: "dl" },
      { id: "kikartor", mangd: 1,   enhet: "burk" },
      { id: "spenat",   mangd: 2,   enhet: "näve" },
      { id: "tomat",    mangd: 2,   enhet: "st" },
      { id: "paprika",  mangd: 1,   enhet: "st" },
      { id: "avokado",  mangd: 1,   enhet: "st" },
      { id: "olivolja", mangd: 2,   enhet: "msk" },
      { id: "citron",   mangd: 0.5, enhet: "st" },
      { id: "gurkmeja", mangd: 1,   enhet: "tsk" }
    ],
    mood: ["varmt-och-matigt", "stressad"],
    allergener: [],
    plus: ["quinoa", "kikärtor", "spenat", "olivolja", "gurkmeja"],
    beskrivning: "Färgglad matig bowl som funkar lika bra ljummen som kall.",
    steg: [
      "Koka quinoan enligt paketet.",
      "Skölj och torka kikärtorna, vänd dem i hälften av olivoljan, gurkmeja och salt, rosta i ugn 200°C ca 15 min.",
      "Lägg quinoa, spenat, tomat, paprika och avokado i en skål, toppa med kikärtorna.",
      "Ringla över resten av olivoljan och pressa citron."
    ]
  },
  {
    id: "linssoppa",
    namn: "Krämig röd linssoppa med ingefära",
    maltid: ["lunch", "middag"],
    tid: 30,
    portioner: 4,
    ingredienser: [
      { id: "linser",   mangd: 3,   enhet: "dl" },
      { id: "lok",      mangd: 1,   enhet: "st" },
      { id: "vitlok",   mangd: 2,   enhet: "klyfta" },
      { id: "tomat",    mangd: 1,   enhet: "burk" },
      { id: "ingefara", mangd: 1,   enhet: "msk" },
      { id: "gurkmeja", mangd: 1,   enhet: "tsk" },
      { id: "olivolja", mangd: 2,   enhet: "msk" },
      { id: "citron",   mangd: 0.5, enhet: "st" }
    ],
    mood: ["forkyld", "varmt-och-matigt", "ont-i-magen", "stressad"],
    allergener: [],
    plus: ["linser", "ingefära", "gurkmeja", "vitlök", "olivolja"],
    beskrivning: "Värmande soppa som känns extra bra när man är krasslig.",
    steg: [
      "Fräs hackad lök, vitlök och riven ingefära i olivoljan.",
      "Tillsätt sköljda röda linser, krossade tomater, gurkmeja och vatten så det täcker.",
      "Sjud ca 20 min tills linserna är mjuka, mixa slätt om du vill.",
      "Smaka av med salt och citron."
    ]
  },
  {
    id: "laxsallad",
    namn: "Laxsallad med avokado och fullkorn",
    maltid: ["lunch"],
    tid: 15,
    portioner: 1,
    ingredienser: [
      { id: "lax",       mangd: 100,  enhet: "g" },
      { id: "spenat",    mangd: 1,    enhet: "näve" },
      { id: "fullkorn",  mangd: 1,    enhet: "dl" },
      { id: "avokado",   mangd: 0.5,  enhet: "st" },
      { id: "tomat",     mangd: 1,    enhet: "st" },
      { id: "valnotter", mangd: 1,    enhet: "msk" },
      { id: "olivolja",  mangd: 1,    enhet: "msk" },
      { id: "citron",    mangd: 0.25, enhet: "st" }
    ],
    mood: ["snabbt", "trott"],
    allergener: ["fisk", "notter"],
    plus: ["lax", "avokado", "spenat", "olivolja", "valnötter"],
    beskrivning: "Snabb sallad full av omega-3 och bra fetter.",
    steg: [
      "Lägg spenat och kokt fullkorn (t.ex. matvete eller korn) i en skål.",
      "Toppa med varmrökt eller stekt lax i bitar, avokado och tomat.",
      "Strö över valnötter, ringla olivolja och pressa citron."
    ]
  },
  {
    id: "kikartsroror-wrap",
    namn: "Wrap med kryddiga kikärtor och yoghurtsås",
    maltid: ["lunch", "mellanmal"],
    tid: 15,
    portioner: 2,
    ingredienser: [
      { id: "kikartor",         mangd: 1, enhet: "burk" },
      { id: "tortilla",         mangd: 2, enhet: "st" },
      { id: "spenat",           mangd: 2, enhet: "näve" },
      { id: "tomat",            mangd: 1, enhet: "st" },
      { id: "paprika",          mangd: 1, enhet: "st" },
      { id: "naturell yoghurt", mangd: 1, enhet: "dl" },
      { id: "vitlok",           mangd: 1, enhet: "klyfta" },
      { id: "olivolja",         mangd: 1, enhet: "msk" },
      { id: "gurkmeja",         mangd: 1, enhet: "tsk" }
    ],
    mood: ["snabbt", "varmt-och-matigt"],
    allergener: ["gluten", "mjolk"],
    plus: ["kikärtor", "spenat", "gurkmeja", "vitlök"],
    beskrivning: "Går snabbt och funkar lika bra som matlåda.",
    steg: [
      "Stek de sköljda kikärtorna i olivoljan med gurkmeja, paprikapulver och salt.",
      "Rör ihop yoghurten med pressad vitlök och lite citron.",
      "Fyll tortillan med spenat, tomat, paprika, kikärtorna och såsen. Rulla ihop."
    ]
  },

  /* ---------- MIDDAG ---------- */
  {
    id: "ugnsbakad-lax",
    namn: "Ugnsbakad lax med broccoli och quinoa",
    maltid: ["middag"],
    tid: 30,
    portioner: 2,
    ingredienser: [
      { id: "lax",      mangd: 2,   enhet: "st" },
      { id: "broccoli", mangd: 250, enhet: "g" },
      { id: "quinoa",   mangd: 1.5, enhet: "dl" },
      { id: "citron",   mangd: 0.5, enhet: "st" },
      { id: "olivolja", mangd: 1,   enhet: "msk" },
      { id: "vitlok",   mangd: 1,   enhet: "klyfta" }
    ],
    mood: ["varmt-och-matigt", "trott"],
    allergener: ["fisk"],
    plus: ["lax", "broccoli", "quinoa", "olivolja"],
    beskrivning: "Klassisk vardagsmiddag som nästan lagar sig själv i ugnen.",
    steg: [
      "Lägg laxbitarna i en ugnsform med citronskivor, olivolja, hackad vitlök, salt och peppar.",
      "Baka i 200°C ca 15 min. Lägg i broccolibuketter de sista 10 minuterna.",
      "Koka quinoan under tiden. Servera med en extra skvätt olivolja."
    ]
  },
  {
    id: "kycklinggryta-gurkmeja",
    namn: "Kycklinggryta med gurkmeja och spenat",
    maltid: ["middag"],
    tid: 35,
    portioner: 4,
    ingredienser: [
      { id: "kyckling", mangd: 600, enhet: "g" },
      { id: "lok",      mangd: 1,   enhet: "st" },
      { id: "vitlok",   mangd: 2,   enhet: "klyfta" },
      { id: "tomat",    mangd: 1,   enhet: "burk" },
      { id: "spenat",   mangd: 2,   enhet: "näve" },
      { id: "gurkmeja", mangd: 1,   enhet: "tsk" },
      { id: "ingefara", mangd: 1,   enhet: "msk" },
      { id: "olivolja", mangd: 2,   enhet: "msk" },
      { id: "ris",      mangd: 3,   enhet: "dl" }
    ],
    mood: ["varmt-och-matigt", "forkyld", "stressad"],
    allergener: [],
    plus: ["gurkmeja", "ingefära", "spenat", "vitlök"],
    beskrivning: "Mustig gryta med värmande kryddor – mat som kramar om en.",
    steg: [
      "Bryn kycklingbitarna i olivoljan, ta upp.",
      "Fräs hackad lök, vitlök, riven ingefära och gurkmeja i samma panna.",
      "Tillsätt krossade tomater och kycklingen, sjud ca 20 min.",
      "Rör ner spenaten på slutet. Servera med kokt fullkornsris."
    ]
  },
  {
    id: "linsbolognese",
    namn: "Linsbolognese på fullkornspasta",
    maltid: ["middag"],
    tid: 30,
    portioner: 4,
    ingredienser: [
      { id: "linser",         mangd: 3,   enhet: "dl" },
      { id: "lok",            mangd: 1,   enhet: "st" },
      { id: "vitlok",         mangd: 2,   enhet: "klyfta" },
      { id: "tomat",          mangd: 2,   enhet: "burk" },
      { id: "paprika",        mangd: 1,   enhet: "st" },
      { id: "olivolja",       mangd: 2,   enhet: "msk" },
      { id: "fullkornspasta", mangd: 320, enhet: "g" }
    ],
    mood: ["varmt-och-matigt"],
    allergener: ["gluten"],
    plus: ["linser", "tomat", "vitlök", "olivolja"],
    beskrivning: "Vegetarisk bolognese med fyllig smak och massor av fibrer.",
    steg: [
      "Fräs hackad lök, vitlök och hackad paprika i olivoljan.",
      "Tillsätt sköljda röda linser och krossade tomater, sjud ca 20 min tills linserna mjuknar.",
      "Smaka av med oregano, salt och peppar. Servera med kokt fullkornspasta."
    ]
  },
  {
    id: "ugnsgronsaker-kikartor",
    namn: "Ugnsrostade rotsaker med kikärtor",
    maltid: ["middag", "lunch"],
    tid: 40,
    portioner: 3,
    ingredienser: [
      { id: "kikartor", mangd: 1,   enhet: "burk" },
      { id: "morot",    mangd: 3,   enhet: "st" },
      { id: "rodbeta",  mangd: 2,   enhet: "st" },
      { id: "lok",      mangd: 1,   enhet: "st" },
      { id: "vitlok",   mangd: 2,   enhet: "klyfta" },
      { id: "olivolja", mangd: 3,   enhet: "msk" },
      { id: "spenat",   mangd: 3,   enhet: "näve" },
      { id: "citron",   mangd: 0.5, enhet: "st" }
    ],
    mood: ["varmt-och-matigt", "stressad"],
    allergener: [],
    plus: ["kikärtor", "olivolja", "vitlök"],
    beskrivning: "En plåt i ugnen – minimal disk, maximal smak.",
    steg: [
      "Skär rotsakerna i bitar, blanda med sköljda kikärtor, olivolja, hackad vitlök och salt på en plåt.",
      "Rosta i 220°C ca 30 min tills allt fått färg.",
      "Servera på en bädd av spenat med en skvätt citron (och tahini om du har)."
    ]
  },

  /* ---------- MELLANMÅL ---------- */
  {
    id: "yoghurt-bar-notter",
    namn: "Yoghurt med bär, valnötter och kanel",
    maltid: ["mellanmal", "frukost"],
    tid: 3,
    portioner: 1,
    ingredienser: [
      { id: "naturell yoghurt", mangd: 2, enhet: "dl" },
      { id: "bar",              mangd: 1, enhet: "dl" },
      { id: "valnotter",        mangd: 1, enhet: "msk" },
      { id: "chiafron",         mangd: 1, enhet: "tsk" },
      { id: "kanel",            mangd: 1, enhet: "krm" }
    ],
    mood: ["snabbt", "sugen-pa-sott", "ont-i-magen"],
    allergener: ["mjolk", "notter"],
    plus: ["bär", "valnötter", "kanel", "chiafrön"],
    beskrivning: "Det enklaste mellanmålet – klart på en minut.",
    steg: [
      "Häll upp naturell yoghurt (gärna grekisk eller turkisk) i en skål.",
      "Toppa med bär, hackade valnötter, chiafrön och kanel."
    ]
  },
  {
    id: "rostade-kikartor-snack",
    namn: "Krispiga ugnsrostade kikärtor",
    maltid: ["mellanmal"],
    tid: 30,
    portioner: 2,
    ingredienser: [
      { id: "kikartor", mangd: 1, enhet: "burk" },
      { id: "olivolja", mangd: 1, enhet: "msk" },
      { id: "gurkmeja", mangd: 1, enhet: "tsk" }
    ],
    mood: ["sugen-pa-sott", "snabbt"],
    allergener: [],
    plus: ["kikärtor", "olivolja", "gurkmeja"],
    beskrivning: "Krispigt knaprigt – ett bättre alternativ till chips.",
    steg: [
      "Skölj och torka kikärtorna väl.",
      "Blanda med olivolja, gurkmeja, paprikapulver och salt.",
      "Rosta i 200°C ca 25–30 min tills de är krispiga."
    ]
  },
  {
    id: "appelskivor-mandelsmor",
    namn: "Äppelskivor med mandelsmör och kanel",
    maltid: ["mellanmal"],
    tid: 3,
    portioner: 1,
    ingredienser: [
      { id: "apple",    mangd: 1, enhet: "st" },
      { id: "mandel",   mangd: 1, enhet: "msk" },
      { id: "chiafron", mangd: 1, enhet: "tsk" },
      { id: "kanel",    mangd: 1, enhet: "krm" }
    ],
    mood: ["sugen-pa-sott", "snabbt"],
    allergener: ["notter"],
    plus: ["mandel", "kanel"],
    beskrivning: "Sött, krispigt och mättande utan tillsatt socker.",
    steg: [
      "Skiva äpplet.",
      "Bred eller ringla över mandelsmör.",
      "Strö över kanel och chiafrön."
    ]
  },
  {
    id: "ingefarashot-citrus",
    namn: "Ingefärsshot med citron",
    maltid: ["mellanmal"],
    tid: 5,
    portioner: 2,
    ingredienser: [
      { id: "ingefara", mangd: 3,   enhet: "cm" },
      { id: "citron",   mangd: 0.5, enhet: "st" },
      { id: "gurkmeja", mangd: 1,   enhet: "krm" }
    ],
    mood: ["forkyld", "snabbt"],
    allergener: [],
    plus: ["ingefära", "gurkmeja", "citron"],
    beskrivning: "Liten pepp när halsen skaver eller du behöver en kick.",
    steg: [
      "Pressa eller mixa ingefäran med pressad citron.",
      "Tillsätt gurkmeja och lite vatten.",
      "Sila och drick som en shot."
    ]
  }

];
