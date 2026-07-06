/* ============================================================
   Tester för antiinflammatorisk-kost-sajten.
   Körs med:  node test.js
   Täcker: datavalidering, etikett-/mängd-hjälpfunktioner,
   stapelvaru-flaggning, samt store-modulerna (Cart, MyRecipes,
   WeekPlan, Pantry) – inkl. att setSlotRecipeFromEdit följer
   rester-relationer. UI-flöden (modaler, knappar) testas inte.
   ============================================================ */
"use strict";

/* ---------- Minitestramverk ---------- */
var __passed = 0, __failed = 0, __failures = [];
function group(name, fn) { console.log("\n" + name); fn(); }
function test(name, fn) {
  try { fn(); console.log("  ✓ " + name); __passed++; }
  catch (e) { console.log("  ✗ " + name + "\n      " + (e && e.message || e)); __failed++; __failures.push(name); }
}
function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
function eq(a, b, msg) {
  var bothNaN = (typeof a === "number" && typeof b === "number" && isNaN(a) && isNaN(b));
  if (!(a === b || bothNaN)) throw new Error((msg || "eq") + ": " + JSON.stringify(a) + " !== " + JSON.stringify(b));
}

/* ---------- Stubs för miljön (localStorage + document) ---------- */
var __ls = {};
global.localStorage = {
  get length() { return Object.keys(__ls).length; },
  key: function (i) { return Object.keys(__ls)[i] || null; },
  getItem: function (k) { return k in __ls ? __ls[k] : null; },
  setItem: function (k, v) { __ls[k] = String(v); },
  removeItem: function (k) { delete __ls[k]; },
  clear: function () { __ls = {}; }
};
var __docL = {};
global.document = {
  addEventListener: function (t, f) { (__docL[t] = __docL[t] || []).push(f); },
  dispatchEvent: function (e) { (__docL[e.type] || []).forEach(function (f) { f(e); }); },
  querySelectorAll: function () { return []; }
};
global.CustomEvent = function (t, o) { this.type = t; this.detail = o && o.detail; };
global.window = global;

/* ---------- Ladda moduler ---------- */
require("./data/recept.js");
require("./data/byten.js");
require("./js/profiles.js");
require("./js/labels.js");
require("./js/ui.js");
require("./js/store.js");
require("./js/myrecipes.js");
require("./js/weekplan.js");
require("./js/pantry.js");
var W = global.window;

/* ---------- Tester ---------- */

group("Receptdata", function () {
  test("recept-id är unika", function () {
    var ids = W.RECEPT.map(function (r) { return r.id; });
    var dup = ids.filter(function (x, i, a) { return a.indexOf(x) !== i; });
    assert(dup.length === 0, "dubbletter: " + dup.join(", "));
  });
  test("inga tomma id eller namn", function () {
    W.RECEPT.forEach(function (r) {
      assert(r.id && r.id.length > 0, "saknat id för " + r.namn);
      assert(r.namn && r.namn.length > 0, "saknat namn för " + r.id);
    });
  });
  test("varje recept har portioner > 0", function () {
    W.RECEPT.forEach(function (r) { assert(typeof r.portioner === "number" && r.portioner > 0, r.id + ": portioner=" + r.portioner); });
  });
  test("alla ingrediens-id finns i RAVAROR", function () {
    var rav = new Set(W.RAVAROR.map(function (r) { return r.id; }));
    var bad = [];
    W.RECEPT.forEach(function (r) {
      (r.ingredienser || []).forEach(function (it) { if (!rav.has(it.id)) bad.push(r.id + ":" + it.id); });
    });
    assert(bad.length === 0, "saknas i RAVAROR: " + bad.join(", "));
  });
  test("alla maltid-värden är giltiga", function () {
    var ok = new Set(W.MALTIDER.map(function (m) { return m.id; }));
    var bad = [];
    W.RECEPT.forEach(function (r) { (r.maltid || []).forEach(function (m) { if (!ok.has(m)) bad.push(r.id + ":" + m); }); });
    assert(bad.length === 0, "ogiltig maltid: " + bad.join(", "));
  });
  test("alla mood-värden är giltiga", function () {
    var ok = new Set(W.MOODS.map(function (m) { return m.id; }));
    var bad = [];
    W.RECEPT.forEach(function (r) { (r.mood || []).forEach(function (m) { if (!ok.has(m)) bad.push(r.id + ":" + m); }); });
    assert(bad.length === 0, "ogiltig mood: " + bad.join(", "));
  });
  test("alla allergen-värden är giltiga", function () {
    var ok = new Set(W.ALLERGENER.map(function (a) { return a.id; }));
    var bad = [];
    W.RECEPT.forEach(function (r) { (r.allergener || []).forEach(function (a) { if (!ok.has(a)) bad.push(r.id + ":" + a); }); });
    assert(bad.length === 0, "ogiltig allergen: " + bad.join(", "));
  });
  test("alla ingredienser är kategoriserade (inga 'Övrigt' bland inbyggda)", function () {
    var catIds = new Set([].concat.apply([], W.KATEGORIER.map(function (k) { return k.ids; })));
    var uncat = new Set();
    W.RECEPT.forEach(function (r) { (r.ingredienser || []).forEach(function (it) { if (!catIds.has(it.id)) uncat.add(it.id); }); });
    assert(uncat.size === 0, "okategoriserade: " + [].concat.apply([], [].concat([uncat])).join(", "));
  });
  test("varje måltidstyp har minst ett recept", function () {
    W.MALTIDER.forEach(function (m) {
      var n = W.RECEPT.filter(function (r) { return (r.maltid || []).indexOf(m.id) !== -1; }).length;
      assert(n >= 1, "Inga recept för måltid " + m.id);
    });
  });
  test("varje mood har minst ett recept (annars syns valet inte på 'Vad ska jag äta?')", function () {
    W.MOODS.forEach(function (m) {
      var n = W.RECEPT.filter(function (r) { return (r.mood || []).indexOf(m.id) !== -1; }).length;
      assert(n >= 1, "Inga recept med mood " + m.id);
    });
  });
});

