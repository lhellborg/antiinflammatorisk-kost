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

// Slå upp etikett från id i en lista. Faller tillbaka på id:t självt.
window.labelFor = function (list, id) {
  var hit = list.find(function (x) { return x.id === id; });
  return hit ? hit.label : id;
};

// Sätt "active" på rätt länk i menyn (anropas från varje sida)
window.markNav = function (page) {
  document.querySelectorAll(".site-nav a").forEach(function (a) {
    if (a.getAttribute("data-page") === page) a.classList.add("active");
  });
};
