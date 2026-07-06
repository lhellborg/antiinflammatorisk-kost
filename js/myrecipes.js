/* ============================================================
   Egna recept – sparas i webbläsaren (localStorage).
   Skapas på sidan "Förbättra ett recept". Har samma form som
   recepten i data/recept.js, plus { egen: true }.
   Lyssna på "myrecipes:changed" på document för att reagera.
   ============================================================ */

window.MyRecipes = (function () {
  function KEY() { return window.nsKey ? window.nsKey("aik_egna_recept_v1") : "aik_egna_recept_v1"; }

  // Samma cache-upplägg som i Cart (js/store.js): parsa en gång, läs om
  // vid profilbyte (annan nyckel), profilimport eller ändring i annan flik.
  var cache = null, cacheKey = null;
  function invalidate() { cache = null; cacheKey = null; }

  function read() {
    var k = KEY();
    if (cache && cacheKey === k) return cache;
    try {
      var a = JSON.parse(localStorage.getItem(k) || "[]");
      cache = Array.isArray(a) ? a : [];
    } catch (e) { cache = []; }
    cacheKey = k;
    return cache;
  }
  function write(a) {
    try { localStorage.setItem(KEY(), JSON.stringify(a)); } catch (e) {}
    cache = a; cacheKey = KEY();
    document.dispatchEvent(new CustomEvent("myrecipes:changed", { detail: { recept: a.slice() } }));
  }
  function idxOf(a, id) { for (var i = 0; i < a.length; i++) if (a[i].id === id) return i; return -1; }

  document.addEventListener("profile:changed", invalidate);
  if (typeof window.addEventListener === "function") window.addEventListener("storage", invalidate);

  return {
    list:  function () { return read().slice(); }, // kopia – cachen ska inte kunna ändras utifrån
    count: function () { return read().length; },
    get:   function (id) { var a = read(), i = idxOf(a, id); return i === -1 ? null : a[i]; },
    add:   function (r) { var a = read(), i = idxOf(a, r.id); if (i === -1) a.push(r); else a[i] = r; write(a); },
    remove:function (id) { write(read().filter(function (x) { return x.id !== id; })); },
    clear: function () { write([]); },
    newId: function () { return "egen-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 6); }
  };
})();

// Alla recept = inbyggda (data/recept.js) + egna (localStorage)
window.allRecipes = function () {
  return (window.RECEPT || []).concat(window.MyRecipes ? window.MyRecipes.list() : []);
};
window.recipeById = function (id) {
  var all = window.allRecipes();
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
};
