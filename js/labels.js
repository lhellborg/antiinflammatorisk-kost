/* ============================================================
   Gemensamma etiketter och listor som används av flera sidor.
   ============================================================ */

// Måltider i den ordning de ska visas
window.MALTIDER = [
  { id: "frukost",  label: "Frukost"  },
  { id: "lunch",    label: "Lunch"    },
  { id: "middag",   label: "Middag"   },
  { id: "mellanmal",label: "Mellanmål"}
];

// Hur man kan känna sig -> matchas mot recept.mood
window.MOODS = [
  { id: "trott",            label: "Trött / energilös" },
  { id: "stressad",         label: "Stressad" },
  { id: "forkyld",          label: "Förkyld / krasslig" },
  { id: "ont-i-magen",      label: "Orolig mage" },
  { id: "sugen-pa-sott",    label: "Sugen på något sött" },
  { id: "varmt-och-matigt", label: "Vill ha något varmt & matigt" },
  { id: "snabbt",           label: "Bara något snabbt" }
];

// Vanliga råvaror att bocka i. Värdena ska matcha namnen i data/recept.js
window.RAVAROR = [
  { id: "havregryn",      label: "Havregryn" },
  { id: "agg",            label: "Ägg" },
  { id: "kyckling",       label: "Kyckling" },
  { id: "lax",            label: "Lax" },
  { id: "linser",         label: "Linser" },
  { id: "kikartor",       label: "Kikärtor" },
  { id: "spenat",         label: "Spenat" },
  { id: "broccoli",       label: "Broccoli" },
  { id: "tomat",          label: "Tomat" },
  { id: "paprika",        label: "Paprika" },
  { id: "lok",            label: "Lök" },
  { id: "vitlok",         label: "Vitlök" },
  { id: "avokado",        label: "Avokado" },
  { id: "bar",            label: "Bär" },
  { id: "banan",          label: "Banan" },
  { id: "apple",          label: "Äpple" },
  { id: "citron",         label: "Citron" },
  { id: "morot",          label: "Morot" },
  { id: "rodbeta",        label: "Rödbeta" },
  { id: "quinoa",         label: "Quinoa" },
  { id: "ris",            label: "Ris" },
  { id: "fullkorn",       label: "Fullkorn (matvete/korn)" },
  { id: "fullkornspasta", label: "Fullkornspasta" },
  { id: "ragbrod",        label: "Rågbröd" },
  { id: "tortilla",       label: "Tortilla" },
  { id: "naturell yoghurt", label: "Naturell yoghurt" },
  { id: "valnotter",      label: "Valnötter" },
  { id: "mandel",         label: "Mandel" },
  { id: "chiafron",       label: "Chiafrön" },
  { id: "linfro",         label: "Linfrö" },
  { id: "olivolja",       label: "Olivolja" },
  { id: "ingefara",       label: "Ingefära" },
  { id: "gurkmeja",       label: "Gurkmeja" },
  { id: "kanel",          label: "Kanel" }
];

window.ALLERGENER = [
  { id: "gluten", label: "Gluten" },
  { id: "notter", label: "Nötter" },
  { id: "agg",    label: "Ägg" },
  { id: "fisk",   label: "Fisk" },
  { id: "mjolk",  label: "Mjölk" },
  { id: "soja",   label: "Soja" }
];

// Grova butiksavdelningar – används för att gruppera inköpslistan.
// Ingredienser som inte finns med hamnar under "Övrigt".
window.KATEGORIER = [
  { namn: "Frukt & grönt", ids: ["spenat","broccoli","tomat","paprika","lok","vitlok","avokado","bar","banan","apple","citron","morot","rodbeta","ingefara"] },
  { namn: "Kött & fisk",   ids: ["kyckling","lax"] },
  { namn: "Mejeri & ägg",  ids: ["agg","naturell yoghurt"] },
  { namn: "Bröd",          ids: ["ragbrod","tortilla"] },
  { namn: "Skafferi",      ids: ["havregryn","linser","kikartor","quinoa","ris","fullkorn","fullkornspasta","valnotter","mandel","chiafron","linfro","olivolja","gurkmeja","kanel"] }
];

window.categoryFor = function (id) {
  var hit = window.KATEGORIER.find(function (k) { return k.ids.indexOf(id) !== -1; });
  return hit ? hit.namn : "Övrigt";
};

// Slå upp etikett från id i en lista. Faller tillbaka på id:t självt.
window.labelFor = function (list, id) {
  var hit = list.find(function (x) { return x.id === id; });
  return hit ? hit.label : id;
};

// Etikett för en råvara (med fallback)
window.ravaraLabel = function (id) { return window.labelFor(window.RAVAROR, id); };

// Etikett för en ingrediensrad i ett recept ({ id, mangd, enhet, namn? }).
// Egna recept kan ha ett fritt namn; annars slås råvarans etikett upp.
window.ingrLabel = function (it) { return (it && it.namn) ? it.namn : window.ravaraLabel(it ? it.id : ""); };

