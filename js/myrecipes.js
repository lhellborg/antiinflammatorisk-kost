/* ============================================================
   Egna recept – sparas i webbläsaren (localStorage).
   Skapas på sidan "Förbättra ett recept". Har samma form som
   recepten i data/recept.js, plus { egen: true }.
   Lyssna på "myrecipes:changed" på document för att reagera.
   ============================================================ */

window.MyRecipes = (function () {
  var KEY = "aik_egna_recept_v1";

  function read() {
    try {
      var a = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(a) ? a : [];
    } catch (e) { return []; }
  }
  function write(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("myrecipes:changed", { detail: { recept: a.slice() } }));
  }
  function idxOf(a, id) { for (var i = 0; i < a.length; i++) if (a[i].id === id) return i; return -1; }

  return {
    list:  read,
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
