/* ============================================================
   Inköpslista-sidan – visar valda recept (med portionsväljare)
   och slår ihop deras ingredienser till en lista, skalad efter
   antal portioner och grupperad efter butiksavdelning.
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

  // { recipe, portioner } för varje recept i listan som faktiskt finns kvar i datan
  function selection() {
    return window.Cart.list().map(function (it) {
      var r = byId[it.id];
      if (!r) return null;
      return { recipe: r, portioner: (it.portioner && it.portioner > 0) ? it.portioner : r.portioner };
    }).filter(Boolean);
  }

  function receptCard(sel) {
    var r = sel.recipe;
    var c = document.createElement("article"); c.className = "card";
    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);

    var meta = document.createElement("div"); meta.className = "meta";
    (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    c.appendChild(meta);

    var head = document.createElement("div"); head.className = "ingr-head";
    var title = document.createElement("strong"); title.textContent = "Ingredienser"; head.appendChild(title);
    var holder = document.createElement("div");
    var stepper = window.makeStepper(sel.portioner, 1, function (n) {
      window.Cart.setPortions(r.id, n); // -> cart:changed -> render() bygger om
    });
    head.appendChild(stepper);
    c.appendChild(head);
    holder.appendChild(window.renderIngredientList(r, sel.portioner));
    c.appendChild(holder);

    var rm = document.createElement("button");
    rm.type = "button"; rm.className = "btn btn-ghost no-print"; rm.textContent = "Ta bort";
    rm.addEventListener("click", function () { window.Cart.remove(r.id); });
    c.appendChild(rm);
    return c;
  }

  // ingrediens-id -> { poster: [{mangd,enhet}], recept: [namn,...] }
  function aggregate(sels) {
    var idx = {};
    sels.forEach(function (sel) {
      var r = sel.recipe;
      (r.ingredienser || []).forEach(function (it) {
        if (!idx[it.id]) idx[it.id] = { poster: [], recept: [] };
        idx[it.id].poster.push({ mangd: window.scaleAmount(it.mangd, r.portioner, sel.portioner), enhet: it.enhet });
        if (idx[it.id].recept.indexOf(r.namn) === -1) idx[it.id].recept.push(r.namn);
      });
    });
    return idx;
  }

  function ingredientRow(id, info) {
    var li = document.createElement("li"); li.className = "shop-item";
    var label = document.createElement("label");
    var cb = document.createElement("input"); cb.type = "checkbox";
    cb.addEventListener("change", function () { li.classList.toggle("done", cb.checked); });
    var name = document.createElement("span"); name.className = "shop-name";
    var amtStr = window.combineAmounts(info.poster);
    name.textContent = (amtStr ? amtStr + " " : "") + window.ravaraLabel(id);
    label.appendChild(cb); label.appendChild(name);
    li.appendChild(label);
    var src = document.createElement("span"); src.className = "shop-src";
    src.textContent = "till: " + info.recept.join(", ");
    li.appendChild(src);
    return li;
  }

  function renderIngredients(sels) {
    var idx = aggregate(sels);
    elIngr.innerHTML = "";
    var order = window.KATEGORIER.map(function (k) { return k.namn; }).concat(["Övrigt"]);
    var groups = {};
    Object.keys(idx).forEach(function (id) {
      var cat = window.categoryFor(id);
      (groups[cat] = groups[cat] || []).push(id);
    });
    order.forEach(function (cat) {
      var items = groups[cat];
      if (!items || !items.length) return;
      items.sort(function (a, b) { return window.ravaraLabel(a).localeCompare(window.ravaraLabel(b), "sv"); });
      var hh = document.createElement("h3"); hh.className = "shop-cat"; hh.textContent = cat;
      var ul = document.createElement("ul"); ul.className = "shop-list";
      items.forEach(function (id) { ul.appendChild(ingredientRow(id, idx[id])); });
      elIngr.appendChild(hh); elIngr.appendChild(ul);
    });
  }

  function render() {
    var sels = selection();
    if (sels.length === 0) {
      elEmpty.classList.remove("hidden");
      elContent.classList.add("hidden");
      return;
    }
    elEmpty.classList.add("hidden");
    elContent.classList.remove("hidden");
    elRecept.innerHTML = "";
    sels.forEach(function (sel) { elRecept.appendChild(receptCard(sel)); });
    renderIngredients(sels);
  }

  document.getElementById("inkop-print").addEventListener("click", function () { window.print(); });
  document.getElementById("inkop-clear").addEventListener("click", function () {
    if (confirm("Töm hela inköpslistan?")) window.Cart.clear();
  });
  document.addEventListener("cart:changed", render);
  render();
})();