// Enheter som går att välja i "Förbättra ett recept".
window.ENHETER = ["", "st", "dl", "msk", "tsk", "krm", "g", "klyfta", "burk", "näve", "skiva", "cm", "förp"];

// Försök matcha ett fritt ingrediensnamn mot en känd råvara (för fina etiketter,
// kategori i inköpslistan och "har hemma"-bockning). Returnerar råvarans id eller null.
window.matchRavara = (function () {
  var map = null;
  function build() {
    map = {};
    (window.RAVAROR || []).forEach(function (r) {
      map[r.id.toLowerCase()] = r.id;
      map[r.label.toLowerCase().trim()] = r.id;
    });
    // några vanliga synonymer
    var syn = {
      "lök": "lok", "gul lök": "lok", "rödlök": "lok",
      "vitlök": "vitlok", "vitlöksklyfta": "vitlok",
      "ägg": "agg",
      "blåbär": "bar", "hallon": "bar", "jordgubbar": "bar", "blandade bär": "bar", "frysta bär": "bar",
      "havre": "havregryn", "havregryn": "havregryn",
      "fullkornsris": "ris", "matvete": "fullkorn", "korn": "fullkorn",
      "grekisk yoghurt": "naturell yoghurt", "turkisk yoghurt": "naturell yoghurt", "yoghurt": "naturell yoghurt",
      "valnöt": "valnotter", "valnötter": "valnotter", "mandlar": "mandel",
      "chiafrö": "chiafron", "chiafrön": "chiafron", "linfrö": "linfro", "linfrön": "linfro",
      "rödbetor": "rodbeta", "morötter": "morot", "äpple": "apple", "äpplen": "apple"
    };
    Object.keys(syn).forEach(function (k) { if (!(k in map)) map[k] = syn[k]; });
  }
  return function (name) {
    if (!name) return null;
    if (!map) build();
    return map[String(name).toLowerCase().trim()] || null;
  };
})();

/* ---------- Mängder och portioner ---------- */

// Räkna om en mängd från basantal portioner till nytt antal portioner.
// Rundar till "snälla" steg så det inte blir 1.3333 dl.
window.scaleAmount = function (mangd, basPortioner, nyaPortioner) {
  if (mangd == null) return null;
  if (!basPortioner) basPortioner = 1;
  var v = mangd * nyaPortioner / basPortioner;
  if (v >= 10) return Math.round(v);
  if (v >= 2)  return Math.round(v * 2) / 2;   // närmaste 0,5
  return Math.round(v * 4) / 4;                 // närmaste 0,25
};

// Snygg sträng av ett tal: 0.5 -> "½", 1.5 -> "1½", 2 -> "2", 0.75 -> "¾"
window.niceNumber = function (n) {
  if (n == null) return "";
  var frac = { 0.25: "¼", 0.5: "½", 0.75: "¾", 0.33: "⅓", 0.67: "⅔" };
  var whole = Math.floor(n + 1e-9);
  var rem = Math.round((n - whole) * 100) / 100;
  if (rem === 0) return String(whole);
  if (frac[rem]) return (whole ? whole : "") + frac[rem];
  return String(Math.round(n * 100) / 100).replace(".", ",");
};

// Pluralformer för de enheter som böjs (övriga – dl, msk, tsk, g ... – böjs inte).
var ENHET_PLURAL = { burk: "burkar", klyfta: "klyftor", "näve": "nävar", skiva: "skivor" };

// "1 dl", "½ st", "300 g", "2 burkar", eller "" om ingen mängd.
window.formatAmount = function (mangd, enhet) {
  if (mangd == null) return enhet || "";
  var nstr = window.niceNumber(mangd);
  if (!enhet) return nstr;
  var e = (mangd > 1 && ENHET_PLURAL[enhet]) ? ENHET_PLURAL[enhet] : enhet;
  return nstr + " " + e;
};

// Slå ihop flera mängder av samma råvara (från olika recept) till en text.
// Samma enhet summeras ("1 dl" + "½ dl" -> "1½ dl"); olika enheter listas
// med "+" ("1 dl + 2 msk").
window.combineAmounts = function (poster) {
  // poster: [{ mangd, enhet }, ...]
  var perEnhet = {};
  var order = [];
  var harOkand = false;
  poster.forEach(function (p) {
    if (p.mangd == null) { harOkand = true; return; }
    var key = p.enhet || "";
    if (!(key in perEnhet)) { perEnhet[key] = 0; order.push(key); }
    perEnhet[key] += p.mangd;
  });
  var delar = order.map(function (key) { return window.formatAmount(perEnhet[key], key); });
  if (harOkand && delar.length === 0) return "efter behov";
  return delar.join(" + ");
};

// Sätt "active" på rätt länk i menyn (anropas från varje sida)
window.markNav = function (page) {
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });
};