group("Etiketter & mängd-hjälpare (labels.js)", function () {
  test("ravaraLabel hittar etikett, faller tillbaka på id", function () {
    eq(W.ravaraLabel("lok"), "Lök");
    eq(W.ravaraLabel("aldrig-i-listan"), "aldrig-i-listan");
  });
  test("matchRavara klarar id, label och vanliga synonymer", function () {
    eq(W.matchRavara("Lök"), "lok");
    eq(W.matchRavara("lök"), "lok");
    eq(W.matchRavara("vitlök"), "vitlok");
    eq(W.matchRavara("ägg"), "agg");
    eq(W.matchRavara("blåbär"), "bar");
    eq(W.matchRavara("Quesadilla"), null);
  });
  test("scaleAmount skalar och rundar till snälla steg", function () {
    eq(W.scaleAmount(1, 1, 3), 3);
    eq(W.scaleAmount(0.5, 1, 4), 2);
    eq(W.scaleAmount(3, 4, 2), 1.5);
    eq(W.scaleAmount(100, 1, 2), 200);
    eq(W.scaleAmount(null, 4, 6), null);
  });
  test("niceNumber: heltal, ½, ¾", function () {
    eq(W.niceNumber(1), "1");
    eq(W.niceNumber(0.5), "½");
    eq(W.niceNumber(1.5), "1½");
    eq(W.niceNumber(0.25), "¼");
  });
  test("formatAmount böjer pluraler där det behövs", function () {
    eq(W.formatAmount(1, "burk"), "1 burk");
    eq(W.formatAmount(2, "burk"), "2 burkar");
    eq(W.formatAmount(1.5, "klyfta"), "1½ klyftor");
    eq(W.formatAmount(0.5, "st"), "½ st");
    eq(W.formatAmount(null, ""), "");
  });
  test("combineAmounts: samma enhet summeras, olika enheter listas", function () {
    eq(W.combineAmounts([{ mangd: 1, enhet: "dl" }, { mangd: 0.5, enhet: "dl" }]), "1½ dl");
    eq(W.combineAmounts([{ mangd: 1, enhet: "dl" }, { mangd: 2, enhet: "msk" }]), "1 dl + 2 msk");
  });
  test("ingrLabel föredrar namn före råvara-id", function () {
    eq(W.ingrLabel({ id: "lok" }), "Lök");
    eq(W.ingrLabel({ id: "foo", namn: "Bar" }), "Bar");
  });
  test("categoryFor hittar rätt avdelning", function () {
    eq(W.categoryFor("lok"), "Frukt & grönt");
    eq(W.categoryFor("lax"), "Kött & fisk");
    eq(W.categoryFor("knackebrod"), "Bröd");
    eq(W.categoryFor("aldrig-existerande"), "Övrigt");
  });
  test("ingredientIds returnerar id-listan", function () {
    var r = W.RECEPT.filter(function (r) { return r.id === "linsbolognese"; })[0];
    var ids = W.ingredientIds(r);
    assert(ids.indexOf("linser") !== -1);
    assert(ids.indexOf("tomat") !== -1);
  });
});

