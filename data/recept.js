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
    maltid: ["smoothies", "frukost", "mellanmal"],
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
    mood: ["snabbt", "trott", "stressad", "sugen-pa-gront", "efter-traning"],
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
    mood: ["snabbt", "ont-i-magen", "sugen-pa-sott", "dalig-somn"],
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
    mood: ["varmt-och-matigt", "stressad", "sugen-pa-gront", "efter-traning"],
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
    mood: ["snabbt", "trott", "sugen-pa-gront", "vill-ata-latt", "efter-traning"],
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
    mood: ["varmt-och-matigt", "trott", "vill-bjuda", "efter-traning"],
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
    mood: ["snabbt", "sugen-pa-sott", "ont-i-magen", "dalig-somn", "efter-traning"],
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
  },

  /* ---------- FLER RECEPT (antiinflammatorisk livsstil – inspirerat av bl.a. Maria Borelius idéer om mat i regnbågens färger, bra fetter, fermenterat och kryddor) ---------- */
  {
    id: "gyllene-grot",
    namn: "Gyllene havregröt med gurkmeja och päron",
    maltid: ["frukost"],
    tid: 10,
    portioner: 1,
    ingredienser: [
      { id: "havregryn", mangd: 1,   enhet: "dl" },
      { id: "vaxtdryck", mangd: 2,   enhet: "dl" },
      { id: "gurkmeja",  mangd: 0.5, enhet: "tsk" },
      { id: "kanel",     mangd: 1,   enhet: "krm" },
      { id: "ingefara",  mangd: 0.5, enhet: "tsk" },
      { id: "valnotter", mangd: 1,   enhet: "msk" },
      { id: "bar",       mangd: 1,   enhet: "dl" }
    ],
    mood: ["trott", "ont-i-magen", "varmt-och-matigt", "dalig-somn", "snabbt"],
    allergener: ["gluten", "notter"],
    plus: ["havre", "gurkmeja", "ingefära", "kanel", "valnötter", "bär"],
    beskrivning: "Värmande gröt kokad på växtdryck med gurkmeja, ingefära och en nypa svartpeppar.",
    steg: [
      "Koka havregrynen med växtdryck och en skvätt vatten enligt paketet.",
      "Rör i gurkmeja, kanel, riven ingefära och en liten nypa svartpeppar mot slutet.",
      "Häll upp och toppa med bär och hackade valnötter."
    ]
  },
  {
    id: "protein-smoothie-blabar",
    namn: "Proteinsmoothie med blåbär, mandel och frön",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "vaxtdryck",     mangd: 2.5, enhet: "dl" },
      { id: "proteinpulver", mangd: 1,   enhet: "msk" },
      { id: "bar",           mangd: 1.5, enhet: "dl" },
      { id: "banan",         mangd: 0.5, enhet: "st" },
      { id: "chiafron",      mangd: 1,   enhet: "msk" },
      { id: "mandel",        mangd: 1,   enhet: "msk" }
    ],
    mood: ["efter-traning", "snabbt", "trott", "sugen-pa-sott"],
    allergener: ["notter"],
    plus: ["bär", "chiafrön", "mandel"],
    beskrivning: "Mättande morgon- eller återhämtningssmoothie utan tillsatt socker (välj växtbaserat proteinpulver om du undviker mjölk).",
    steg: [
      "Lägg allt i en mixer (spara lite bär till toppen).",
      "Mixa slätt, tillsätt mer växtdryck om du vill ha den tunnare.",
      "Häll upp och strö över de sparade bären."
    ]
  },
  {
    id: "aggrora-spenat-avokadotoast",
    namn: "Äggröra med spenat på avokadotoast",
    maltid: ["frukost", "lunch"],
    tid: 12,
    portioner: 1,
    ingredienser: [
      { id: "agg",      mangd: 2,    enhet: "st" },
      { id: "spenat",   mangd: 1,    enhet: "näve" },
      { id: "avokado",  mangd: 0.5,  enhet: "st" },
      { id: "ragbrod",  mangd: 1,    enhet: "skiva" },
      { id: "tomat",    mangd: 1,    enhet: "st" },
      { id: "olivolja", mangd: 1,    enhet: "tsk" },
      { id: "citron",   mangd: 0.25, enhet: "st" }
    ],
    mood: ["efter-traning", "varmt-och-matigt", "trott"],
    allergener: ["agg", "gluten"],
    plus: ["spenat", "avokado", "olivolja"],
    beskrivning: "Krämig äggröra med spenat på en skiva rostat rågbröd med mosad avokado.",
    steg: [
      "Vispa äggen löst, häll i en kall stekpanna med olivoljan och rör på låg värme tills krämigt. Rör ner spenaten på slutet.",
      "Rosta rågbrödet och bred på mosad avokado med en skvätt citron.",
      "Lägg äggröran ovanpå och servera med tomatklyftor."
    ]
  },
  {
    id: "kefirbowl-granatapple",
    namn: "Kefirbowl med bär, granatäpple och frön",
    maltid: ["frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "kefir",       mangd: 2,   enhet: "dl" },
      { id: "bar",         mangd: 1,   enhet: "dl" },
      { id: "granatapple", mangd: 0.5, enhet: "st" },
      { id: "chiafron",    mangd: 1,   enhet: "tsk" },
      { id: "pumpafron",   mangd: 1,   enhet: "msk" },
      { id: "valnotter",   mangd: 1,   enhet: "msk" }
    ],
    mood: ["snabbt", "ont-i-magen", "sugen-pa-sott", "sugen-pa-gront", "efter-traning"],
    allergener: ["mjolk", "notter"],
    plus: ["bär", "granatäpple", "chiafrön", "valnötter"],
    beskrivning: "Fermenterad kefir toppad med bär, granatäpplekärnor och frön – probiotika och antioxidanter i en skål.",
    steg: [
      "Häll kefiren i en skål.",
      "Toppa med bär, granatäpplekärnor, chiafrön, pumpafrön och hackade valnötter."
    ]
  },
  {
    id: "regnbagssallad-kikartor-tahini",
    namn: "Regnbågssallad med rostade kikärtor och tahinidressing",
    maltid: ["lunch", "middag"],
    tid: 30,
    portioner: 2,
    ingredienser: [
      { id: "kikartor",    mangd: 1,   enhet: "burk" },
      { id: "gronkal",     mangd: 2,   enhet: "näve" },
      { id: "morot",       mangd: 2,   enhet: "st" },
      { id: "rodbeta",     mangd: 1,   enhet: "st" },
      { id: "avokado",     mangd: 1,   enhet: "st" },
      { id: "granatapple", mangd: 0.5, enhet: "st" },
      { id: "tahini",      mangd: 2,   enhet: "msk" },
      { id: "citron",      mangd: 0.5, enhet: "st" },
      { id: "olivolja",    mangd: 2,   enhet: "msk" },
      { id: "gurkmeja",    mangd: 1,   enhet: "tsk" }
    ],
    mood: ["sugen-pa-gront", "vill-ata-latt", "vill-bjuda", "varmt-och-matigt", "fest"],
    allergener: [],
    plus: ["kikärtor", "grönkål", "rödbeta", "avokado", "olivolja", "gurkmeja", "granatäpple"],
    beskrivning: "En tallrik i regnbågens färger – mycket grönt, bra fetter och en krämig tahinidressing.",
    steg: [
      "Skölj och torka kikärtorna, vänd i hälften av olivoljan, gurkmeja och salt. Rosta i ugn 200°C ca 15 min.",
      "Massera grönkålen med lite olivolja och citron. Riv eller hyvla morot och rödbeta tunt.",
      "Rör ihop tahini med citron, lite vatten och salt till en len dressing.",
      "Lägg upp grönsakerna, toppa med kikärtor, avokado och granatäpplekärnor, ringla över dressingen."
    ]
  },
  {
    id: "sardiner-ragbrod",
    namn: "Sardiner på rågbröd med tomat och rödlök",
    maltid: ["lunch", "mellanmal"],
    tid: 8,
    portioner: 1,
    ingredienser: [
      { id: "sardiner",  mangd: 1,    enhet: "burk" },
      { id: "ragbrod",   mangd: 2,    enhet: "skiva" },
      { id: "tomat",     mangd: 1,    enhet: "st" },
      { id: "lok",       mangd: 0.25, enhet: "st" },
      { id: "citron",    mangd: 0.25, enhet: "st" },
      { id: "olivolja",  mangd: 1,    enhet: "tsk" }
    ],
    mood: ["snabbt", "efter-traning", "trott"],
    allergener: ["fisk", "gluten"],
    plus: ["sardiner", "olivolja", "tomat"],
    beskrivning: "Snabb, billig och full av omega-3 – sardiner är en av de mest antiinflammatoriska fiskarna.",
    steg: [
      "Rosta rågbrödet.",
      "Lägg på sardinerna, tomatskivor och tunt skivad rödlök.",
      "Ringla över olivolja och pressa lite citron, mald svartpeppar ovanpå."
    ]
  },
  {
    id: "sotpotatissoppa-ingefara",
    namn: "Krämig sötpotatissoppa med ingefära och kokosmjölk",
    maltid: ["lunch", "middag"],
    tid: 35,
    portioner: 4,
    ingredienser: [
      { id: "sotpotatis", mangd: 700, enhet: "g" },
      { id: "lok",        mangd: 1,   enhet: "st" },
      { id: "vitlok",     mangd: 2,   enhet: "klyfta" },
      { id: "ingefara",   mangd: 1,   enhet: "msk" },
      { id: "gurkmeja",   mangd: 1,   enhet: "tsk" },
      { id: "kokosmjolk", mangd: 2,   enhet: "dl" },
      { id: "olivolja",   mangd: 2,   enhet: "msk" },
      { id: "citron",     mangd: 0.5, enhet: "st" }
    ],
    mood: ["forkyld", "varmt-och-matigt", "ont-i-magen", "vill-ata-latt", "stressad"],
    allergener: [],
    plus: ["sötpotatis", "ingefära", "gurkmeja", "vitlök", "olivolja"],
    beskrivning: "Sammetslen, värmande soppa med massor av betakaroten och värmande kryddor.",
    steg: [
      "Fräs hackad lök, vitlök och riven ingefära i olivoljan tills mjukt.",
      "Tillsätt sötpotatis i bitar, gurkmeja och vatten så det nästan täcker. Sjud ca 20 min.",
      "Rör i kokosmjölken och mixa slätt. Smaka av med salt och citron."
    ]
  },
  {
    id: "gronkalssallad-quinoa-tofu",
    namn: "Grönkålssallad med quinoa och stekt tofu",
    maltid: ["lunch", "middag"],
    tid: 25,
    portioner: 2,
    ingredienser: [
      { id: "gronkal",   mangd: 2,   enhet: "näve" },
      { id: "quinoa",    mangd: 1.5, enhet: "dl" },
      { id: "tofu",      mangd: 250, enhet: "g" },
      { id: "avokado",   mangd: 1,   enhet: "st" },
      { id: "tomat",     mangd: 2,   enhet: "st" },
      { id: "pumpafron", mangd: 2,   enhet: "msk" },
      { id: "olivolja",  mangd: 2,   enhet: "msk" },
      { id: "citron",    mangd: 0.5, enhet: "st" },
      { id: "gurkmeja",  mangd: 0.5, enhet: "tsk" }
    ],
    mood: ["sugen-pa-gront", "efter-traning", "vill-ata-latt", "varmt-och-matigt"],
    allergener: ["soja"],
    plus: ["grönkål", "quinoa", "avokado", "olivolja", "gurkmeja"],
    beskrivning: "Matig grön sallad med protein från quinoa och tofu – mättar utan att vara tung.",
    steg: [
      "Koka quinoan enligt paketet.",
      "Skär tofun i tärningar, vänd i lite olivolja och gurkmeja, stek krispig i het panna.",
      "Massera grönkålen med olivolja och citron. Blanda med quinoa, tomat och avokado.",
      "Toppa med den stekta tofun och pumpafrön, ringla över resten av olivoljan."
    ]
  },
  {
    id: "ugnslax-rotsaker-gurkmeja",
    namn: "Ugnslax med rostade rotsaker och gurkmeja",
    maltid: ["middag"],
    tid: 40,
    portioner: 3,
    ingredienser: [
      { id: "lax",        mangd: 3,   enhet: "st" },
      { id: "morot",      mangd: 3,   enhet: "st" },
      { id: "rodbeta",    mangd: 2,   enhet: "st" },
      { id: "sotpotatis", mangd: 1,   enhet: "st" },
      { id: "lok",        mangd: 1,   enhet: "st" },
      { id: "vitlok",     mangd: 2,   enhet: "klyfta" },
      { id: "olivolja",   mangd: 3,   enhet: "msk" },
      { id: "gurkmeja",   mangd: 1,   enhet: "tsk" },
      { id: "citron",     mangd: 0.5, enhet: "st" }
    ],
    mood: ["varmt-och-matigt", "vill-bjuda", "efter-traning", "fest"],
    allergener: ["fisk"],
    plus: ["lax", "rödbeta", "sötpotatis", "morot", "olivolja", "gurkmeja"],
    beskrivning: "En plåt: omega-3-rik lax tillsammans med färgglada rotsaker kryddade med gurkmeja.",
    steg: [
      "Skär rotsakerna i bitar, blanda med 2 msk olivolja, hackad vitlök, gurkmeja och salt på en plåt. Rosta i 220°C ca 20 min.",
      "Lägg laxbitarna ovanpå med citronskivor och resten av olivoljan, baka ytterligare ca 12–15 min.",
      "Pressa lite citron över precis innan servering."
    ]
  },
  {
    id: "linsdal-spenat-kokos",
    namn: "Röd linsdal med spenat och kokosmjölk",
    maltid: ["middag", "lunch"],
    tid: 30,
    portioner: 4,
    ingredienser: [
      { id: "linser",     mangd: 3,   enhet: "dl" },
      { id: "lok",        mangd: 1,   enhet: "st" },
      { id: "vitlok",     mangd: 2,   enhet: "klyfta" },
      { id: "ingefara",   mangd: 1,   enhet: "msk" },
      { id: "gurkmeja",   mangd: 1,   enhet: "tsk" },
      { id: "tomat",      mangd: 1,   enhet: "burk" },
      { id: "kokosmjolk", mangd: 2,   enhet: "dl" },
      { id: "spenat",     mangd: 2,   enhet: "näve" },
      { id: "ris",        mangd: 3,   enhet: "dl" },
      { id: "olivolja",   mangd: 2,   enhet: "msk" }
    ],
    mood: ["varmt-och-matigt", "forkyld", "stressad", "dalig-somn"],
    allergener: [],
    plus: ["linser", "ingefära", "gurkmeja", "spenat", "vitlök"],
    beskrivning: "Mustig indiskinspirerad linsgryta med värmande kryddor – billig, matig och rik på fibrer.",
    steg: [
      "Fräs hackad lök, vitlök och riven ingefära i olivoljan. Rör i gurkmeja.",
      "Tillsätt sköljda röda linser, krossade tomater och vatten så det täcker. Sjud ca 15 min.",
      "Rör i kokosmjölken och låt sjuda några minuter till. Vänd ner spenaten på slutet.",
      "Servera med kokt fullkornsris."
    ]
  },
  {
    id: "fullkornspasta-tomat-spenat-valnotter",
    namn: "Fullkornspasta med tomatsås, spenat och valnötter",
    maltid: ["middag"],
    tid: 20,
    portioner: 3,
    ingredienser: [
      { id: "fullkornspasta", mangd: 240, enhet: "g" },
      { id: "tomat",          mangd: 1,   enhet: "burk" },
      { id: "lok",            mangd: 1,   enhet: "st" },
      { id: "vitlok",         mangd: 2,   enhet: "klyfta" },
      { id: "spenat",         mangd: 2,   enhet: "näve" },
      { id: "valnotter",      mangd: 1,   enhet: "dl" },
      { id: "olivolja",       mangd: 2,   enhet: "msk" }
    ],
    mood: ["varmt-och-matigt", "snabbt", "vill-ata-latt"],
    allergener: ["gluten", "notter"],
    plus: ["tomat", "spenat", "vitlök", "olivolja", "valnötter"],
    beskrivning: "Vardagspasta med snabb tomatsås, en näve spenat och rostade valnötter för knaprighet och bra fetter.",
    steg: [
      "Koka fullkornspastan al dente.",
      "Fräs hackad lök och vitlök i olivoljan, tillsätt krossade tomater och låt sjuda 10 min. Smaka av med salt, peppar och oregano.",
      "Rör ner spenaten i såsen tills den faller ihop. Rosta valnötterna torra i en panna.",
      "Blanda pastan med såsen och toppa med valnötterna."
    ]
  },
  {
    id: "golden-milk",
    namn: "Guldmjölk (golden milk) med gurkmeja och ingefära",
    maltid: ["mellanmal"],
    tid: 8,
    portioner: 1,
    ingredienser: [
      { id: "vaxtdryck", mangd: 2.5, enhet: "dl" },
      { id: "gurkmeja",  mangd: 0.5, enhet: "tsk" },
      { id: "ingefara",  mangd: 0.5, enhet: "tsk" },
      { id: "kanel",     mangd: 1,   enhet: "krm" }
    ],
    mood: ["forkyld", "dalig-somn", "ont-i-magen", "sugen-pa-sott"],
    allergener: [],
    plus: ["gurkmeja", "ingefära", "kanel"],
    beskrivning: "Lugnande varm dryck med gurkmeja, ingefära, kanel och en nypa svartpeppar (som gör gurkmejan mer tillgänglig).",
    steg: [
      "Värm växtdrycken i en kastrull (koka inte).",
      "Vispa i gurkmeja, riven ingefära, kanel och en liten nypa svartpeppar.",
      "Sila om du vill ha den helt slät och drick varm."
    ]
  },
  {
    id: "morkchoklad-valnotter-bar",
    namn: "Mörk choklad med valnötter och bär",
    maltid: ["mellanmal"],
    tid: 3,
    portioner: 1,
    ingredienser: [
      { id: "morkchoklad", mangd: 20, enhet: "g" },
      { id: "valnotter",   mangd: 1,  enhet: "msk" },
      { id: "bar",         mangd: 1,  enhet: "dl" }
    ],
    mood: ["sugen-pa-sott", "snabbt", "vill-bjuda"],
    allergener: ["notter"],
    plus: ["bär", "valnötter"],
    beskrivning: "Ett litet 'gott' som ändå bidrar – mörk choklad (70%+) har polyfenoler, valnötter bra fetter och bären antioxidanter.",
    steg: [
      "Bryt en bit mörk choklad.",
      "Ät tillsammans med en näve bär och några valnötter."
    ]
  },
  {
    id: "grontstavar-tahinidipp",
    namn: "Grönsaksstavar med tahinidipp",
    maltid: ["mellanmal"],
    tid: 6,
    portioner: 2,
    ingredienser: [
      { id: "morot",   mangd: 2,   enhet: "st" },
      { id: "paprika", mangd: 1,   enhet: "st" },
      { id: "tahini",  mangd: 3,   enhet: "msk" },
      { id: "citron",  mangd: 0.5, enhet: "st" },
      { id: "vitlok",  mangd: 0.5, enhet: "klyfta" }
    ],
    mood: ["sugen-pa-gront", "snabbt", "vill-ata-latt"],
    allergener: [],
    plus: ["morot", "paprika"],
    beskrivning: "Knaprigt mellanmål – grönsaksstavar med en krämig tahinidipp i stället för chips och dipp.",
    steg: [
      "Skär morot och paprika i stavar.",
      "Rör ihop tahini med pressad vitlök, citron, en nypa salt och lite vatten tills dippig.",
      "Servera stavarna med dippen."
    ]
  },

  /* ---------- FESTMÅLTID (förrätt / huvudrätt / efterrätt + tilltugg) ---------- */
  {
    id: "rodbetscarpaccio-valnotter",
    namn: "Rödbetscarpaccio med valnötter, ruccola & citron",
    maltid: ["forratt"],
    tid: 15,
    portioner: 4,
    ingredienser: [
      { id: "rodbeta",     mangd: 3,   enhet: "st" },
      { id: "ruccola",     mangd: 2,   enhet: "näve" },
      { id: "valnotter",   mangd: 1,   enhet: "dl" },
      { id: "granatapple", mangd: 0.5, enhet: "st" },
      { id: "olivolja",    mangd: 2,   enhet: "msk" },
      { id: "citron",      mangd: 0.5, enhet: "st" }
    ],
    mood: ["fest", "sugen-pa-gront", "vill-bjuda", "vill-ata-latt"],
    allergener: ["notter"],
    plus: ["rödbeta", "valnötter", "olivolja", "granatäpple"],
    beskrivning: "Vacker förrätt: tunt skivad rödbeta med ruccola, rostade valnötter och granatäpple.",
    steg: [
      "Koka rödbetorna mjuka (eller använd färdigkokta), skala och skiva mycket tunt – lägg ut på ett fat.",
      "Rosta valnötterna torra i en panna och hacka grovt.",
      "Strö ruccola, valnötter och granatäpplekärnor över. Ringla olivolja, pressa citron och toppa med flingsalt och svartpeppar."
    ]
  },
  {
    id: "avokado-rakrora-knacke",
    namn: "Avokado- och räkröra på rågknäcke",
    maltid: ["forratt", "mellanmal"],
    tid: 12,
    portioner: 4,
    ingredienser: [
      { id: "rakor",       mangd: 200, enhet: "g" },
      { id: "avokado",     mangd: 1,   enhet: "st" },
      { id: "citron",      mangd: 0.5, enhet: "st" },
      { id: "ruccola",     mangd: 1,   enhet: "näve" },
      { id: "knackebrod",  mangd: 8,   enhet: "st" }
    ],
    mood: ["fest", "snabbt", "vill-bjuda", "efter-traning"],
    allergener: ["fisk", "gluten"],
    plus: ["räkor", "avokado"],
    beskrivning: "En lättare räkröra på avokado i stället för majonnäs – klickas på rågknäcke.",
    steg: [
      "Mosa avokadon med pressad citron, salt och svartpeppar.",
      "Vänd försiktigt ner de avrunna räkorna.",
      "Klicka på rågknäcke, toppa med lite ruccola och en extra skvätt citron."
    ]
  },
  {
    id: "hummus-rodbeta-granatapple",
    namn: "Rödbetshummus med granatäpple & grönsaksstavar",
    maltid: ["forratt", "mellanmal"],
    tid: 20,
    portioner: 4,
    ingredienser: [
      { id: "kikartor",    mangd: 1,   enhet: "burk" },
      { id: "rodbeta",     mangd: 1,   enhet: "st" },
      { id: "tahini",      mangd: 2,   enhet: "msk" },
      { id: "vitlok",      mangd: 1,   enhet: "klyfta" },
      { id: "citron",      mangd: 0.5, enhet: "st" },
      { id: "olivolja",    mangd: 2,   enhet: "msk" },
      { id: "granatapple", mangd: 0.5, enhet: "st" },
      { id: "morot",       mangd: 2,   enhet: "st" },
      { id: "paprika",     mangd: 1,   enhet: "st" }
    ],
    mood: ["fest", "sugen-pa-gront", "vill-ata-latt", "vill-bjuda"],
    allergener: [],
    plus: ["kikärtor", "rödbeta", "olivolja", "vitlök", "granatäpple"],
    beskrivning: "Knallrosa hummus att doppa grönsaksstavar i – festlig och full av fibrer.",
    steg: [
      "Riv eller koka rödbetan mjuk. Mixa kikärtor, rödbeta, tahini, vitlök, citron, olivolja och salt slätt – späd med lite vatten.",
      "Lägg upp i en skål, gröp ur en liten brunn och ringla i olivolja, strö över granatäpplekärnor.",
      "Servera med morots- och paprikastavar."
    ]
  },
  {
    id: "helstekt-ugnslax-fankal",
    namn: "Helstekt ugnslax med citron, fänkål & rotsaksfat",
    maltid: ["middag"],
    tid: 45,
    portioner: 6,
    ingredienser: [
      { id: "lax",      mangd: 800, enhet: "g" },
      { id: "fankal",   mangd: 2,   enhet: "st" },
      { id: "morot",    mangd: 4,   enhet: "st" },
      { id: "rodbeta",  mangd: 2,   enhet: "st" },
      { id: "lok",      mangd: 1,   enhet: "st" },
      { id: "vitlok",   mangd: 3,   enhet: "klyfta" },
      { id: "citron",   mangd: 1,   enhet: "st" },
      { id: "olivolja", mangd: 4,   enhet: "msk" }
    ],
    mood: ["fest", "vill-bjuda", "varmt-och-matigt", "efter-traning"],
    allergener: ["fisk"],
    plus: ["lax", "fänkål", "rödbeta", "morot", "olivolja"],
    beskrivning: "En hel laxsida i ugnen tillsammans med ett fat av rostad fänkål och rotsaker – enkelt men festligt.",
    steg: [
      "Skär fänkål, morot, rödbeta och lök i bitar. Blanda med 3 msk olivolja, hackad vitlök och salt på en plåt. Rosta i 220°C ca 20 min.",
      "Lägg laxsidan ovanpå (eller på en egen plåt) med citronskivor, resten av olivoljan, salt och peppar. Baka ytterligare 15–18 min tills laxen precis är genomgången.",
      "Pressa lite citron över och servera direkt från plåten."
    ]
  },
  {
    id: "fyllda-spetspaprikor-quinoa-kikartor",
    namn: "Fyllda spetspaprikor med quinoa, kikärtor & granatäpple",
    maltid: ["middag"],
    tid: 40,
    portioner: 4,
    ingredienser: [
      { id: "paprika",     mangd: 6,   enhet: "st" },
      { id: "quinoa",      mangd: 2,   enhet: "dl" },
      { id: "kikartor",    mangd: 1,   enhet: "burk" },
      { id: "spenat",      mangd: 2,   enhet: "näve" },
      { id: "vitlok",      mangd: 2,   enhet: "klyfta" },
      { id: "granatapple", mangd: 0.5, enhet: "st" },
      { id: "olivolja",    mangd: 2,   enhet: "msk" },
      { id: "citron",      mangd: 0.5, enhet: "st" },
      { id: "gurkmeja",    mangd: 0.5, enhet: "tsk" }
    ],
    mood: ["fest", "vill-bjuda", "varmt-och-matigt", "sugen-pa-gront"],
    allergener: [],
    plus: ["quinoa", "kikärtor", "spenat", "olivolja", "granatäpple"],
    beskrivning: "Färgglad vegetarisk festrätt – spetspaprikor fyllda med kryddig quinoa och kikärtor, toppade med granatäpple.",
    steg: [
      "Koka quinoan enligt paketet. Fräs hackad vitlök i hälften av olivoljan, vänd ner spenaten tills den faller ihop.",
      "Blanda quinoa, kikärtor, spenatfräset, gurkmeja, citron och salt.",
      "Dela spetspaprikorna på längden, gröp ur kärnorna och fyll med blandningen. Lägg i en ugnsform och baka i 200°C ca 20 min.",
      "Toppa med granatäpplekärnor och resten av olivoljan."
    ]
  },
  {
    id: "bakade-applen-kanel-valnotter",
    namn: "Bakade äpplen med dadlar, kanel & yoghurt",
    maltid: ["efterratt"],
    tid: 30,
    portioner: 4,
    ingredienser: [
      { id: "apple",            mangd: 4, enhet: "st" },
      { id: "dadlar",           mangd: 4, enhet: "st" },
      { id: "valnotter",        mangd: 1, enhet: "dl" },
      { id: "kanel",            mangd: 1, enhet: "tsk" },
      { id: "naturell yoghurt", mangd: 2, enhet: "dl" }
    ],
    mood: ["fest", "sugen-pa-sott", "vill-bjuda", "varmt-och-matigt", "dalig-somn"],
    allergener: ["notter", "mjolk"],
    plus: ["äpple", "kanel", "valnötter"],
    beskrivning: "Varm efterrätt utan tillsatt socker – ugnsbakade äpplen fyllda med dadlar och valnötter, med en klick yoghurt.",
    steg: [
      "Kärna ur äpplena (men låt botten vara kvar). Hacka dadlar och valnötter, blanda med kanel.",
      "Fyll äpplena med blandningen och ställ i en ugnsform med en skvätt vatten i botten.",
      "Baka i 180°C ca 25 min tills äpplena är mjuka. Servera ljumna med naturell yoghurt vid sidan."
    ]
  },
  {
    id: "chokladmousse-avokado-bar",
    namn: "Chokladmousse på avokado med bär",
    maltid: ["efterratt", "mellanmal"],
    tid: 15,
    portioner: 4,
    ingredienser: [
      { id: "avokado",     mangd: 2,  enhet: "st" },
      { id: "morkchoklad", mangd: 60, enhet: "g" },
      { id: "dadlar",      mangd: 4,  enhet: "st" },
      { id: "vaxtdryck",   mangd: 1,  enhet: "dl" },
      { id: "bar",         mangd: 2,  enhet: "dl" },
      { id: "valnotter",   mangd: 1,  enhet: "msk" }
    ],
    mood: ["fest", "sugen-pa-sott", "snabbt", "vill-bjuda"],
    allergener: ["notter"],
    plus: ["avokado", "bär"],
    beskrivning: "Len, mörk chokladmousse där avokado och dadlar gör jobbet i stället för grädde och socker.",
    steg: [
      "Smält chokladen försiktigt över vattenbad eller i mikron.",
      "Mixa avokado, smält choklad, urkärnade dadlar och växtdryck riktigt slätt – smaka av (en nypa salt lyfter chokladen).",
      "Fördela i glas och ställ kallt minst 30 min. Toppa med bär och hackade valnötter innan servering."
    ]
  },
  {
    id: "bar-havrecrumble-dadel",
    namn: "Bär- och havrecrumble (dadelsötad)",
    maltid: ["efterratt"],
    tid: 30,
    portioner: 4,
    ingredienser: [
      { id: "bar",              mangd: 4, enhet: "dl" },
      { id: "havregryn",        mangd: 2, enhet: "dl" },
      { id: "valnotter",        mangd: 1, enhet: "dl" },
      { id: "dadlar",           mangd: 6, enhet: "st" },
      { id: "olivolja",         mangd: 2, enhet: "msk" },
      { id: "kanel",            mangd: 1, enhet: "tsk" },
      { id: "naturell yoghurt", mangd: 2, enhet: "dl" }
    ],
    mood: ["fest", "sugen-pa-sott", "varmt-och-matigt", "vill-bjuda"],
    allergener: ["gluten", "notter", "mjolk"],
    plus: ["bär", "havre", "valnötter", "kanel"],
    beskrivning: "Knaprig smuldeg på havre, valnötter och dadlar över varma bär – sötman kommer från frukten.",
    steg: [
      "Lägg bären i en ugnsform.",
      "Mixa eller finhacka dadlarna och blanda med havregryn, hackade valnötter, kanel och olivolja till en grynig smuldeg.",
      "Strö smuldegen över bären och baka i 200°C ca 20 min tills den fått färg. Servera ljum med naturell yoghurt."
    ]
  },
  {
    id: "rostade-mandlar-rosmarin",
    namn: "Rostade mandlar med rosmarin & olivolja",
    maltid: ["mellanmal"],
    tid: 12,
    portioner: 4,
    ingredienser: [
      { id: "mandel",   mangd: 2, enhet: "dl" },
      { id: "olivolja", mangd: 1, enhet: "msk" }
    ],
    mood: ["fest", "snabbt", "sugen-pa-sott", "vill-bjuda"],
    allergener: ["notter"],
    plus: ["mandel", "olivolja"],
    beskrivning: "Litet tilltugg till festen – ljumma mandlar rostade med olivolja, rosmarin och flingsalt.",
    steg: [
      "Blanda mandlarna med olivolja, finhackad färsk (eller torkad) rosmarin och flingsalt.",
      "Rosta i 175°C ca 8–10 min, rör om en gång, tills de doftar.",
      "Servera ljumma."
    ]
  },
  {
    id: "froknacke",
    namn: "Fröknäcke (glutenfritt, helt på frön)",
    maltid: ["mellanmal", "frukost"],
    tid: 75,
    portioner: 8,
    ingredienser: [
      { id: "pumpafron",  mangd: 1,   enhet: "dl" },
      { id: "solrosfron", mangd: 1,   enhet: "dl" },
      { id: "linfro",     mangd: 0.5, enhet: "dl" },
      { id: "chiafron",   mangd: 2,   enhet: "msk" },
      { id: "olivolja",   mangd: 0.5, enhet: "dl" }
    ],
    mood: ["vill-ata-latt", "vill-bjuda"],
    allergener: [],
    plus: ["chiafrön", "linfrö", "pumpafrön", "olivolja"],
    beskrivning: "Knäckebröd helt på frön – inget mjöl, mycket fibrer och bra fetter. Bra att ha hemma till hummus, avokado eller bara så. (Aktiv tid ca 15 min, sen gräddar det sig självt.)",
    steg: [
      "Blanda pumpa-, solros-, lin- och chiafrön med ½ tsk salt i en skål. Rör i olivoljan och 2 dl kokande vatten. Låt svälla ca 15 min tills smeten tjocknar.",
      "Bred ut smeten tunt på en plåt med bakplåtspapper. Lägg gärna ett papper över och kavla ut så jämnt och tunt som möjligt.",
      "Grädda i 150°C ca 1 timme tills knäcket är torrt och fått fin färg. Halvvägs kan du dra bort det övre pappret och bryta upp i bitar så det torkar jämnt.",
      "Låt svalna på galler. Bryt i bitar – håller torrt i burk i flera veckor."
    ]
  },

  /* ---------- FLER RECEPT UTAN BALJVÄXTER (fisk, fågel, ägg, grönsaker, fullkorn, nötter) ---------- */
  {
    id: "aggmuffins-spenat-tomat",
    namn: "Äggmuffins med spenat och tomat",
    maltid: ["frukost", "mellanmal", "lunch"],
    tid: 25,
    portioner: 3,
    ingredienser: [
      { id: "agg",      mangd: 6, enhet: "st" },
      { id: "spenat",   mangd: 2, enhet: "näve" },
      { id: "tomat",    mangd: 2, enhet: "st" },
      { id: "lok",      mangd: 0.5, enhet: "st" },
      { id: "olivolja", mangd: 1, enhet: "msk" }
    ],
    mood: ["efter-traning", "snabbt", "trott", "vill-ata-latt"],
    allergener: ["agg"],
    plus: ["spenat", "tomat", "olivolja"],
    beskrivning: "Små äggmuffins att baka i förväg – bra till frukost eller matlådan, helt utan baljväxter.",
    steg: [
      "Hacka spenat, tomat och lök fint, fräs hastigt i olivoljan.",
      "Vispa äggen löst med salt och peppar, rör i grönsakerna.",
      "Fördela i 6 oljade muffinsformar och grädda i 180°C ca 18–20 min tills de stannat."
    ]
  },
  {
    id: "chiapudding-bar-kokos",
    namn: "Chiapudding med bär och kokos",
    maltid: ["frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "chiafron",   mangd: 2,   enhet: "msk" },
      { id: "kokosmjolk", mangd: 1,   enhet: "dl" },
      { id: "vaxtdryck",  mangd: 1,   enhet: "dl" },
      { id: "bar",        mangd: 1,   enhet: "dl" },
      { id: "valnotter",  mangd: 1,   enhet: "msk" },
      { id: "kanel",      mangd: 1,   enhet: "krm" }
    ],
    mood: ["snabbt", "ont-i-magen", "sugen-pa-sott", "dalig-somn"],
    allergener: ["notter"],
    plus: ["chiafrön", "bär", "valnötter", "kanel"],
    beskrivning: "Krämig chiapudding (rör ihop kvällen innan) toppad med bär – mycket fibrer, inga baljväxter.",
    steg: [
      "Rör ihop chiafrön, kokosmjölk och växtdryck. Låt stå i kylen minst 2 timmar eller över natten, rör om en gång.",
      "Toppa med bär, hackade valnötter och en nypa kanel."
    ]
  },
  {
    id: "kycklingsallad-avokado-apple",
    namn: "Kycklingsallad med avokado, äpple & valnötter",
    maltid: ["lunch"],
    tid: 15,
    portioner: 2,
    ingredienser: [
      { id: "kyckling",  mangd: 250,  enhet: "g" },
      { id: "spenat",    mangd: 2,    enhet: "näve" },
      { id: "ruccola",   mangd: 1,    enhet: "näve" },
      { id: "avokado",   mangd: 1,    enhet: "st" },
      { id: "apple",     mangd: 1,    enhet: "st" },
      { id: "valnotter", mangd: 1,    enhet: "dl" },
      { id: "olivolja",  mangd: 2,    enhet: "msk" },
      { id: "citron",    mangd: 0.5,  enhet: "st" }
    ],
    mood: ["sugen-pa-gront", "vill-ata-latt", "efter-traning", "snabbt"],
    allergener: ["notter"],
    plus: ["spenat", "avokado", "äpple", "valnötter", "olivolja"],
    beskrivning: "Fräsch och mättande sallad utan baljväxter – stekt eller kall kyckling, krispigt äpple och rostade valnötter.",
    steg: [
      "Stek kycklingen i lite av olivoljan tills genomstekt (eller använd kall, kokt kyckling). Skär i bitar.",
      "Lägg spenat och ruccola i en skål, toppa med kyckling, avokado- och äppelklyftor.",
      "Rosta valnötterna torra, strö över. Ringla resten av olivoljan och pressa citron, salt och peppar."
    ]
  },
  {
    id: "tomatsoppa-fullkornscrouton",
    namn: "Tomatsoppa med basilika & fullkornscroutonger",
    maltid: ["lunch", "middag"],
    tid: 25,
    portioner: 4,
    ingredienser: [
      { id: "tomat",            mangd: 2,   enhet: "burk" },
      { id: "lok",              mangd: 1,   enhet: "st" },
      { id: "vitlok",           mangd: 2,   enhet: "klyfta" },
      { id: "olivolja",         mangd: 2,   enhet: "msk" },
      { id: "ragbrod",          mangd: 4,   enhet: "skiva" },
      { id: "naturell yoghurt", mangd: 1,   enhet: "dl" }
    ],
    mood: ["forkyld", "varmt-och-matigt", "ont-i-magen", "vill-ata-latt", "snabbt"],
    allergener: ["gluten", "mjolk"],
    plus: ["tomat", "vitlök", "olivolja"],
    beskrivning: "Snabb krämig tomatsoppa med basilika – toppas med rostade fullkornscroutonger och en klick yoghurt.",
    steg: [
      "Fräs hackad lök och vitlök i hälften av olivoljan tills mjukt.",
      "Tillsätt krossade tomater och lite vatten, sjud 10–15 min. Mixa slät, smaka av med salt, peppar och hackad basilika.",
      "Tärna rågbrödet, ringla över resten av olivoljan och rosta i ugn 200°C ca 8 min tills krispigt.",
      "Servera soppan med croutonger och en klick yoghurt."
    ]
  },
  {
    id: "sotpotatisbat-spenat-agg",
    namn: "Ugnsbakad sötpotatis med spenat, avokado & ägg",
    maltid: ["lunch", "middag"],
    tid: 45,
    portioner: 2,
    ingredienser: [
      { id: "sotpotatis", mangd: 2,   enhet: "st" },
      { id: "spenat",     mangd: 2,   enhet: "näve" },
      { id: "avokado",    mangd: 1,   enhet: "st" },
      { id: "agg",        mangd: 2,   enhet: "st" },
      { id: "olivolja",   mangd: 2,   enhet: "msk" },
      { id: "citron",     mangd: 0.5, enhet: "st" }
    ],
    mood: ["sugen-pa-gront", "vill-ata-latt", "varmt-och-matigt"],
    allergener: ["agg"],
    plus: ["sötpotatis", "spenat", "avokado", "olivolja"],
    beskrivning: "Hel ugnsbakad sötpotatis fylld med spenat, avokado och ett pocherat eller stekt ägg – mättande och baljväxtfri.",
    steg: [
      "Halvera sötpotatisarna på längden, ringla över hälften av olivoljan, salt och peppar. Baka snittytan uppåt i 200°C ca 30–35 min tills mjuka.",
      "Fräs spenaten hastigt. Stek eller pochera äggen.",
      "Toppa sötpotatisarna med spenat, avokado i klyftor och ägget. Resten av olivoljan, citron, flingsalt och svartpeppar över."
    ]
  },
  {
    id: "citronkyckling-rostgronsaker",
    namn: "Citronkyckling i ugn med rostade rotsaker",
    maltid: ["middag"],
    tid: 45,
    portioner: 4,
    ingredienser: [
      { id: "kyckling",  mangd: 600, enhet: "g" },
      { id: "morot",     mangd: 4,   enhet: "st" },
      { id: "rodbeta",   mangd: 2,   enhet: "st" },
      { id: "lok",       mangd: 1,   enhet: "st" },
      { id: "vitlok",    mangd: 3,   enhet: "klyfta" },
      { id: "citron",    mangd: 1,   enhet: "st" },
      { id: "olivolja",  mangd: 3,   enhet: "msk" }
    ],
    mood: ["varmt-och-matigt", "vill-bjuda", "efter-traning"],
    allergener: [],
    plus: ["morot", "rödbeta", "vitlök", "olivolja"],
    beskrivning: "En plåt – kycklinglår med citron och vitlök tillsammans med rostade rotsaker. Inga baljväxter, mycket grönsaker.",
    steg: [
      "Skär rotsaker och lök i bitar, blanda med 2 msk olivolja, hackad vitlök, salt och peppar på en plåt.",
      "Lägg kycklingbitarna ovanpå, ringla över resten av olivoljan och pressad citron, lägg dit citronskal.",
      "Rosta i 200°C ca 35–40 min tills kycklingen är genomstekt och rotsakerna mjuka. Pressa lite extra citron över."
    ]
  },
  {
    id: "wokad-kyckling-broccoli-ingefara",
    namn: "Wokad kyckling med broccoli, paprika & ingefära",
    maltid: ["middag", "lunch"],
    tid: 20,
    portioner: 3,
    ingredienser: [
      { id: "kyckling",  mangd: 450, enhet: "g" },
      { id: "broccoli",  mangd: 1,   enhet: "st" },
      { id: "paprika",   mangd: 1,   enhet: "st" },
      { id: "lok",       mangd: 1,   enhet: "st" },
      { id: "vitlok",    mangd: 2,   enhet: "klyfta" },
      { id: "ingefara",  mangd: 1,   enhet: "msk" },
      { id: "ris",       mangd: 3,   enhet: "dl" },
      { id: "olivolja",  mangd: 2,   enhet: "msk" }
    ],
    mood: ["varmt-och-matigt", "efter-traning", "forkyld", "snabbt"],
    allergener: [],
    plus: ["broccoli", "ingefära", "vitlök"],
    beskrivning: "Snabb wok med massor av grönsaker, värmande ingefära och fullkornsris – baljväxtfri vardagsmiddag.",
    steg: [
      "Koka fullkornsriset. Skär kyckling, broccoli, paprika och lök i bitar.",
      "Stek kycklingen hastigt på hög värme i hälften av olivoljan, ta upp.",
      "Fräs lök, vitlök och riven ingefära i resten av oljan, tillsätt broccoli och paprika och woka ett par minuter. Lägg tillbaka kycklingen, smaka av med lite citron eller en skvätt vatten.",
      "Servera med riset."
    ]
  },
  {
    id: "spenatfrittata-tomat-valnotter",
    namn: "Spenatfrittata med tomat & valnötter",
    maltid: ["middag", "lunch"],
    tid: 25,
    portioner: 4,
    ingredienser: [
      { id: "agg",       mangd: 8,   enhet: "st" },
      { id: "spenat",    mangd: 3,   enhet: "näve" },
      { id: "tomat",     mangd: 3,   enhet: "st" },
      { id: "lok",       mangd: 1,   enhet: "st" },
      { id: "valnotter", mangd: 1,   enhet: "dl" },
      { id: "olivolja",  mangd: 2,   enhet: "msk" }
    ],
    mood: ["varmt-och-matigt", "efter-traning", "sugen-pa-gront", "vill-ata-latt"],
    allergener: ["agg", "notter"],
    plus: ["spenat", "tomat", "valnötter", "olivolja"],
    beskrivning: "En matig ugnsfrittata med spenat, tomat och rostade valnötter – billig, baljväxtfri och bra som matlåda dagen efter.",
    steg: [
      "Fräs hackad lök och spenat i olivoljan i en ugnssäker panna tills spenaten faller ihop.",
      "Vispa äggen med salt och peppar, häll i pannan. Lägg på tomatklyftor och hackade valnötter.",
      "Sätt in i 180°C ca 15–18 min tills frittatan stannat. Servera ljum eller kall, gärna med en grön sallad."
    ]
  },
  {
    id: "fullkornspasta-broccoli-vitlok-valnotter",
    namn: "Fullkornspasta med broccoli, vitlök, citron & valnötter",
    maltid: ["middag", "lunch"],
    tid: 20,
    portioner: 3,
    ingredienser: [
      { id: "fullkornspasta", mangd: 240, enhet: "g" },
      { id: "broccoli",       mangd: 1,   enhet: "st" },
      { id: "vitlok",         mangd: 3,   enhet: "klyfta" },
      { id: "citron",         mangd: 1,   enhet: "st" },
      { id: "valnotter",      mangd: 1,   enhet: "dl" },
      { id: "olivolja",       mangd: 3,   enhet: "msk" }
    ],
    mood: ["varmt-och-matigt", "snabbt", "vill-ata-latt", "sugen-pa-gront"],
    allergener: ["gluten", "notter"],
    plus: ["broccoli", "vitlök", "valnötter", "olivolja"],
    beskrivning: "Snabb pasta där broccolin nästan smälter ihop med vitlök, citron och olivolja – rostade valnötter på toppen. Ingen baljväxt.",
    steg: [
      "Koka fullkornspastan al dente. Lägg i broccolibuketter de sista 3 minuterna.",
      "Fräs tunt skivad vitlök i olivoljan på låg värme tills gyllene, dra av plattan och rör i rivet citronskal och citronsaft.",
      "Vänd pastan och broccolin i vitlöksoljan med en skvätt pastavatten. Smaka av med salt och peppar.",
      "Rosta valnötterna torra och strö över."
    ]
  },
  {
    id: "yoghurt-granatapple-pumpafron",
    namn: "Yoghurt med granatäpple, pumpafrön & kanel",
    maltid: ["mellanmal", "frukost"],
    tid: 3,
    portioner: 1,
    ingredienser: [
      { id: "naturell yoghurt", mangd: 2,   enhet: "dl" },
      { id: "granatapple",      mangd: 0.5, enhet: "st" },
      { id: "pumpafron",        mangd: 1,   enhet: "msk" },
      { id: "kanel",            mangd: 1,   enhet: "krm" }
    ],
    mood: ["snabbt", "sugen-pa-gront", "ont-i-magen", "sugen-pa-sott"],
    allergener: ["mjolk"],
    plus: ["granatäpple", "kanel"],
    beskrivning: "Det enklaste mellanmålet – yoghurt toppad med granatäpplekärnor, pumpafrön och kanel. Helt baljväxtfritt.",
    steg: [
      "Häll upp naturell yoghurt (gärna grekisk eller turkisk).",
      "Toppa med granatäpplekärnor, pumpafrön och en nypa kanel."
    ]
  },
  {
    id: "kokta-agg-avokado",
    namn: "Kokta ägg med avokado & flingsalt",
    maltid: ["mellanmal", "frukost"],
    tid: 10,
    portioner: 1,
    ingredienser: [
      { id: "agg",      mangd: 2,    enhet: "st" },
      { id: "avokado",  mangd: 0.5,  enhet: "st" },
      { id: "citron",   mangd: 0.25, enhet: "st" }
    ],
    mood: ["snabbt", "efter-traning", "trott"],
    allergener: ["agg"],
    plus: ["avokado"],
    beskrivning: "Snabbt och mättande tilltugg eller frukost – kokta ägg med avokado, citron och flingsalt. Inga baljväxter.",
    steg: [
      "Koka äggen 6–8 minuter, kyl och skala.",
      "Halvera, lägg upp med avokado, pressa lite citron och toppa med flingsalt och svartpeppar."
    ]
  },

  /* ---------- SMOOTHIES (egen kategori – en för varje veckodag och lite till) ---------- */
  {
    id: "gyllene-smoothie-gurkmeja-ingefara",
    namn: "Gyllene smoothie med gurkmeja, ingefära & banan",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "vaxtdryck", mangd: 2.5, enhet: "dl" },
      { id: "banan",     mangd: 1,   enhet: "st" },
      { id: "ingefara",  mangd: 1,   enhet: "tsk" },
      { id: "gurkmeja",  mangd: 0.5, enhet: "tsk" },
      { id: "kanel",     mangd: 1,   enhet: "krm" },
      { id: "chiafron",  mangd: 1,   enhet: "msk" },
      { id: "mandel",    mangd: 1,   enhet: "msk" }
    ],
    mood: ["forkyld", "ont-i-magen", "snabbt", "dalig-somn"],
    allergener: ["notter"],
    plus: ["banan", "ingefära", "gurkmeja", "kanel", "chiafrön", "mandel"],
    beskrivning: "Värmande smoothie i gula toner – som en flytande golden milk. Glöm inte en nypa svartpeppar som gör gurkmejan mer tillgänglig.",
    steg: [
      "Lägg banan, växtdryck, gurkmeja, riven ingefära, kanel, en nypa svartpeppar, chiafrön och mandel (eller 1 tsk mandelsmör) i en mixer.",
      "Mixa slätt. Smaka av – mer gurkmeja för djupare färg, mer ingefära för mer värme."
    ]
  },
  {
    id: "avokado-gronkalssmoothie",
    namn: "Avokado- och grönkålssmoothie med banan & citron",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "gronkal",   mangd: 1,    enhet: "näve" },
      { id: "spenat",    mangd: 1,    enhet: "näve" },
      { id: "avokado",   mangd: 0.5,  enhet: "st" },
      { id: "banan",     mangd: 1,    enhet: "st" },
      { id: "vaxtdryck", mangd: 2,    enhet: "dl" },
      { id: "chiafron",  mangd: 1,    enhet: "msk" },
      { id: "citron",    mangd: 0.5,  enhet: "st" }
    ],
    mood: ["sugen-pa-gront", "vill-ata-latt", "efter-traning", "snabbt"],
    allergener: [],
    plus: ["grönkål", "spenat", "avokado", "chiafrön"],
    beskrivning: "Krämig grön smoothie med rejält bladgrönt – avokado och banan gör den sammetslen.",
    steg: [
      "Skölj grönkålen, dra bort grova nerver.",
      "Mixa grönkål, spenat, avokado, banan, växtdryck, chiafrön och saften av en halv citron slätt.",
      "Tillsätt mer växtdryck eller en isbit om du vill ha den tunnare/kallare."
    ]
  },
  {
    id: "bar-rodbetssmoothie",
    namn: "Bär- och rödbetssmoothie med ingefära",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "bar",       mangd: 1.5,  enhet: "dl" },
      { id: "rodbeta",   mangd: 1,    enhet: "st" },
      { id: "banan",     mangd: 1,    enhet: "st" },
      { id: "vaxtdryck", mangd: 2,    enhet: "dl" },
      { id: "chiafron",  mangd: 1,    enhet: "msk" },
      { id: "ingefara",  mangd: 1,    enhet: "tsk" },
      { id: "citron",    mangd: 0.25, enhet: "st" }
    ],
    mood: ["forkyld", "trott", "sugen-pa-sott", "efter-traning"],
    allergener: [],
    plus: ["bär", "rödbeta", "ingefära", "chiafrön"],
    beskrivning: "Klarröd smoothie där kokt rödbeta möter bär och en touch ingefära – mycket antioxidanter, mild jordig sötma.",
    steg: [
      "Använd en färdigkokt (eller vakuumförpackad) rödbeta. Skär i bitar.",
      "Mixa rödbeta, bär, banan, växtdryck, riven ingefära, chiafrön och citron slätt."
    ]
  },
  {
    id: "choklad-banansmoothie-mandel",
    namn: "Choklad- och banansmoothie med mandel",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "vaxtdryck",   mangd: 2.5, enhet: "dl" },
      { id: "banan",       mangd: 1,   enhet: "st" },
      { id: "morkchoklad", mangd: 10,  enhet: "g" },
      { id: "mandel",      mangd: 2,   enhet: "msk" },
      { id: "chiafron",    mangd: 1,   enhet: "msk" },
      { id: "kanel",       mangd: 1,   enhet: "krm" }
    ],
    mood: ["sugen-pa-sott", "snabbt", "vill-bjuda", "efter-traning"],
    allergener: ["notter"],
    plus: ["banan", "mandel", "kanel"],
    beskrivning: "Krämig chokladsmoothie utan tillsatt socker – sötman kommer från bananen och en bit mörk choklad.",
    steg: [
      "Riv eller smält chokladen (eller använd 1 msk osötat kakao om du har).",
      "Mixa växtdryck, banan, choklad, mandel (eller mandelsmör), chiafrön och kanel slätt.",
      "Smaka av – en extra nypa kanel eller en dadel kan lyfta den."
    ]
  },
  {
    id: "granatapple-bar-kefirsmoothie",
    namn: "Granatäpple- och bärsmoothie med kefir",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "kefir",       mangd: 2,    enhet: "dl" },
      { id: "bar",         mangd: 1.5,  enhet: "dl" },
      { id: "granatapple", mangd: 0.5,  enhet: "st" },
      { id: "banan",       mangd: 0.5,  enhet: "st" },
      { id: "chiafron",    mangd: 1,    enhet: "tsk" },
      { id: "ingefara",    mangd: 0.5,  enhet: "tsk" }
    ],
    mood: ["snabbt", "ont-i-magen", "sugen-pa-sott", "sugen-pa-gront"],
    allergener: ["mjolk"],
    plus: ["bär", "granatäpple", "kefir"],
    beskrivning: "Probiotisk smoothie där kefir möter granatäpple och bär – mild syrlighet, snäll mot magen.",
    steg: [
      "Mixa kefir, bär, granatäpplekärnor, banan, chiafrön och riven ingefära tills slät.",
      "Häll upp och toppa gärna med extra granatäpple."
    ]
  },
  {
    id: "havre-mandelsmoothie-banan-kanel",
    namn: "Havre- och mandelsmoothie med banan & kanel",
    maltid: ["smoothies", "frukost", "mellanmal"],
    tid: 5,
    portioner: 1,
    ingredienser: [
      { id: "vaxtdryck", mangd: 2.5, enhet: "dl" },
      { id: "banan",     mangd: 1,   enhet: "st" },
      { id: "havregryn", mangd: 1,   enhet: "msk" },
      { id: "mandel",    mangd: 1,   enhet: "msk" },
      { id: "chiafron",  mangd: 1,   enhet: "msk" },
      { id: "kanel",     mangd: 1,   enhet: "krm" }
    ],
    mood: ["trott", "ont-i-magen", "dalig-somn", "snabbt"],
    allergener: ["gluten", "notter"],
    plus: ["banan", "havre", "mandel", "kanel", "chiafrön"],
    beskrivning: "Mättande frukostsmoothie – havren och mandeln gör att den håller lite längre än en vanlig smoothie.",
    steg: [
      "Mixa växtdryck, banan, havregryn, mandel (eller mandelsmör), chiafrön och kanel slätt.",
      "Låt stå en minut – chiafröna sväller och konsistensen blir krämigare."
    ]
  },

  /* ---------- KLASSISK HUSMANSKOST (rött kött – limita gärna mängden eller gör en egen version med hälften baljväxter) ---------- */
  {
    id: "oxroulader-gradsas",
    namn: "Oxrouladar med gräddsås & sötpotatis",
    maltid: ["middag"],
    tid: 60,
    portioner: 4,
    ingredienser: [
      { id: "notkott",          mangd: 600, enhet: "g" },
      { id: "bacon",            mangd: 80,  enhet: "g" },
      { id: "lok",              mangd: 1,   enhet: "st" },
      { id: "gurka",            mangd: 1,   enhet: "st" },
      { id: "olivolja",         mangd: 2,   enhet: "msk" },
      { id: "naturell yoghurt", mangd: 1,   enhet: "dl" },
      { id: "sotpotatis",       mangd: 4,   enhet: "st" }
    ],
    mood: ["varmt-och-matigt", "vill-bjuda", "fest"],
    allergener: ["mjolk"],
    plus: ["sötpotatis", "lök"],
    beskrivning: "Klassisk svensk husmanskost – tunna skivor av nötkött fyllda med bacon, lök, gurka och senap, brynta och färdiglagade i sky. Tips: använd \"Gör en egen version\" för att byta ut hälften av nötköttet mot t.ex. linser eller kyckling och göra den mer antiinflammatorisk.",
    steg: [
      "Banka köttskivorna jämntjocka. Pensla med senap och krydda med salt och peppar.",
      "Lägg en remsa bacon, en tunn skiva lök och en strimla gurka på varje skiva. Rulla ihop och fäst med tandpetare.",
      "Bryn rouladerna runt om i olivolja. Lägg över i en gryta tillsammans med resten av löken.",
      "Häll på vatten + en buljongtärning (eller hemkokt buljong) så det nästan täcker. Sjud under lock ca 35–40 min tills köttet är mört.",
      "Ta upp rouladerna, sila skyn och låt reducera. Rör ner yoghurten på låg värme (koka inte) tills såsen blir krämig. Smaka av med salt, peppar och en skvätt citron.",
      "Servera med ugnsbakad sötpotatis (skär i klyftor, ringla över olivolja och baka i 200°C ca 30 min)."
    ]
  },
  {
    id: "kottfarssas-fullkornspasta",
    namn: "Köttfärssås på fullkornspasta",
    maltid: ["middag"],
    tid: 35,
    portioner: 4,
    ingredienser: [
      { id: "notfars",        mangd: 500, enhet: "g" },
      { id: "lok",            mangd: 1,   enhet: "st" },
      { id: "vitlok",         mangd: 2,   enhet: "klyfta" },
      { id: "morot",          mangd: 2,   enhet: "st" },
      { id: "tomat",          mangd: 1,   enhet: "burk" },
      { id: "olivolja",       mangd: 2,   enhet: "msk" },
      { id: "fullkornspasta", mangd: 320, enhet: "g" }
    ],
    mood: ["varmt-och-matigt", "snabbt"],
    allergener: ["gluten"],
    plus: ["tomat", "morot", "vitlök", "olivolja"],
    beskrivning: "Klassisk köttfärssås på nötfärs, lök, vitlök, morot och krossade tomater – serverad med fullkornspasta. För en snällare variant: \"Gör en egen version\" och byt ut hälften av färsen mot röda linser.",
    steg: [
      "Riv eller hacka morötter och lök fint. Fräs lök, vitlök och morot i hälften av olivoljan i en stekpanna tills mjukt.",
      "Tillsätt nötfärsen och smula sönder den medan den bryns. Salta och peppra.",
      "Häll i krossade tomater och ½ dl vatten. Krydda gärna med oregano, basilika, lite tomatpuré och en liten skvätt balsamvinäger. Låt sjuda 15–20 min.",
      "Koka fullkornspastan al dente under tiden.",
      "Servera såsen över pastan med resten av olivoljan ringlad över."
    ]
  },
  {
    id: "mustig-kottgryta",
    namn: "Mustig köttgryta med morötter & tomat",
    maltid: ["middag"],
    tid: 90,
    portioner: 4,
    ingredienser: [
      { id: "notkott",  mangd: 600, enhet: "g" },
      { id: "lok",      mangd: 1,   enhet: "st" },
      { id: "vitlok",   mangd: 2,   enhet: "klyfta" },
      { id: "morot",    mangd: 3,   enhet: "st" },
      { id: "tomat",    mangd: 1,   enhet: "burk" },
      { id: "olivolja", mangd: 2,   enhet: "msk" },
      { id: "ris",      mangd: 3,   enhet: "dl" }
    ],
    mood: ["varmt-och-matigt", "vill-bjuda", "stressad"],
    allergener: [],
    plus: ["morot", "vitlök", "tomat", "olivolja"],
    beskrivning: "Långkokt köttgryta med nötkött, morötter, lök och krossade tomater – tiden gör jobbet, smaken blir djup. Serveras med fullkornsris eller kokt potatis.",
    steg: [
      "Skär köttet i 2–3 cm bitar, putsa bort senor. Salta och peppra.",
      "Bryn köttet i hälften av olivoljan i omgångar tills det fått färg runt om. Ta upp.",
      "Fräs hackad lök, vitlök och morötter i resten av oljan tills mjukt. Lägg tillbaka köttet.",
      "Häll i krossade tomater + 3 dl vatten (eller hemkokt buljong). Krydda med lagerblad, timjan, salt och peppar.",
      "Sjud under lock på låg värme 1–1½ timme tills köttet är mört. Lyft av locket sista 15 min om du vill ha tjockare sås.",
      "Koka fullkornsriset under tiden och servera."
    ]
  },

  /* ---------- FISKRÄTTER ---------- */
  {
    id: "fisksoppa-tomat-fankal-saffran",
    namn: "Fisksoppa med tomat, fänkål & saffran",
    maltid: ["lunch", "middag"],
    tid: 35,
    portioner: 4,
    ingredienser: [
      { id: "lax",        mangd: 400, enhet: "g" },
      { id: "torsk",      mangd: 200, enhet: "g" },
      { id: "rakor",      mangd: 200, enhet: "g" },
      { id: "lok",        mangd: 1,   enhet: "st" },
      { id: "fankal",     mangd: 1,   enhet: "st" },
      { id: "vitlok",     mangd: 3,   enhet: "klyfta" },
      { id: "tomat",      mangd: 1,   enhet: "burk" },
      { id: "kokosmjolk", mangd: 2,   enhet: "dl" },
      { id: "olivolja",   mangd: 2,   enhet: "msk" },
      { id: "citron",     mangd: 0.5, enhet: "st" }
    ],
    mood: ["varmt-och-matigt", "forkyld", "vill-bjuda", "efter-traning", "fest"],
    allergener: ["fisk"],
    plus: ["lax", "torsk", "räkor", "fänkål", "vitlök", "olivolja"],
    beskrivning: "Medelhavsinspirerad fisksoppa med lax, vit fisk och räkor i en sky av tomat, fänkål, vitlök och saffran. Kokosmjölk gör soppan krämig utan grädde.",
    steg: [
      "Hacka lök, fänkål och vitlök fint. Fräs i olivoljan i en gryta tills mjukt – tappa inte färg.",
      "Tillsätt krossade tomater, 3 dl vatten, en nypa saffran och salt. Låt sjuda 10 min så smakerna gifter sig.",
      "Rör i kokosmjölken. Lägg i fiskbitarna (lax + torsk, skurna i större bitar) och sjud försiktigt 5 min.",
      "Vänd ner räkorna sista minuten så de inte blir överkokta. Smaka av med citron, salt och peppar.",
      "Servera med rågbröd eller knäcke."
    ]
  },
  {
    id: "fiskgryta-medelhav",
    namn: "Färgglad fiskgryta med tomat, paprika & morot",
    maltid: ["middag"],
    tid: 35,
    portioner: 4,
    ingredienser: [
      { id: "lax",      mangd: 400, enhet: "g" },
      { id: "torsk",    mangd: 300, enhet: "g" },
      { id: "lok",      mangd: 1,   enhet: "st" },
      { id: "vitlok",   mangd: 2,   enhet: "klyfta" },
      { id: "morot",    mangd: 2,   enhet: "st" },
      { id: "paprika",  mangd: 1,   enhet: "st" },
      { id: "tomat",    mangd: 1,   enhet: "burk" },
      { id: "olivolja", mangd: 2,   enhet: "msk" },
      { id: "citron",   mangd: 0.5, enhet: "st" },
      { id: "ris",      mangd: 3,   enhet: "dl" }
    ],
    mood: ["varmt-och-matigt", "vill-bjuda", "efter-traning"],
    allergener: ["fisk"],
    plus: ["lax", "torsk", "tomat", "paprika", "morot", "vitlök", "olivolja"],
    beskrivning: "Färgglad medelhavsinspirerad fiskgryta – lax och vit fisk i en mustig grönsaks- och tomatsås, serverad med fullkornsris.",
    steg: [
      "Koka fullkornsriset enligt paketet. Skär lök, vitlök, morot och paprika fint; fisken i större bitar.",
      "Fräs lök, vitlök, morot och paprika i olivoljan i en stor gryta tills mjukt, ca 6 min.",
      "Tillsätt krossade tomater + 1 dl vatten. Krydda med oregano (eller timjan), salt och peppar. Sjud 10 min.",
      "Lägg ner fiskbitarna försiktigt och sjud på låg värme 6–8 min tills fisken precis faller isär.",
      "Pressa över citron strax innan servering. Servera grytan med riset."
    ]
  }

];
