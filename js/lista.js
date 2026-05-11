/* ============================================================
   Receptlistan på recept.html – visar alla recept, låter
   besökaren filtrera (måltid/tid/allergener), välja antal
   portioner per recept och lägga recept i inköpslistan.
   ============================================================ */

(function () {
  var recept = window.RECEPT || [];

  var elMeal   = document.getElementById("f-meal");
  var elTime   = document.getElementById("f-time");
  var elAller  = document.getElementById("f-allergen");
  var elList   = document.getElementById("recept-list");
  var elCount  = document.getElementById("recept-count");

  if (!elList) return;

  var state = { meal: "alla", time: 999, exclude: [] };

  /* ---------- bygg filter-kontroller ---------- */
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

  function syncChipClasses(container) {
    container.querySelectorAll(".chip").forEach(function (c) {
      c.classList.toggle("is-checked", c.querySelector("input").checked);
    });
  }
  function readState() {
    state.meal = (document.querySelector('input[name="meal"]:checked') || {}).value || "alla";
    state.time = parseInt((document.querySelector('input[name="time"]:checked') || {}).value || "999", 10);
    state.exclude = Array.prototype.map.call(
      document.querySelectorAll('input[name="allergen"]:checked'), function (i) { return i.value; });
  }
  function matches(r) {
    if (state.meal !== "alla" && !(r.maltid || []).includes(state.meal)) return false;
    if (r.tid > state.time) return false;
    for (var i = 0; i < state.exclude.length; i++) {
      if ((r.allergener || []).includes(state.exclude[i])) return false;
    }
    return true;
  }

  /* ---------- bygg kort (en gång per recept) ---------- */
  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function buildCard(r) {
    var c = document.createElement("article"); c.className = "card";

    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);

    var meta = document.createElement("div"); meta.className = "meta";
    (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    c.appendChild(meta);

    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d);

    if (r.plus && r.plus.length) {
      var pm = document.createElement("div"); pm.className = "meta";
      r.plus.forEach(function (p) { pm.appendChild(tag("✓ " + p, "plus")); });
      c.appendChild(pm);
    }

    // portionsväljare – startar på det antal som ev. finns i inköpslistan
    var inCart = window.Cart.get(r.id);
    var startP = (inCart && inCart.portioner) ? inCart.portioner : r.portioner;

    var ingrWrap = document.createElement("div"); ingrWrap.className = "ingr-wrap";
    var ingrHead = document.createElement("div"); ingrHead.className = "ingr-head";
    var ingrTitle = document.createElement("strong"); ingrTitle.textContent = "Ingredienser";
    ingrHead.appendChild(ingrTitle);

    var stepper = window.makeStepper(startP, 1, function (n) {
      drawIngredients(n);
      if (window.Cart.has(r.id)) window.Cart.setPortions(r.id, n);
    });
    ingrHead.appendChild(stepper);
    ingrWrap.appendChild(ingrHead);

    var ingrListHolder = document.createElement("div");
    ingrWrap.appendChild(ingrListHolder);
    function drawIngredients(n) {
      ingrListHolder.innerHTML = "";
      ingrListHolder.appendChild(window.renderIngredientList(r, n));
    }
    drawIngredients(startP);
    c.appendChild(ingrWrap);

    if (r.steg && r.steg.length) {
      var det = document.createElement("details");
      var sum = document.createElement("summary"); sum.textContent = "Så här gör du";
      det.appendChild(sum);
      var ol = document.createElement("ol"); ol.className = "steps";
      r.steg.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      det.appendChild(ol);
      c.appendChild(det);
    }

    if (r.allergener && r.allergener.length) {
      var am = document.createElement("div"); am.className = "meta";
      r.allergener.forEach(function (a) { am.appendChild(tag("innehåller " + window.labelFor(window.ALLERGENER, a).toLowerCase(), "warn")); });
      c.appendChild(am);
    }

    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn cart-toggle";
    function paintBtn() {
      var on = window.Cart.has(r.id);
      btn.classList.toggle("btn-secondary", on);
      btn.classList.toggle("btn-ghost", !on);
      btn.textContent = on ? "✓ I inköpslistan" : "+ Lägg till i inköpslistan";
    }
    btn.addEventListener("click", function () {
      window.Cart.toggle(r.id, stepper.getValue());
    });
    c.appendChild(btn);

    // håll knapp + stepper i synk om listan ändras någon annanstans
    function syncFromCart() {
      paintBtn();
      var item = window.Cart.get(r.id);
      if (item && item.portioner && item.portioner !== stepper.getValue()) {
        stepper.setValue(item.portioner);
        drawIngredients(item.portioner);
      }
    }
    document.addEventListener("cart:changed", syncFromCart);
    paintBtn();

    return c;
  }

  // bygg alla kort en gång; filtrering döljer/visar dem
  var cards = recept.map(function (r) { return { r: r, el: buildCard(r) }; });
  cards.forEach(function (x) { elList.appendChild(x.el); });

  function applyFilter() {
    readState();
    syncChipClasses(elMeal); syncChipClasses(elTime); syncChipClasses(elAller);
    var shown = 0;
    cards.forEach(function (x) {
      var ok = matches(x.r);
      x.el.classList.toggle("hidden", !ok);
      if (ok) shown++;
    });
    elCount.textContent = shown + " av " + recept.length + " recept";
    var empty = document.getElementById("recept-empty");
    if (shown === 0) {
      if (!empty) { empty = document.createElement("p"); empty.id = "recept-empty"; empty.className = "help"; empty.textContent = "Inga recept matchade. Lätta på filtren ovan."; elList.appendChild(empty); }
      empty.classList.remove("hidden");
    } else if (empty) { empty.classList.add("hidden"); }
  }

  document.getElementById("recept-filters").addEventListener("change", applyFilter);
  applyFilter();

  /* ---------- liten "X recept i listan"-bar längst ner ---------- */
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
