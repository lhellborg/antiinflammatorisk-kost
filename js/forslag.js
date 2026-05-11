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
    i.addEventListener("change", function () {
      l.classList.toggle("is-checked", i.checked);
    });
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
      function (i) { return i.value; }
    );
  }

  /* ---------- poängsättning ---------- */
  // Tanken: rätt måltid är ett filter. Sen ger varje matchande "mood" mest
  // poäng (det är så du känner dig just nu), och varje råvara du redan har
  // hemma ger lite poäng. Recept utan någon matchning alls får ett litet
  // slumptillägg så listan inte blir identisk varje gång.
  function score(r, meals, moods, foods) {
    var s = 0;
    moods.forEach(function (m) { if (r.mood && r.mood.indexOf(m) !== -1) s += 4; });
    foods.forEach(function (f) { if (r.ingredienser && r.ingredienser.indexOf(f) !== -1) s += 2; });
    // liten bonus för "snabba" rätter om man bad om snabbt finns redan ovan
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

    pool = pool.map(function (r) {
      return { r: r, s: score(r, meals, moods, foods) };
    }).sort(function (a, b) { return b.s - a.s; });

    return { items: pool, meals: meals, moods: moods, foods: foods };
  }

  /* ---------- rendera resultat ---------- */
  function tag(text, cls) {
    var sp = document.createElement("span");
    sp.className = "tag" + (cls ? " " + cls : "");
    sp.textContent = text;
    return sp;
  }

  function metaRow(r, haveFoods) {
    var row = document.createElement("div");
    row.className = "meta";
    (r.maltid || []).forEach(function (m) { row.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    row.appendChild(tag("≈ " + r.tid + " min", "time"));
    (r.plus || []).forEach(function (p) { row.appendChild(tag("✓ " + p, "plus")); });
    (r.allergener || []).forEach(function (a) { row.appendChild(tag("innehåller " + window.labelFor(window.ALLERGENER, a).toLowerCase(), "warn")); });
    return row;
  }

  function hasList(r, haveFoods) {
    var have = (r.ingredienser || []).filter(function (i) { return haveFoods.indexOf(i) !== -1; });
    var miss = (r.ingredienser || []).filter(function (i) { return haveFoods.indexOf(i) === -1; });
    var p = document.createElement("p");
    p.className = "help";
    if (haveFoods.length === 0) {
      p.innerHTML = "<strong>Ingredienser:</strong> " + (r.ingredienser || []).join(", ");
    } else {
      p.innerHTML = "<strong>Du har redan:</strong> " + (have.length ? have.join(", ") : "—") +
                    "<br><strong>Du behöver:</strong> " + (miss.length ? miss.join(", ") : "inget mer!");
    }
    return p;
  }

  function cartButton(id) {
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "btn cart-toggle";
    function paint() {
      var on = window.Cart.has(id);
      btn.classList.toggle("btn-secondary", on);
      btn.classList.toggle("btn-ghost", !on);
      btn.textContent = on ? "✓ I inköpslistan" : "+ Lägg till i inköpslistan";
    }
    btn.addEventListener("click", function () { window.Cart.toggle(id); });
    document.addEventListener("cart:changed", paint);
    paint();
    return btn;
  }

  function renderHero(r, haveFoods) {
    var box = document.createElement("div");
    box.className = "result-hero";
    var eye = document.createElement("div"); eye.className = "eyebrow"; eye.textContent = "Vårt förslag";
    var h = document.createElement("h2"); h.textContent = r.namn;
    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning;
    box.appendChild(eye);
    box.appendChild(h);
    box.appendChild(metaRow(r, haveFoods));
    box.appendChild(d);
    box.appendChild(hasList(r, haveFoods));
    if (r.steg && r.steg.length) {
      var ol = document.createElement("ol"); ol.className = "steps";
      r.steg.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      box.appendChild(ol);
    }
    var row = document.createElement("div"); row.className = "btn-row";
    row.appendChild(cartButton(r.id));
    row.appendChild(linkTo("recept.html", "Se alla recept", "btn-ghost"));
    box.appendChild(row);
    return box;
  }

  function linkTo(href, text, cls) {
    var a = document.createElement("a"); a.href = href; a.className = "btn " + cls; a.textContent = text; return a;
  }

  function renderAltCard(r, haveFoods) {
    var c = document.createElement("article"); c.className = "card";
    var h = document.createElement("h3"); h.textContent = r.namn;
    var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning;
    c.appendChild(h);
    c.appendChild(metaRow(r, haveFoods));
    c.appendChild(d);
    c.appendChild(cartButton(r.id));
    return c;
  }

  function show() {
    var res = rank();
    elResult.innerHTML = "";
    if (res.items.length === 0) {
      elResult.innerHTML = '<p class="help">Inga recept matchade valet. Prova att kryssa i färre saker.</p>';
      return;
    }
    var best = res.items[0].r;
    elResult.appendChild(renderHero(best, res.foods));

    var rest = res.items.slice(1, 4);
    if (rest.length) {
      var wrap = document.createElement("div"); wrap.className = "alts";
      var h = document.createElement("h3"); h.textContent = "Eller något av dessa";
      var grid = document.createElement("div"); grid.className = "card-grid";
      rest.forEach(function (it) { grid.appendChild(renderAltCard(it.r, res.foods)); });
      wrap.appendChild(h);
      wrap.appendChild(grid);
      elResult.appendChild(wrap);
    }
    elResult.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  btnGo.addEventListener("click", show);
  btnAll.addEventListener("click", function () {
    document.querySelectorAll('#forslag-form input:checked').forEach(function (i) {
      i.checked = false;
      i.closest(".chip").classList.remove("is-checked");
    });
    elResult.innerHTML = "";
  });
})();