group("Stapelvaru-flaggning (byten.js)", function () {
  test("STAPLE_GRANSER finns med baljväxter och stärkelse", function () {
    var typer = W.STAPLE_GRANSER.map(function (g) { return g.typ; });
    assert(typer.indexOf("baljväxt") !== -1);
    assert(typer.indexOf("stärkelse") !== -1);
  });
  test("stapleFlags hittar linstunga recept", function () {
    var r = W.RECEPT.filter(function (r) { return r.id === "linsbolognese"; })[0];
    var f = W.stapleFlags(r);
    assert(f.some(function (x) { return x.grans.etikett === "linser"; }), "linsbolognese ska flaggas på linser");
  });
  test("stapleFlags fungerar även med ascii-id (kikartor utan diakritik)", function () {
    var r = W.RECEPT.filter(function (r) { return r.id === "quinoabowl-kikartor"; })[0];
    var f = W.stapleFlags(r);
    assert(f.some(function (x) { return x.grans.etikett === "kikärtor"; }), "quinoabowl ska flaggas på kikärtor");
  });
  test("baljväxtfria recept flaggas inte", function () {
    var r = W.RECEPT.filter(function (r) { return r.id === "kycklingsallad-avokado-apple"; })[0];
    eq(W.stapleFlags(r).length, 0, "kycklingsallad ska inte flaggas");
  });
  test("recipeStapleHeavy filtrerar på typ", function () {
    var r = W.RECEPT.filter(function (r) { return r.id === "linsbolognese"; })[0];
    assert(W.recipeStapleHeavy(r, "baljväxt"));
    assert(!W.recipeStapleHeavy(r, "stärkelse"));
  });
});

group("Cart (store.js)", function () {
  test("add / has / get / setPortions / remove", function () {
    W.Cart.clear(); eq(W.Cart.count(), 0);
    W.Cart.add("r1", 4);
    assert(W.Cart.has("r1"));
    eq(W.Cart.count(), 1);
    eq(W.Cart.get("r1").portioner, 4);
    W.Cart.setPortions("r1", 6);
    eq(W.Cart.get("r1").portioner, 6);
    W.Cart.remove("r1");
    eq(W.Cart.count(), 0);
  });
  test("toggle togglar", function () {
    W.Cart.clear();
    W.Cart.toggle("r1", 2); assert(W.Cart.has("r1"));
    W.Cart.toggle("r1", 2); assert(!W.Cart.has("r1"));
  });
  test("list() lämnar ut en kopia – att ändra den påverkar inte carten", function () {
    W.Cart.clear(); W.Cart.add("r1", 2);
    var a = W.Cart.list();
    a.push({ id: "smuggling", portioner: 1 });
    eq(W.Cart.count(), 1, "push på den utlämnade listan ska inte synas i carten");
    W.Cart.clear();
  });
  test("cachen läses om när en profil importeras över den aktiva", function () {
    var p = W.Profiles.active();
    W.Cart.clear(); W.Cart.add("a", 1);
    var payload = W.Profiles.exportProfile(p.id);
    W.Cart.add("b", 2);
    eq(W.Cart.count(), 2);
    // importProfile skriver localStorage direkt (förbi Cart.write) och
    // signalerar bara via profile:changed – cachen får inte vara kvar.
    W.Profiles.importProfile(payload, { replaceId: p.id });
    eq(W.Cart.count(), 1, "efter import ska carten spegla lagringen, inte cachen");
    assert(W.Cart.has("a") && !W.Cart.has("b"));
    W.Cart.clear();
  });
});

group("Egna recept (myrecipes.js)", function () {
  test("add / get / remove + allRecipes inkluderar egna", function () {
    W.MyRecipes.clear();
    var before = W.allRecipes().length;
    var id = W.MyRecipes.newId();
    W.MyRecipes.add({ id: id, namn: "Test", maltid: ["middag"], portioner: 2, ingredienser: [], egen: true });
    eq(W.allRecipes().length, before + 1);
    assert(W.recipeById(id), "recipeById hittar det tillagda receptet");
    W.MyRecipes.remove(id);
    eq(W.allRecipes().length, before);
  });
  test("egna recept är profil-separerade (cachen följer profilbyte)", function () {
    W.MyRecipes.clear();
    var p1 = W.Profiles.active().id;
    W.MyRecipes.add({ id: "egen-t1", namn: "P1-recept", maltid: ["middag"], portioner: 2, ingredienser: [], egen: true });
    var p2 = W.Profiles.add("MR-test");
    W.Profiles.switch(p2.id);
    eq(W.MyRecipes.count(), 0, "ny profil ska inte se andra profilens recept");
    W.Profiles.switch(p1);
    eq(W.MyRecipes.count(), 1, "första profilens recept ska vara kvar");
    W.Profiles.remove(p2.id);
    W.MyRecipes.clear();
  });
});

