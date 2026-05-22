/* ============================================================
   Receptlistan på recept.html – visar alla recept (inbyggda +
   egna), låter besökaren filtrera, välja antal portioner per
   recept, lägga recept i inköpslistan och hantera egna recept.
   ============================================================ */

(function () {
  var elMeal   = document.getElementById("f-meal");
  var elTime   = document.getElementById("f-time");
  var elAller  = document.getElementById("f-allergen");
  var elSearch = document.getElementById("f-search");
  var elList   = document.getElementById("recept-list");
  var elCount  = document.getElementById("recept-count");
  if (!elList) return;

  var state = { meal: "alla", time: 999, exclude: [], search: "" };

  /* ---------- filter-kontroller ---------- */
  function radio(name, value, label, checked) {
    var l = document.createElement("label"); l.className = "chip" + (checked ? " is-checked" : "");
    var i = document.createElement("input"); i.type = "radio"; i.name = name; i.value = value; i.checked = !!checked;
    l.appendChild(i); l.appendChild(document.createTextNode(label));
    return l;
  }
  function checkbox(name, value, label) {
    var l = document.createElement("label"); l.className = "chip";
    var i = document.createElement("input"); i.type = "checkbox"; i.name = name; i.value = value;
    l.appendChild(i); l.appendChild(document.createTextNode(label));
    return l;
  }
  elMeal.appendChild(radio("meal", "alla", "Alla", true));
  window.MALTIDER.forEach(function (m) { elMeal.appendChild(radio("meal", m.id, m.label, false)); });
  elTime.appendChild(radio("time", "999", "Spelar ingen roll", true));
  elTime.appendChild(radio("time", "15", "≤ 15 min", false));
  elTime.appendChild(radio("time", "30", "≤ 30 min", false));
  window.ALLERGENER.forEach(function (a) { elAller.appendChild(checkbox("allergen", a.id, a.label)); });

  function syncChipClasses(c) { c.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("is-checked", x.querySelector("input").checked); }); }
  function readState() {
    state.meal = (document.querySelector('input[name="meal"]:checked') || {}).value || "alla";
    state.time = parseInt((document.querySelector('input[name="time"]:checked') || {}).value || "999", 10);
    state.exclude = Array.prototype.map.call(document.querySelectorAll('input[name="allergen"]:checked'), function (i) { return i.value; });
    state.search = (elSearch && elSearch.value || "").trim().toLowerCase();
  }
  function searchHaystack(r) {
    var ings = (r.ingredienser || []).map(function (it) {
      return (window.ingrLabel ? window.ingrLabel(it) : (it.namn || it.id || "")).toLowerCase();
    }).join(" ");
    return ((r.namn || "") + " " + (r.beskrivning || "") + " " + ings).toLowerCase();
  }
  function matches(r) {
    if (state.meal !== "alla" && !(r.maltid || []).includes(state.meal)) return false;
    if ((r.tid || 0) > state.time) return false;
    for (var i = 0; i < state.exclude.length; i++) if ((r.allergener || []).includes(state.exclude[i])) return false;
    if (state.search && searchHaystack(r).indexOf(state.search) === -1) return false;
    return true;
  }

  /* ---------- bygg ett receptkort ---------- */
  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function buildCard(r) {
    var c = document.createElement("article"); c.className = "card" + (r.egen ? " card-egen" : "");

    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);

    var meta = document.createElement("div"); meta.className = "meta";
    if (r.egen) meta.appendChild(tag("Eget recept", "own"));
    (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    if (r.tid) meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    c.appendChild(meta);

    if (r.beskrivning) { var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d); }

    if (r.plus && r.plus.length) {
      var pm = document.createElement("div"); pm.className = "meta";
      r.plus.forEach(function (p) { pm.appendChild(tag("✓ " + p, "plus")); });
      c.appendChild(pm);
    }

    var inCart = window.Cart.get(r.id);
    var startP = (inCart && inCart.portioner) ? inCart.portioner : (r.portioner || 2);

    var head = document.createElement("div"); head.className = "ingr-head";
    var title = document.createElement("strong"); title.textContent = "Ingredienser"; head.appendChild(title);
    var stepper = window.makeStepper(startP, 1, function (n) {
      drawIngr(n);
      if (window.Cart.has(r.id)) window.Cart.setPortions(r.id, n);
    });
    head.appendChild(stepper);
    c.appendChild(head);

    var holder = document.createElement("div"); c.appendChild(holder);
    function drawIngr(n) { holder.innerHTML = ""; holder.appendChild(window.renderIngredientList(r, n)); }
    drawIngr(startP);

    if (r.steg && r.steg.length) {
      var det = document.createElement("details");
      var sum = document.createElement("summary"); sum.textContent = "Så här gör du"; det.appendChild(sum);
      var ol = document.createElement("ol"); ol.className = "steps";
      r.steg.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      det.appendChild(ol); c.appendChild(det);
    }

    if (r.allergener && r.allergener.length) {
      var am = document.createElement("div"); am.className = "meta";
      r.allergener.forEach(function (a) { am.appendChild(tag("innehåller " + window.labelFor(window.ALLERGENER, a).toLowerCase(), "warn")); });
      c.appendChild(am);
    }

    var btn = document.createElement("button"); btn.type = "button"; btn.className = "btn cart-toggle";
    function paintBtn() {
      var on = window.Cart.has(r.id);
      btn.classList.toggle("btn-secondary", on);
      btn.classList.toggle("btn-ghost", !on);
      btn.textContent = on ? "✓ I inköpslistan" : "+ Lägg till i inköpslistan";
    }
    btn.addEventListener("click", function () { window.Cart.toggle(r.id, stepper.getValue()); });
    c.appendChild(btn);

    var actRow = document.createElement("div"); actRow.className = "btn-row own-actions";
    var ver = document.createElement("a"); ver.href = "forbattra.html?from=" + encodeURIComponent(r.id); ver.className = "btn btn-ghost"; ver.textContent = "Gör en egen version"; actRow.appendChild(ver);
    if (r.egen) {
      var edit = document.createElement("a"); edit.href = "forbattra.html?edit=" + encodeURIComponent(r.id); edit.className = "btn btn-ghost"; edit.textContent = "Redigera"; actRow.appendChild(edit);
      var del = document.createElement("button"); del.type = "button"; del.className = "btn btn-ghost"; del.textContent = "Ta bort";
      del.addEventListener("click", function () { if (confirm('Ta bort "' + r.namn + '" från dina recept?')) { window.Cart.remove(r.id); window.MyRecipes.remove(r.id); } });
      actRow.appendChild(del);
    }
    c.appendChild(actRow);

    function syncFromCart() {
      paintBtn();
      var item = window.Cart.get(r.id);
      if (item && item.portioner && item.portioner !== stepper.getValue()) { stepper.setValue(item.portioner); drawIngr(item.portioner); }
    }
    document.addEventListener("cart:changed", syncFromCart);
    paintBtn();
    return c;
  }

  /* ---------- bygg/uppdatera hela listan ---------- */
  var cards = [];
  function rebuild() {
    var all = window.allRecipes();
    elList.innerHTML = "";
    cards = all.map(function (r) { return { r: r, el: buildCard(r) }; });
    cards.forEach(function (x) { elList.appendChild(x.el); });
    applyFilter();
  }
  function applyFilter() {
    readState();
    syncChipClasses(elMeal); syncChipClasses(elTime); syncChipClasses(elAller);
    var shown = 0;
    cards.forEach(function (x) { var ok = matches(x.r); x.el.classList.toggle("hidden", !ok); if (ok) shown++; });
    var total = cards.length;
    elCount.textContent = shown + " av " + total + " recept";
    var empty = document.getElementById("recept-empty");
    if (shown === 0) {
      if (!empty) { empty = document.createElement("p"); empty.id = "recept-empty"; empty.className = "help"; empty.textContent = "Inga recept matchade. Lätta på filtren ovan."; elList.appendChild(empty); }
      empty.classList.remove("hidden");
    } else if (empty) { empty.classList.add("hidden"); }
  }

  document.getElementById("recept-filters").addEventListener("change", applyFilter);
  if (elSearch) elSearch.addEventListener("input", applyFilter);
  document.addEventListener("myrecipes:changed", rebuild);
  rebuild();

  /* ---------- "X recept i listan"-bar ---------- */
  var bar = document.getElementById("cartbar");
  var barText = document.getElementById("cartbar-text");
  function updateBar() {
    if (!bar) return;
    var n = window.Cart.count();
    bar.classList.toggle("hidden", n === 0);
    if (n > 0) barText.textContent = n + " recept i inköpslistan";
  }
  document.addEventListener("cart:changed", updateBar);
  updateBar();
})();
