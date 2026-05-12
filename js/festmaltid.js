/* ============================================================
   Festmåltid – välj förrätt / huvudrätt / efterrätt var för sig
   (eller alla tre), få en slumpad festmeny av recepten, byt ut
   per rätt och lägg hela menyn i inköpslistan.
   ============================================================ */

(function () {
  var FESTRATTER = window.FESTRATTER || [
    { id: "forratt", label: "Förrätt", maltid: "forratt" },
    { id: "huvudratt", label: "Huvudrätt", maltid: "middag" },
    { id: "efterratt", label: "Efterrätt", maltid: "efterratt" }
  ];
  var KEY = "aik_festmeny_v1";

  var elCourses   = document.getElementById("fm-courses");
  var elPresetAll = document.getElementById("fm-preset-all");
  var elPersHold  = document.getElementById("fm-personer");
  var elAllergen  = document.getElementById("fm-allergen");
  var elGenerate  = document.getElementById("fm-generate");
  var elEmpty     = document.getElementById("fm-empty");
  var elResult    = document.getElementById("fm-result");
  var elMenu      = document.getElementById("fm-menu");
  var elToCart    = document.getElementById("fm-to-cart");
  var elPrint     = document.getElementById("fm-print");
  var elCartMsg   = document.getElementById("fm-cart-msg");
  if (!elMenu) return;

  function chip(container, value, label, olive, checked) {
    var l = document.createElement("label"); l.className = "chip" + (olive ? " olive" : "") + (checked ? " is-checked" : "");
    var i = document.createElement("input"); i.type = "checkbox"; i.value = value; if (checked) i.checked = true;
    i.addEventListener("change", function () { l.classList.toggle("is-checked", i.checked); });
    l.appendChild(i); l.appendChild(document.createTextNode(label));
    container.appendChild(l);
  }
  FESTRATTER.forEach(function (c) { chip(elCourses, c.id, c.label, true, true); });
  window.ALLERGENER.forEach(function (a) { chip(elAllergen, a.id, a.label, false, false); });
  var persStepper = window.makeStepper(4, 1, function () {});
  elPersHold.appendChild(persStepper);

  elPresetAll.addEventListener("click", function () {
    elCourses.querySelectorAll("input").forEach(function (i) { i.checked = true; i.closest(".chip").classList.add("is-checked"); });
  });

  function checkedCourses() {
    var arr = Array.prototype.map.call(elCourses.querySelectorAll("input:checked"), function (i) { return i.value; });
    return FESTRATTER.map(function (c) { return c.id; }).filter(function (id) { return arr.indexOf(id) !== -1; });
  }
  function checkedAllergener() { return Array.prototype.map.call(elAllergen.querySelectorAll("input:checked"), function (i) { return i.value; }); }
  function setCourses(ids) { elCourses.querySelectorAll("input").forEach(function (i) { i.checked = (ids || []).indexOf(i.value) !== -1; i.closest(".chip").classList.toggle("is-checked", i.checked); }); }
  function setAllergener(ids) { elAllergen.querySelectorAll("input").forEach(function (i) { i.checked = (ids || []).indexOf(i.value) !== -1; i.closest(".chip").classList.toggle("is-checked", i.checked); }); }

  function courseDef(id) { for (var i = 0; i < FESTRATTER.length; i++) if (FESTRATTER[i].id === id) return FESTRATTER[i]; return null; }
  function allowed(r, exclude) { for (var i = 0; i < (exclude || []).length; i++) if ((r.allergener || []).indexOf(exclude[i]) !== -1) return false; return true; }
  function poolForCourse(courseId, exclude) {
    var def = courseDef(courseId);
    var all = window.allRecipes().filter(function (r) { return (r.maltid || []).indexOf(def.maltid) !== -1 && allowed(r, exclude); });
    if (courseId === "huvudratt") {
      var festig = all.filter(function (r) { return (r.mood || []).indexOf("fest") !== -1 || (r.mood || []).indexOf("vill-bjuda") !== -1; });
      if (festig.length) return festig;
    }
    return all;
  }
  function pickFrom(pool, avoidId) {
    var cands = avoidId ? pool.filter(function (r) { return r.id !== avoidId; }) : pool.slice();
    if (!cands.length) cands = pool.slice();
    return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
  }

  /* ---------- state ---------- */
  var state = null; // { courses:[...], personer:n, exclude:[...], menu:{ <courseId>: recipeId } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function load() { try { var o = JSON.parse(localStorage.getItem(KEY) || "null"); return (o && o.menu) ? o : null; } catch (e) { return null; } }

  function generate() {
    var courses = checkedCourses(); if (!courses.length) courses = ["huvudratt"];
    var exclude = checkedAllergener();
    var personer = persStepper.getValue();
    var used = [], menu = {};
    courses.forEach(function (cid) {
      var pool = poolForCourse(cid, exclude).filter(function (r) { return used.indexOf(r.id) === -1; });
      if (!pool.length) pool = poolForCourse(cid, exclude);
      var pick = pickFrom(pool);
      if (pick) { menu[cid] = pick.id; used.push(pick.id); }
    });
    state = { courses: courses, personer: personer, exclude: exclude, menu: menu };
    save(); render();
  }
  function rerollCourse(cid) {
    if (!state) return;
    var pool = poolForCourse(cid, state.exclude).filter(function (r) {
      return Object.keys(state.menu).every(function (k) { return k === cid || state.menu[k] !== r.id; });
    });
    if (!pool.length) pool = poolForCourse(cid, state.exclude);
    var pick = pickFrom(pool, state.menu[cid]);
    if (pick) { state.menu[cid] = pick.id; save(); render(); }
  }

  /* ---------- render ---------- */
  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }
  function courseCard(cid) {
    var def = courseDef(cid);
    var rid = state.menu[cid];
    var r = rid ? window.recipeById(rid) : null;
    var c = document.createElement("article"); c.className = "card course-card";
    var lbl = document.createElement("div"); lbl.className = "course-label"; lbl.textContent = def.label; c.appendChild(lbl);
    if (!r) { var e = document.createElement("p"); e.className = "help"; e.textContent = "Inga recept passade – lätta på allergenfiltret eller lägg till egna recept."; c.appendChild(e); return c; }

    var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);
    var meta = document.createElement("div"); meta.className = "meta";
    if (r.tid) meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    if (r.egen) meta.appendChild(tag("Eget recept", "own"));
    (r.plus || []).forEach(function (p) { meta.appendChild(tag("✓ " + p, "plus")); });
    (r.allergener || []).forEach(function (a) { meta.appendChild(tag("innehåller " + window.labelFor(window.ALLERGENER, a).toLowerCase(), "warn")); });
    c.appendChild(meta);
    if (r.beskrivning) { var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d); }

    var ihead = document.createElement("div"); ihead.className = "ingr-head";
    var ist = document.createElement("strong"); ist.textContent = "Ingredienser (" + state.personer + (state.personer === 1 ? " gäst" : " gäster") + ")"; ihead.appendChild(ist);
    c.appendChild(ihead);
    c.appendChild(window.renderIngredientList(r, state.personer));

    if (r.steg && r.steg.length) {
      var det = document.createElement("details");
      var sum = document.createElement("summary"); sum.textContent = "Så här gör du"; det.appendChild(sum);
      var ol = document.createElement("ol"); ol.className = "steps";
      r.steg.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      det.appendChild(ol); c.appendChild(det);
    }
    var actions = document.createElement("div"); actions.className = "btn-row no-print"; actions.style.marginTop = ".7rem";
    var rb = document.createElement("button"); rb.type = "button"; rb.className = "btn btn-ghost"; rb.textContent = "Byt ut";
    rb.addEventListener("click", function () { rerollCourse(cid); });
    actions.appendChild(rb);
    c.appendChild(actions);
    return c;
  }
  function render() {
    if (!state || !state.courses || !state.courses.length) { elEmpty.classList.remove("hidden"); elResult.classList.add("hidden"); return; }
    elEmpty.classList.add("hidden"); elResult.classList.remove("hidden");
    elMenu.innerHTML = "";
    state.courses.forEach(function (cid) { elMenu.appendChild(courseCard(cid)); });
    elCartMsg.textContent = "";
  }

  /* ---------- knappar ---------- */
  elGenerate.addEventListener("click", function () { generate(); elResult.scrollIntoView({ behavior: "smooth", block: "start" }); });
  elPrint.addEventListener("click", function () { window.print(); });
  elToCart.addEventListener("click", function () {
    if (!state) return;
    var added = 0;
    Object.keys(state.menu).forEach(function (cid) {
      var rid = state.menu[cid]; if (!rid || !window.recipeById(rid)) return;
      window.Cart.add(rid, state.personer); added++;
    });
    elCartMsg.innerHTML = added + (added === 1 ? " rätt" : " rätter") + " lades i inköpslistan (skalat till " + state.personer + (state.personer === 1 ? " gäst" : " gäster") + "). <a href=\"inkopslista.html\">Öppna inköpslistan</a>.";
  });
  document.addEventListener("myrecipes:changed", function () { if (state) render(); });

  /* ---------- init ---------- */
  (function init() {
    var saved = load();
    if (saved) { state = saved; setCourses(saved.courses); setAllergener(saved.exclude); persStepper.setValue(saved.personer || 4); }
    render();
  })();
})();