group("Pantry (pantry.js)", function () {
  test("set / has / toggle / clear", function () {
    W.Pantry.clear();
    eq(W.Pantry.list().length, 0);
    W.Pantry.set(["a", "b"]);
    assert(W.Pantry.has("a")); assert(W.Pantry.has("b"));
    W.Pantry.toggle("a"); assert(!W.Pantry.has("a"));
    W.Pantry.clear(); eq(W.Pantry.list().length, 0);
  });
});

group("Veckomeny-store (weekplan.js)", function () {
  test("set / get / clear", function () {
    W.WeekPlan.clear();
    eq(W.WeekPlan.get(), null);
    W.WeekPlan.set({ meals: ["middag"], personer: 2, exclude: [], vardagsmax: 30, rester: true, haveFoods: [], slots: { "0-middag": { recipeId: "a", pinned: false, leftoverFrom: null } } });
    var p = W.WeekPlan.get();
    assert(p && p.slots["0-middag"].recipeId === "a");
  });
  test("setSlotRecipeFromEdit följer rester-relationen (uppdaterar både middag och rester-lunch)", function () {
    W.WeekPlan.set({
      meals: ["lunch", "middag"], personer: 2, exclude: [], vardagsmax: 30, rester: true, haveFoods: [],
      slots: {
        "0-middag": { recipeId: "X", pinned: false, leftoverFrom: null },
        "1-lunch":  { recipeId: "X", pinned: false, leftoverFrom: "0-middag" }
      }
    });
    W.WeekPlan.setSlotRecipeFromEdit("0-middag", "Y");
    var p = W.WeekPlan.get();
    eq(p.slots["0-middag"].recipeId, "Y", "middag uppdateras");
    eq(p.slots["1-lunch"].recipeId, "Y", "rester-lunch följer med");
  });
  test("setSlotRecipeFromEdit funkar även när man redigerar från rester-rutan", function () {
    W.WeekPlan.set({
      meals: ["lunch", "middag"], personer: 2, exclude: [], vardagsmax: 30, rester: true, haveFoods: [],
      slots: {
        "0-middag": { recipeId: "X", pinned: false, leftoverFrom: null },
        "1-lunch":  { recipeId: "X", pinned: false, leftoverFrom: "0-middag" }
      }
    });
    W.WeekPlan.setSlotRecipeFromEdit("1-lunch", "Z");
    var p = W.WeekPlan.get();
    eq(p.slots["0-middag"].recipeId, "Z", "source-middagen uppdateras också");
    eq(p.slots["1-lunch"].recipeId, "Z");
  });
  test("setSlotRecipeFromEdit påverkar inte orelaterade slots", function () {
    W.WeekPlan.set({
      meals: ["middag"], personer: 2, exclude: [], vardagsmax: 30, rester: false, haveFoods: [],
      slots: {
        "0-middag": { recipeId: "A", pinned: false, leftoverFrom: null },
        "2-middag": { recipeId: "B", pinned: false, leftoverFrom: null }
      }
    });
    W.WeekPlan.setSlotRecipeFromEdit("0-middag", "NY");
    var p = W.WeekPlan.get();
    eq(p.slots["0-middag"].recipeId, "NY");
    eq(p.slots["2-middag"].recipeId, "B", "andra slots ska inte ändras");
  });
  test("setSlotRecipeFromEdit på en tom slot skapar slotten", function () {
    W.WeekPlan.set({
      meals: ["middag"], personer: 2, exclude: [], vardagsmax: 30, rester: false, haveFoods: [],
      slots: { "0-middag": { recipeId: "A", pinned: false, leftoverFrom: null } }
    });
    W.WeekPlan.setSlotRecipeFromEdit("3-middag", "NY");
    var p = W.WeekPlan.get();
    assert(p.slots["3-middag"], "ny slot ska ha skapats");
    eq(p.slots["3-middag"].recipeId, "NY");
  });
  test("setSlotRecipeFromEdit rensar bort freeText när man sparar ett recept dit", function () {
    W.WeekPlan.set({
      meals: ["middag"], personer: 2, exclude: [], vardagsmax: 30, rester: false, haveFoods: [],
      slots: { "0-middag": { freeText: "Pizza", recipeId: null, pinned: false, leftoverFrom: null } }
    });
    W.WeekPlan.setSlotRecipeFromEdit("0-middag", "NY");
    var p = W.WeekPlan.get();
    eq(p.slots["0-middag"].recipeId, "NY");
    assert(!p.slots["0-middag"].freeText, "freeText ska tas bort när ett recept skrivs in");
  });
});

