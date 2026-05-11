/* ============================================================
   Inköpslista-sidan – visar valda recept och slår ihop deras
   ingredienser till en lista, grupperad efter butiksavdelning.
   ============================================================ */

(function () {
  var recept = window.RECEPT || [];
  var byId = {};
  recept.forEach(function (r) { byId[r.id] = r; });

  var elEmpty   = document.getElementById("inkop-empty");
  var elContent = document.getElementById("inkop-content");
  var elRecept  = document.getElementById("inkop-recept");
  var elIngr    = document.getElementById("inkop-ingredienser");

  if (!elEmpty) return;

  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function receptCard(r) {
    var c = document.createElement("article"); c.className = "card";
    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);
    var meta = document.createElement("div"); meta.className = "meta";
    (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    c.appendChild(meta);
    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d);
    var rm = document.createElement("button");
    rm.type = "button"; rm.className = "btn btn-ghost no-print"; rm.textContent = "Ta bort";
    rm.addEventListener("click", function () { window.Cart.remove(r.id); });
    c.appendChild(rm);
    return c;
  }

  function buildIngredientIndex(recipes) {
    // map: ingrediens-id -> { count, recept: [namn, ...] }
    var idx = {};
    recipes.forEach(function (r) {
      (r.ingredienser || []).forEach(function (ing) {
        if (!idx[ing]) idx[ing] = { count: 0, recept: [] };
        idx[ing].count++;
        idx[ing].recept.push(r.namn);
      });
    });
    return idx;
  }

  function ingredientRow(ing, info) {
    var li = document.createElement("li"); li.className = "shop-item";
    var label = document.createElement("label");
    var cb = document.createElement("input"); cb.type = "checkbox";
    cb.addEventListener("change", function () { li.classList.toggle("done", cb.checked); });
    var name = document.createElement("span"); name.className = "shop-name";
    name.textContent = window.ravaraLabel(ing) + (info.count > 1 ? " (" + info.count + ")" : "");
    label.appendChild(cb); label.appendChild(name);
    li.appendChild(label);
    var src = document.createElement("span"); src.className = "shop-src";
    src.textContent = "till: " + info.recept.join(", ");
    li.appendChild(src);
    return li;
  }

  function renderIngredients(recipes) {
    var idx = buildIngredientIndex(recipes);
    elIngr.innerHTML = "";

    // gruppera efter kategori, i KATEGORIER-ordning, "Övrigt" sist
    var order = window.KATEGORIER.map(function (k) { return k.namn; }).concat(["Övrigt"]);
    var groups = {};
    Object.keys(idx).forEach(function (ing) {
      var cat = window.categoryFor(ing);
      (groups[cat] = groups[cat] || []).push(ing);
    });

    order.forEach(function (cat) {
      var items = groups[cat];
      if (!items || !items.length) return;
      items.sort(function (a, b) { return window.ravaraLabel(a).localeCompare(window.ravaraLabel(b), "sv"); });
      var h = document.createElement("h3"); h.className = "shop-cat"; h.textContent = cat;
      var ul = document.createElement("ul"); ul.className = "shop-list";
      items.forEach(function (ing) { ul.appendChild(ingredientRow(ing, idx[ing])); });
      elIngr.appendChild(h);
      elIngr.appendChild(ul);
    });
  }

  function render() {
    var ids = window.Cart.list();
    var recipes = ids.map(function (id) { return byId[id]; }).filter(Boolean);

    if (recipes.length === 0) {
      elEmpty.classList.remove("hidden");
      elContent.classList.add("hidden");
      return;
    }
    elEmpty.classList.add("hidden");
    elContent.classList.remove("hidden");

    elRecept.innerHTML = "";
    recipes.forEach(function (r) { elRecept.appendChild(receptCard(r)); });
    renderIngredients(recipes);
  }

  document.getElementById("inkop-print").addEventListener("click", function () { window.print(); });
  document.getElementById("inkop-clear").addEventListener("click", function () {
    if (confirm("Töm hela inköpslistan?")) window.Cart.clear();
  });
  document.addEventListener("cart:changed", render);
  render();
})();
