/* ============================================================
   Receptlistan på recept.html – visar alla recept och låter
   besökaren filtrera på måltid, tid och utesluta allergener.
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

  // måltid
  elMeal.appendChild(radio("meal", "alla", "Alla", true));
  window.MALTIDER.forEach(function (m) { elMeal.appendChild(radio("meal", m.id, m.label, false)); });
  // tid
  elTime.appendChild(radio("time", "999", "Spelar ingen roll", true));
  elTime.appendChild(radio("time", "15", "≤ 15 min", false));
  elTime.appendChild(radio("time", "30", "≤ 30 min", false));
  // allergener (uteslut)
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

  /* ---------- rendera kort ---------- */
  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function card(r) {
    var c = document.createElement("article"); c.className = "card";
    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);

    var meta = document.createElement("div"); meta.className = "meta";
    (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    meta.appendChild(tag(r.portioner + (r.portioner === 1 ? " portion" : " portioner")));
    c.appendChild(meta);

    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d);

    if (r.plus && r.plus.length) {
      var pm = document.createElement("div"); pm.className = "meta";
      r.plus.forEach(function (p) { pm.appendChild(tag("✓ " + p, "plus")); });
      c.appendChild(pm);
    }

    var ing = document.createElement("p"); ing.className = "help";
    ing.innerHTML = "<strong>Ingredienser:</strong> " + (r.ingredienser || []).join(", ");
    c.appendChild(ing);

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
    btn.type = "button";
    btn.className = "btn cart-toggle";
    function paint() {
      var on = window.Cart.has(r.id);
      btn.classList.toggle("btn-secondary", on);
      btn.classList.toggle("btn-ghost", !on);
      btn.textContent = on ? "✓ I inköpslistan" : "+ Lägg till i inköpslistan";
    }
    btn.addEventListener("click", function () { window.Cart.toggle(r.id); });
    document.addEventListener("cart:changed", paint);
    paint();
    c.appendChild(btn);
    return c;
  }

  function matches(r) {
    if (state.meal !== "alla" && !(r.maltid || []).includes(state.meal)) return false;
    if (r.tid > state.time) return false;
    for (var i = 0; i < state.exclude.length; i++) {
      if ((r.allergener || []).includes(state.exclude[i])) return false;
    }
    return true;
  }

  function render() {
    readState();
    syncChipClasses(elMeal); syncChipClasses(elTime); syncChipClasses(elAller);
    var shown = recept.filter(matches);
    elList.innerHTML = "";
    shown.forEach(function (r) { elList.appendChild(card(r)); });
    elCount.textContent = shown.length + " av " + recept.length + " recept";
    if (shown.length === 0) elList.innerHTML = '<p class="help">Inga recept matchade. Lätta på filtren ovan.</p>';
  }

  document.getElementById("recept-filters").addEventListener("change", render);
  render();

  /* ---------- liten "X recept i listan"-bar längst ner ---------- */
  var bar = document.getElementById("cartbar");
  var barText = document.getElementById("cartbar-text");
  function updateBar() {
    var n = window.Cart.count();
    if (!bar) return;
    bar.classList.toggle("hidden", n === 0);
    if (n > 0) barText.textContent = n + " recept i inköpslistan";
  }
  document.addEventListener("cart:changed", updateBar);
  updateBar();
})();
