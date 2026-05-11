/* ============================================================
   "Vad ska jag äta?" – bygger formuläret på startsidan,
   poängsätter recepten och visar ett förslag + alternativ.
   ============================================================ */

(function () {
  var recept = window.RECEPT || [];

  var elMeals  = document.getElementById("pick-meals");
  var elMoods  = document.getElementById("pick-moods");
  var elFoods  = document.getElementById("pick-foods");
  var elResult = document.getElementById("forslag-result");
  var btnGo    = document.getElementById("forslag-go");
  var btnAll   = document.getElementById("forslag-clear");

  if (!elMeals) return; // inte på den här sidan

  /* ---------- bygg "chips" ---------- */
  function chip(name, value, label, olive) {
    var l = document.createElement("label");
    l.className = "chip" + (olive ? " olive" : "");
    var i = document.createElement("input");
    i.type = "checkbox"; i.name = name; i.value = value;
    i.addEventListener("change", function () { l.classList.toggle("is-checked", i.checked); });
    l.appendChild(i);
    l.appendChild(document.createTextNode(label));
    return l;
  }

  window.MALTIDER.forEach(function (m) { elMeals.appendChild(chip("meal", m.id, m.label, true)); });
  window.MOODS.forEach(function (m)    { elMoods.appendChild(chip("mood", m.id, m.label, false)); });
  window.RAVAROR.forEach(function (r)  { elFoods.appendChild(chip("food", r.id, r.label, true)); });

  function checkedValues(name) {
    return Array.prototype.map.call(
      document.querySelectorAll('input[name="' + name + '"]:checked'),
      function (i) { return i.value; });
  }

  /* ---------- poängsättning ---------- */
  // Rätt måltid är ett filter. Sen ger varje matchande "mood" mest poäng
  // (det är så du känner dig just nu), och varje råvara du redan har hemma
  // ger lite poäng. Ett litet slumptillägg gör att listan inte blir
  // identisk varje gång man trycker.
  function score(r, moods, foods) {
    var s = 0;
    var ids = window.ingredientIds(r);
    moods.forEach(function (m) { if (r.mood && r.mood.indexOf(m) !== -1) s += 4; });
    foods.forEach(function (f) { if (ids.indexOf(f) !== -1) s += 2; });
    s += Math.random() * 0.9;
    return s;
  }

  function rank() {
    var meals = checkedValues("meal");
    var moods = checkedValues("mood");
    var foods = checkedValues("food");
    var pool = recept.filter(function (r) {
      if (meals.length === 0) return true;
      return meals.some(function (m) { return r.maltid && r.maltid.indexOf(m) !== -1; });
    });
    pool = pool.map(function (r) { return { r: r, s: score(r, moods, foods) }; })
               .sort(function (a, b) { return b.s - a.s; });
    return { items: pool, foods: foods };
  }

  /* ---------- rendera resultat ---------- */
  var cartPainters = []; // funktioner som målar om "i inköpslistan"-knappar i nuvarande resultat
  document.addEventListener("cart:changed", function () {
    cartPainters.forEach(function (fn) { fn(); });
  });

  function tag(text, cls) { var sp = document.createElement("span"); sp.className = "tag" + (cls ? " " + cls : ""); sp.textContent = text; return sp; }

  function metaRow(r) {
    var row = document.createElement("div"); row.className = "meta";
    (r.maltid || []).forEach(function (m) { row.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    row.appendChild(tag("≈ " + r.tid + " min", "time"));
    (r.plus || []).forEach(function (p) { row.appendChild(tag("✓ " + p, "plus")); });
    (r.allergener || []).forEach(function (a) { row.appendChild(tag("innehåller " + window.labelFor(window.ALLERGENER, a).toLowerCase(), "warn")); });
    return row;
  }

  function cartButton(id, getPortions) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn cart-toggle";
    function paint() {
      var on = window.Cart.has(id);
      btn.classList.toggle("btn-secondary", on);
      btn.classList.toggle("btn-ghost", !on);
      btn.textContent = on ? "✓ I inköpslistan" : "+ Lägg till i inköpslistan";
    }
    btn.addEventListener("click", function () { window.Cart.toggle(id, getPortions ? getPortions() : null); });
    cartPainters.push(paint);
    paint();
    return btn;
  }

  function linkTo(href, text, cls) {
    var a = document.createElement("a"); a.href = href; a.className = "btn " + cls; a.textContent = text; return a;
  }

  function renderHero(r, foods) {
    var box = document.createElement("div"); box.className = "result-hero";
    var eye = document.createElement("div"); eye.className = "eyebrow"; eye.textContent = "Vårt förslag";
    var h = document.createElement("h2"); h.textContent = r.namn;
    box.appendChild(eye); box.appendChild(h);
    box.appendChild(metaRow(r));
    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; box.appendChild(d);

    // portionsväljare + skalad ingredienslista
    var inCart = window.Cart.get(r.id);
    var startP = (inCart && inCart.portioner) ? inCart.portioner : r.portioner;

    var head = document.createElement("div"); head.className = "ingr-head";
    var title = document.createElement("strong"); title.textContent = "Ingredienser"; head.appendChild(title);
    var stepper = window.makeStepper(startP, 1, function (n) {
      drawIngr(n);
      if (window.Cart.has(r.id)) window.Cart.setPortions(r.id, n);
    });
    head.appendChild(stepper);
    box.appendChild(head);

    var holder = document.createElement("div"); box.appendChild(holder);
    function drawIngr(n) { holder.innerHTML = ""; holder.appendChild(window.renderIngredientList(r, n, foods)); }
    drawIngr(startP);

    if (r.steg && r.steg.length) {
      var stepsTitle = document.createElement("strong"); stepsTitle.className = "block-title"; stepsTitle.textContent = "Så här gör du";
      box.appendChild(stepsTitle);
      var ol = document.createElement("ol"); ol.className = "steps";
      r.steg.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      box.appendChild(ol);
    }

    var row = document.createElement("div"); row.className = "btn-row";
    row.appendChild(cartButton(r.id, function () { return stepper.getValue(); }));
    row.appendChild(linkTo("recept.html", "Se alla recept", "btn-ghost"));
    box.appendChild(row);

    // håll knapp/stepper i synk om listan ändras någon annanstans
    cartPainters.push(function () {
      var item = window.Cart.get(r.id);
      if (item && item.portioner && item.portioner !== stepper.getValue()) {
        stepper.setValue(item.portioner); drawIngr(item.portioner);
      }
    });
    return box;
  }

  function renderAltCard(r) {
    var c = document.createElement("article"); c.className = "card";
    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);
    c.appendChild(metaRow(r));
    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d);
    var note = document.createElement("p"); note.className = "help"; note.textContent = "Receptet är för " + r.portioner + (r.portioner === 1 ? " portion" : " portioner") + " – ändra antalet på inköpslistan."; c.appendChild(note);
    c.appendChild(cartButton(r.id, function () { return r.portioner; }));
    return c;
  }

  function show() {
    cartPainters = [];
    var res = rank();
    elResult.innerHTML = "";
    if (res.items.length === 0) {
      elResult.innerHTML = '<p class="help">Inga recept matchade valet. Prova att kryssa i färre saker.</p>';
      return;
    }
    elResult.appendChild(renderHero(res.items[0].r, res.foods));
    var rest = res.items.slice(1, 4);
    if (rest.length) {
      var wrap = document.createElement("div"); wrap.className = "alts";
      var h = document.createElement("h3"); h.textContent = "Eller något av dessa";
      var grid = document.createElement("div"); grid.className = "card-grid";
      rest.forEach(function (it) { grid.appendChild(renderAltCard(it.r)); });
      wrap.appendChild(h); wrap.appendChild(grid);
      elResult.appendChild(wrap);
    }
    elResult.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  btnGo.addEventListener("click", show);
  btnAll.addEventListener("click", function () {
    document.querySelectorAll('#forslag-form input:checked').forEach(function (i) {
      i.checked = false; i.closest(".chip").classList.remove("is-checked");
    });
    elResult.innerHTML = ""; cartPainters = [];
  });
})();
