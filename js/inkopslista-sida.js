/* ============================================================
   Inköpslista-sidan – visar valda recept (med portionsväljare)
   och slår ihop deras ingredienser till en lista, skalad efter
   antal portioner och grupperad efter butiksavdelning. Funkar
   för både inbyggda och egna recept.
   ============================================================ */

(function () {
  var elEmpty   = document.getElementById("inkop-empty");
  var elContent = document.getElementById("inkop-content");
  var elRecept  = document.getElementById("inkop-recept");
  var elIngr    = document.getElementById("inkop-ingredienser");
  var elFoods   = document.getElementById("inkop-foods");
  var elHarBlk  = document.getElementById("inkop-harhemma-block");
  var elHarHemma= document.getElementById("inkop-harhemma");
  if (!elEmpty) return;

  function pantryIds() { return window.Pantry ? window.Pantry.list() : []; }

  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function buildIndex() {
    var byId = {};
    window.allRecipes().forEach(function (r) { byId[r.id] = r; });
    return byId;
  }

  // { recipe, portioner } för varje recept i listan som finns kvar
  function selection() {
    var byId = buildIndex();
    return window.Cart.list().map(function (it) {
      var r = byId[it.id];
      if (!r) return null;
      return { recipe: r, portioner: (it.portioner && it.portioner > 0) ? it.portioner : (r.portioner || 2) };
    }).filter(Boolean);
  }

  function receptCard(sel) {
    var r = sel.recipe;
    var c = document.createElement("article"); c.className = "card";
    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);

    var meta = document.createElement("div"); meta.className = "meta";
    if (r.egen) meta.appendChild(tag("Eget recept", "own"));
    (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    if (r.tid) meta.appendChild(tag("≈ " + r.tid + " min", "time"));
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

  // ingrediens-id -> { label, poster: [{mangd,enhet}], recept: [namn,...] }
  function aggregate(sels) {
    var idx = {};
    sels.forEach(function (sel) {
      var r = sel.recipe;
      (r.ingredienser || []).forEach(function (it) {
        if (!idx[it.id]) idx[it.id] = { label: window.ingrLabel(it), poster: [], recept: [] };
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
    name.textContent = (amtStr ? amtStr + " " : "") + info.label;
    label.appendChild(cb); label.appendChild(name);
    li.appendChild(label);
    var src = document.createElement("span"); src.className = "shop-src";
    src.textContent = "till: " + info.recept.join(", ");
    li.appendChild(src);
    return li;
  }

  // Rendera en lista av ingrediens-id grupperade efter butiksavdelning till en container.
  function renderCategoryGroups(idx, ids, container) {
    container.innerHTML = "";
    var order = window.KATEGORIER.map(function (k) { return k.namn; }).concat(["Övrigt"]);
    var groups = {};
    ids.forEach(function (id) { var cat = window.categoryFor(id); (groups[cat] = groups[cat] || []).push(id); });
    order.forEach(function (cat) {
      var items = groups[cat];
      if (!items || !items.length) return;
      items.sort(function (a, b) { return idx[a].label.localeCompare(idx[b].label, "sv"); });
      var hh = document.createElement("h3"); hh.className = "shop-cat"; hh.textContent = cat;
      var ul = document.createElement("ul"); ul.className = "shop-list";
      items.forEach(function (id) { ul.appendChild(ingredientRow(id, idx[id])); });
      container.appendChild(hh); container.appendChild(ul);
    });
  }

  function renderIngredients(sels) {
    var idx = aggregate(sels);
    var harHemma = pantryIds();
    var allIds = Object.keys(idx);
    var attHandla = allIds.filter(function (id) { return harHemma.indexOf(id) === -1; });
    var harIds   = allIds.filter(function (id) { return harHemma.indexOf(id) !== -1; });

    renderCategoryGroups(idx, attHandla, elIngr);
    if (!attHandla.length) elIngr.innerHTML = '<p class="help">Allt som behövs säger du att du redan har hemma – kolla mängderna nedan!</p>';

    if (elHarBlk) {
      if (harIds.length) {
        elHarBlk.classList.remove("hidden");
        renderCategoryGroups(idx, harIds, elHarHemma);
      } else {
        elHarBlk.classList.add("hidden");
        elHarHemma.innerHTML = "";
      }
    }
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

  /* ---------- "vad har du hemma"-väljare (delas med veckomenyn via Pantry) ---------- */
  function buildFoodPicker() {
    if (!elFoods) return;
    elFoods.innerHTML = "";
    var have = pantryIds();
    window.RAVAROR.forEach(function (r) {
      var l = document.createElement("label"); l.className = "chip olive" + (have.indexOf(r.id) !== -1 ? " is-checked" : "");
      var i = document.createElement("input"); i.type = "checkbox"; i.value = r.id; if (have.indexOf(r.id) !== -1) i.checked = true;
      i.addEventListener("change", function () { l.classList.toggle("is-checked", i.checked); });
      l.appendChild(i); l.appendChild(document.createTextNode(r.label));
      elFoods.appendChild(l);
    });
    elFoods.addEventListener("change", function () {
      if (window.Pantry) window.Pantry.set(Array.prototype.map.call(elFoods.querySelectorAll("input:checked"), function (i) { return i.value; }));
    });
  }
  if (elFoods && window.Pantry) buildFoodPicker();

  document.getElementById("inkop-print").addEventListener("click", function () { window.print(); });
  document.getElementById("inkop-clear").addEventListener("click", function () {
    if (confirm("Töm hela inköpslistan?")) window.Cart.clear();
  });
  document.addEventListener("cart:changed", render);
  document.addEventListener("myrecipes:changed", render);
  document.addEventListener("pantry:changed", function () { render(); /* OBS: bygg inte om pickern (skulle nollställa fokus) – chip-klasserna är redan i synk via change-lyssnaren */ });
  render();
})();