group("Profiler (profiles.js)", function () {
  test("default-profil skapas automatiskt vid första körningen", function () {
    assert(W.Profiles.activeId(), "activeId saknas");
    assert(W.Profiles.list().length >= 1, "minst en profil ska finnas");
  });
  test("nsKey ger en namespace-prefixad nyckel för aktiv profil", function () {
    var k = W.nsKey("foo");
    assert(/^aik:p_/.test(k), "förväntade 'aik:p_…:foo', fick: " + k);
    assert(k.indexOf(":foo") !== -1, "saknar suffix");
  });
  test("nsKey ändras när man byter profil", function () {
    var p2 = W.Profiles.add("Test 2");
    var before = W.nsKey("foo");
    W.Profiles.switch(p2.id);
    var after = W.nsKey("foo");
    assert(before !== after, "nyckeln ska skilja mellan profiler");
    // städa upp så vi inte påverkar andra tester
    W.Profiles.switch(W.Profiles.list()[0].id);
    W.Profiles.remove(p2.id);
  });
  test("rename / setColor / setPin", function () {
    var p = W.Profiles.add("Original");
    W.Profiles.rename(p.id, "Bytt");
    eq(W.Profiles.list().filter(function (x) { return x.id === p.id; })[0].namn, "Bytt");
    W.Profiles.setColor(p.id, "blue");
    eq(W.Profiles.list().filter(function (x) { return x.id === p.id; })[0].farg, "blue");
    W.Profiles.setPin(p.id, "1234");
    eq(W.Profiles.list().filter(function (x) { return x.id === p.id; })[0].pin, "1234");
    W.Profiles.setPin(p.id, null);
    assert(!("pin" in (W.Profiles.list().filter(function (x) { return x.id === p.id; })[0])));
    W.Profiles.remove(p.id);
  });
  test("kan inte ta bort sista profilen", function () {
    while (W.Profiles.list().length > 1) W.Profiles.remove(W.Profiles.list()[W.Profiles.list().length - 1].id);
    eq(W.Profiles.remove(W.Profiles.list()[0].id), false, "ska returnera false när bara en profil finns");
    assert(W.Profiles.list().length === 1, "minst en profil ska kvarstå");
  });
  test("varje profil har egen data (Cart-prov)", function () {
    var p1 = W.Profiles.active().id;
    W.Cart.clear(); W.Cart.add("r1", 4);
    var p2 = W.Profiles.add("P2");
    W.Profiles.switch(p2.id);
    eq(W.Cart.count(), 0, "ny profil ska börja med tom kundvagn");
    W.Cart.add("r2", 2);
    eq(W.Cart.count(), 1);
    W.Profiles.switch(p1);
    eq(W.Cart.count(), 1, "första profilens kundvagn ska vara intakt");
    assert(W.Cart.has("r1") && !W.Cart.has("r2"));
    W.Profiles.remove(p2.id);
    W.Cart.clear();
  });
  test("export + import roundtrip bevarar data", function () {
    var p = W.Profiles.active();
    W.Cart.clear(); W.Cart.add("xx", 3);
    var payload = W.Profiles.exportProfile(p.id);
    assert(payload && payload.profile && payload.data, "export-payload saknar fält");
    W.Cart.remove("xx");
    var p2 = W.Profiles.importProfile(payload);
    assert(p2, "import returnerade null");
    W.Profiles.switch(p2.id);
    eq(W.Cart.count(), 1, "importerad cart ska ha 1 post");
    assert(W.Cart.has("xx"));
    // städa
    W.Profiles.switch(p.id);
    W.Profiles.remove(p2.id);
    W.Cart.clear();
  });
});

/* ---------- Slutsumma ---------- */
console.log("\n" + (__failed === 0 ? "✓ " : "✗ ") + __passed + " ok, " + __failed + " fail");
if (__failed > 0) { console.log("Failed: " + __failures.join(", ")); process.exit(1); }
