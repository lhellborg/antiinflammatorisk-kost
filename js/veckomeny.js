/* ============================================================
   Smart veckomeny – genererar en veckas matsedel av recepten
   (inbyggda + egna), med variation, balans, storkok/rester, och
   knapp för att lägga hela veckan i inköpslistan.
   ============================================================ */

(function () {
  var DAGAR = window.VECKODAGAR; // ["Måndag", ... "Söndag"]

  var elMeals     = document.getElementById("vm-meals");
  var elPersHold  = document.getElementById("vm-personer");
  var elVardag    = document.getElementById("vm-vardagsmax");
  var elAllergen  = document.getElementById("vm-allergen");
  var elResterCb  = document.getElementById("vm-rester");
  var elResterChip= document.getElementById("vm-rester-chip");
  var elFoods     = document.getElementById("vm-foods");
  var elGenerate  = document.getElementById("vm-generate");
  var elRerollAll = document.getElementById("vm-reroll-all");
  var elEmpty     = document.getElementById("vm-empty");
  var elPlanWrap  = document.getElementById("vm-plan");
  var elGrid      = document.getElementById("vm-grid");
  var elToCart    = document.getElementById("vm-to-cart");
  var elPrint     = document.getElementById("vm-print");
  var elClear     = document.getElementById("vm-clear");
  var elCartMsg   = document.getElementById("vm-cart-msg");
  var elStapleNotice = document.getElementById("vm-staple-notice");
  if (!elGrid) return;

  var MEAL_ORDER = ["frukost", "lunch", "middag", "mellanmal"];

  /* ---------- inställnings-UI ---------- */
  function checkChip(container, value, label, olive, checked) {
    var l = document.createElement("label"); l.className = "chip" + (olive ? " olive" : "") + (checked ? " is-checked" : "");
    var i = document.createElement("input"); i.type = "checkbox"; i.value = value; if (checked) i.checked = true;
    i.addEventListener("change", function () { l.classList.toggle("is-checked", i.checked); });
    l.appendChild(i); l.appendChild(document.createTextNode(label));
    container.appendChild(l);
  }
  var DEFAULT_MEALS = ["lunch", "middag"];
  window.MALTIDER.forEach(function (m) { checkChip(elMeals, m.id, m.label, true, DEFAULT_MEALS.indexOf(m.id) !== -1); });
  window.ALLERGENER.forEach(function (a) { checkChip(elAllergen, a.id, a.label, false, false); });
  window.RAVAROR.forEach(function (r) { checkChip(elFoods, r.id, r.label, true, false); });

  // "vad har du hemma" delas med inköpslistan via window.Pantry
  function setFoodChips(ids) {
    elFoods.querySelectorAll("input").forEach(function (i) {
      i.checked = (ids || []).indexOf(i.value) !== -1;
      i.closest(".chip").classList.toggle("is-checked", i.checked);
    });
  }
  function checkedFoods() { return Array.prototype.map.call(elFoods.querySelectorAll("input:checked"), function (i) { return i.value; }); }
  if (window.Pantry) {
    setFoodChips(window.Pantry.list());
    elFoods.addEventListener("change", function () { window.Pantry.set(checkedFoods()); });
    document.addEventListener("pantry:changed", function (e) {
      var ids = (e.detail && e.detail.ids) || (window.Pantry ? window.Pantry.list() : []);
      // undvik oändlig loop: sätt bara om det skiljer sig
      var cur = checkedFoods();
      if (cur.length !== ids.length || cur.some(function (x) { return ids.indexOf(x) === -1; })) setFoodChips(ids);
    });
  }

  var persStepper = window.makeStepper(4, 1, function () {});
  elPersHold.appendChild(persStepper);

  function radioChip(container, name, value, label, checked) {
    var l = document.createElement("label"); l.className = "chip" + (checked ? " is-checked" : "");
    var i = document.createElement("input"); i.type = "radio"; i.name = name; i.value = value; i.checked = !!checked;
    l.appendChild(i); l.appendChild(document.createTextNode(label));
    container.appendChild(l);
  }
  radioChip(elVardag, "vmax", "15", "≤ 15 min", false);
  radioChip(elVardag, "vmax", "30", "≤ 30 min", true);
  radioChip(elVardag, "vmax", "0",  "Ingen gräns", false);
  elVardag.addEventListener("change", function () { elVardag.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-checked", c.querySelector("input").checked); }); });
  elResterCb.addEventListener("change", function () { elResterChip.classList.toggle("is-checked", elResterCb.checked); });

  function readSettings() {
    var meals = Array.prototype.map.call(elMeals.querySelectorAll("input:checked"), function (i) { return i.value; });
    if (!meals.length) meals = ["middag"];
    meals.sort(function (a, b) { return MEAL_ORDER.indexOf(a) - MEAL_ORDER.indexOf(b); });
    return {
      meals: meals,
      personer: persStepper.getValue(),
      exclude: Array.prototype.map.call(elAllergen.querySelectorAll("input:checked"), function (i) { return i.value; }),
      vardagsmax: parseInt((elVardag.querySelector("input:checked") || {}).value || "30", 10),
      rester: elResterCb.checked,
      haveFoods: Array.prototype.map.call(elFoods.querySelectorAll("input:checked"), function (i) { return i.value; })
    };
  }
  function applySettings(s) {
    elMeals.querySelectorAll("input").forEach(function (i) { i.checked = (s.meals || []).indexOf(i.value) !== -1; i.closest(".chip").classList.toggle("is-checked", i.checked); });
    persStepper.setValue(s.personer || 4);
    elAllergen.querySelectorAll("input").forEach(function (i) { i.checked = (s.exclude || []).indexOf(i.value) !== -1; i.closest(".chip").classList.toggle("is-checked", i.checked); });
    elVardag.querySelectorAll("input").forEach(function (i) { i.checked = String(s.vardagsmax) === i.value; i.closest(".chip").classList.toggle("is-checked", i.checked); });
    elResterCb.checked = (s.rester !== false); elResterChip.classList.toggle("is-checked", elResterCb.checked);
    // "vad har du hemma" hämtas alltid från Pantry, inte från den sparade planen
  }

  /* ---------- recept-typ (för balansreglerna) ---------- */
  function recipeTyp(r) {
    var ids = (r.ingredienser || []).map(function (it) { return it.id; });
    var txt = ids.join(" ") + " " + (r.ingredienser || []).map(function (it) { return (it.namn || "").toLowerCase(); }).join(" ") + " " + (r.namn || "").toLowerCase();
    function has(words) { return words.some(function (w) { return txt.indexOf(w) !== -1; }); }
    if (ids.indexOf("lax") !== -1 || ids.indexOf("sardiner") !== -1 || has(["fisk", "torsk", "räk", "rak", "makrill", "sill", "tonfisk", "skaldjur"])) return "fisk";
    if (has(["nötfärs", "notfars", "blandfärs", "blandfars", "fläskfärs", "flaskfars", "köttfärs", "kottfars", "nötkött", "notkott", "fläskkött", "flaskkott", "korv", "bacon", "chark", "biff", "rött kött"])) return "rott-kott";
    if (ids.indexOf("kyckling") !== -1) return "kyckling";
    if (ids.indexOf("agg") !== -1 && !has(["linser", "kikärt", "bön", "tofu", "quinoa", "lax", "kyckling"])) return "agg";
    return "vego";
  }

  // En "lagar-en-gång"-rätt som lämpar sig att laga i större sats (grytor, soppor,
  // bolognese, dal, bowl …) eller som redan ger gott om portioner.
  function isBatchFriendly(r) {
    return /gryta|soppa|bolognese|\bdal\b|gratäng|gratang|ragu|wok|bowl|chili|curry/i.test(r.namn || "") || (r.tid || 0) >= 30;
  }
  function canMakeLeftovers(r, personer) {
    return (r.portioner || 0) >= 2 * personer || isBatchFriendly(r);
  }

  function allowed(r, exclude) {
    for (var i = 0; i < (exclude || []).length; i++) if ((r.allergener || []).indexOf(exclude[i]) !== -1) return false;
    return true;
  }
  function poolFor(meal, exclude) {
    return window.allRecipes().filter(function (r) { return (r.maltid || []).indexOf(meal) !== -1 && allowed(r, exclude); });
  }
  function maxUses(meal) { return meal === "frukost" ? 3 : (meal === "mellanmal" ? 4 : 1); }

  /* ---------- generator ---------- */
  function generate(s, keepPinnedFrom) {
    var slots = {};
    var pinned = {};
    if (keepPinnedFrom && keepPinnedFrom.slots) {
      Object.keys(keepPinnedFrom.slots).forEach(function (k) {
        var sl = keepPinnedFrom.slots[k];
        if (sl && sl.pinned && sl.recipeId) pinned[k] = { recipeId: sl.recipeId, pinned: true, leftoverFrom: null };
      });
    }
    var usedCount = {};
    function bump(id) { usedCount[id] = (usedCount[id] || 0) + 1; }
    var typAntal = { fisk: 0, "rott-kott": 0, kyckling: 0, agg: 0, vego: 0 };

    function score(r, meal, isVardag) {
      var sc = 1 + Math.random() * 0.6;
      if (s.haveFoods && s.haveFoods.length) {
        var ids = (r.ingredienser || []).map(function (it) { return it.id; });
        sc += s.haveFoods.filter(function (f) { return ids.indexOf(f) !== -1; }).length * 0.7;
      }
      if (meal === "middag") {
        var t = recipeTyp(r);
        if (t === "fisk" && typAntal.fisk < 2) sc += 1.6;
        if (t === "vego" && typAntal.vego < 3) sc += 1.0;
        if (t === "rott-kott") sc -= (typAntal["rott-kott"] >= 1 ? 4 : 0.5);
        if (t === "kyckling" && typAntal.kyckling >= 2) sc -= 1.5;
      }
      return sc;
    }
    function pickFor(meal, isVardag) {
      var pool = poolFor(meal, s.exclude);
      var cands = pool.filter(function (r) {
        if ((usedCount[r.id] || 0) >= maxUses(meal)) return false;
        if (meal === "middag" && isVardag && s.vardagsmax > 0 && (r.tid || 0) > s.vardagsmax) return false;
        return true;
      });
      if (!cands.length) cands = pool.filter(function (r) { return (usedCount[r.id] || 0) < maxUses(meal); });
      if (!cands.length) cands = pool.slice();
      if (!cands.length) return null;
      cands = cands.map(function (r) { return { r: r, sc: score(r, meal, isVardag) }; }).sort(function (a, b) { return b.sc - a.sc; });
      return cands[0].r;
    }
    function setSlot(d, meal, recipeId, leftoverFrom) { slots[d + "-" + meal] = { recipeId: recipeId, pinned: false, leftoverFrom: leftoverFrom || null }; }

    // 1) middag först
    if (s.meals.indexOf("middag") !== -1) {
      for (var d = 0; d < 7; d++) {
        var key = d + "-middag";
        if (pinned[key]) {
          slots[key] = pinned[key]; bump(pinned[key].recipeId);
          var pr = window.recipeById(pinned[key].recipeId);
          if (pr) { var pt = recipeTyp(pr); if (typAntal[pt] != null) typAntal[pt]++; }
          continue;
        }
        var isVardag = d <= 4;
        var r = pickFor("middag", isVardag);
        if (!r) continue;
        bump(r.id);
        var t = recipeTyp(r); if (typAntal[t] != null) typAntal[t]++;
        setSlot(d, "middag", r.id, null);
        if (s.rester && s.meals.indexOf("lunch") !== -1 && d < 6) {
          var lk = (d + 1) + "-lunch";
          if (!pinned[lk] && canMakeLeftovers(r, s.personer)) setSlot(d + 1, "lunch", r.id, d + "-middag");
        }
      }
    }
    // 2) övriga måltider (frukost, lunch, mellanmål) – hoppa över rutor som redan
    //    fyllts av en rester-lunch ovan
    ["frukost", "lunch", "mellanmal"].forEach(function (meal) {
      if (s.meals.indexOf(meal) === -1) return;
      for (var d3 = 0; d3 < 7; d3++) {
        var k3 = d3 + "-" + meal;
        if (slots[k3]) continue;
        if (pinned[k3]) { slots[k3] = pinned[k3]; bump(pinned[k3].recipeId); continue; }
        var rr = pickFor(meal, d3 <= 4);
        if (!rr) continue;
        bump(rr.id);
        setSlot(d3, meal, rr.id, null);
      }
    });

    return { meals: s.meals.slice(), personer: s.personer, exclude: (s.exclude || []).slice(), vardagsmax: s.vardagsmax, rester: s.rester, haveFoods: (s.haveFoods || []).slice(), slots: slots };
  }

  /* ---------- byt ut en enskild ruta ---------- */
  // avoidFn (valfri): r => true om receptet ska undvikas (t.ex. baljväxttunga rätter)
  function rerollSlot(p, dayIdx, meal, avoidFn) {
    var key = dayIdx + "-" + meal;
    var usedCount = {};
    Object.keys(p.slots).forEach(function (k) {
      if (k === key) return;
      var sl = p.slots[k]; if (!sl || sl.leftoverFrom) return;
      usedCount[sl.recipeId] = (usedCount[sl.recipeId] || 0) + 1;
    });
    var current = p.slots[key] && p.slots[key].recipeId;
    var basePool = poolFor(meal, p.exclude).filter(function (r) {
      if ((usedCount[r.id] || 0) >= maxUses(meal)) return false;
      if (meal === "middag" && dayIdx <= 4 && p.vardagsmax > 0 && (r.tid || 0) > p.vardagsmax) return false;
      return true;
    });
    var pool = basePool;
    if (avoidFn) { var pref = basePool.filter(function (r) { return !avoidFn(r); }); if (pref.length) pool = pref; }
    var pick;
    var notSame = pool.filter(function (r) { return r.id !== current; });
    if (notSame.length) pick = notSame[Math.floor(Math.random() * notSame.length)];
    else if (pool.length) pick = pool[Math.floor(Math.random() * pool.length)];
    else {
      var any = poolFor(meal, p.exclude).filter(function (r) { return r.id !== current; });
      if (avoidFn) { var ap = any.filter(function (r) { return !avoidFn(r); }); if (ap.length) any = ap; }
      if (!any.length) any = poolFor(meal, p.exclude);
      if (!any.length) return;
      pick = any[Math.floor(Math.random() * any.length)];
    }
    // rensa ev. rester som hängde på den gamla rätten i denna ruta
    Object.keys(p.slots).forEach(function (k) {
      var sl = p.slots[k];
      if (sl && sl.leftoverFrom === key && !sl.pinned) delete p.slots[k];
    });
    p.slots[key] = { recipeId: pick.id, pinned: false, leftoverFrom: null };
    // ny rester från denna middag?
    if (meal === "middag" && p.rester && p.meals.indexOf("lunch") !== -1 && dayIdx < 6) {
      var lk = (dayIdx + 1) + "-lunch";
      var lex = p.slots[lk];
      if (!lex && canMakeLeftovers(pick, p.personer)) p.slots[lk] = { recipeId: pick.id, pinned: false, leftoverFrom: key };
    }
  }

  /* ---------- rendering ---------- */
  var plan = null;
  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function mealEntry(dayIdx, meal) {
    var key = dayIdx + "-" + meal;
    var sl = plan.slots[key];
    var box = document.createElement("div"); box.className = "meal-slot";
    box.appendChild(tag(window.labelFor(window.MALTIDER, meal), "meal"));

    if (!sl) { var e = document.createElement("p"); e.className = "help"; e.textContent = "—"; box.appendChild(e); return box; }
    var r = window.recipeById(sl.recipeId);
    if (!r) {
      var miss = document.createElement("p"); miss.className = "help"; miss.textContent = "(recept borttaget)"; box.appendChild(miss);
      var rb0 = document.createElement("button"); rb0.type = "button"; rb0.className = "btn btn-ghost no-print"; rb0.textContent = "Byt ut";
      rb0.addEventListener("click", function () { rerollSlot(plan, dayIdx, meal); save(); render(); }); box.appendChild(rb0);
      return box;
    }
    var nm = document.createElement("div"); nm.className = "meal-name"; nm.textContent = r.namn; box.appendChild(nm);
    var meta = document.createElement("div"); meta.className = "meta";
    if (r.tid) meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    if (r.egen) meta.appendChild(tag("Eget recept", "own"));
    box.appendChild(meta);

    if (sl.leftoverFrom) {
      var lfDay = parseInt(sl.leftoverFrom.split("-")[0], 10);
      var lf = document.createElement("p"); lf.className = "help leftover-note";
      lf.textContent = "🍱 Rester från " + DAGAR[lfDay].toLowerCase() + "ens middag";
      box.appendChild(lf);
      return box;
    }
    var actions = document.createElement("div"); actions.className = "btn-row slot-actions no-print";
    var rb = document.createElement("button"); rb.type = "button"; rb.className = "btn btn-ghost"; rb.textContent = "Byt ut";
    rb.addEventListener("click", function () { rerollSlot(plan, dayIdx, meal); save(); render(); });
    var pin = document.createElement("button"); pin.type = "button"; pin.className = "btn btn-ghost"; pin.textContent = sl.pinned ? "🔒 Låst" : "Lås";
    pin.addEventListener("click", function () { sl.pinned = !sl.pinned; save(); render(); });
    actions.appendChild(rb); actions.appendChild(pin);
    box.appendChild(actions);
    return box;
  }

  function render() {
    if (!plan) { elEmpty.classList.remove("hidden"); elPlanWrap.classList.add("hidden"); return; }
    elEmpty.classList.add("hidden"); elPlanWrap.classList.remove("hidden");
    elGrid.innerHTML = "";
    for (var d = 0; d < 7; d++) {
      var card = document.createElement("article"); card.className = "day-card" + (d > 4 ? " weekend" : "");
      var dn = document.createElement("h3"); dn.className = "day-name"; dn.textContent = DAGAR[d]; card.appendChild(dn);
      (plan.meals || []).forEach(function (meal) { card.appendChild(mealEntry(d, meal)); });
      elGrid.appendChild(card);
    }
    elCartMsg.textContent = "";
    renderStapleNotice();
  }
  function save() { window.WeekPlan.set(plan); }

  // notis om veckan blir tung på baljväxter
  function isLegumeHeavy(r) { return window.recipeStapleHeavy ? window.recipeStapleHeavy(r, "baljväxt") : false; }
  function legumeHeavySlots() {
    var arr = [];
    Object.keys(plan.slots).forEach(function (k) {
      var sl = plan.slots[k]; if (!sl || sl.leftoverFrom) return;
      var r = window.recipeById(sl.recipeId);
      if (r && isLegumeHeavy(r)) {
        var parts = k.split("-"); arr.push({ key: k, dayIdx: parseInt(parts[0], 10), meal: parts[1], pinned: !!sl.pinned });
      }
    });
    return arr;
  }
  function renderStapleNotice() {
    if (!elStapleNotice) return;
    if (!plan || !window.recipeStapleHeavy) { elStapleNotice.classList.add("hidden"); return; }
    var heavy = legumeHeavySlots();
    if (heavy.length < 4) { elStapleNotice.classList.add("hidden"); return; }
    elStapleNotice.classList.remove("hidden");
    elStapleNotice.innerHTML = "";
    var p = document.createElement("p");
    p.innerHTML = "🫘 <strong>Veckan blir ganska baljväxttung</strong> – " + heavy.length + " mål med linser/kikärtor/bönor som bas. Vill du variera?";
    elStapleNotice.appendChild(p);
    var btnRow = document.createElement("div"); btnRow.className = "btn-row"; btnRow.style.marginTop = ".6rem";
    var b = document.createElement("button"); b.type = "button"; b.className = "btn btn-secondary"; b.textContent = "Byt ut en av dem";
    b.addEventListener("click", function () {
      var cur = legumeHeavySlots().filter(function (x) { return !x.pinned; });
      if (!cur.length) { alert("Alla baljväxttunga rutor är låsta – lås upp någon först."); return; }
      var pickSlot = cur[Math.floor(Math.random() * cur.length)];
      rerollSlot(plan, pickSlot.dayIdx, pickSlot.meal, isLegumeHeavy);
      save(); render();
    });
    btnRow.appendChild(b);
    elStapleNotice.appendChild(btnRow);
  }

  /* ---------- knappar ---------- */
  elGenerate.addEventListener("click", function () { plan = generate(readSettings(), plan); save(); render(); elPlanWrap.scrollIntoView({ behavior: "smooth", block: "start" }); });
  elRerollAll.addEventListener("click", function () { plan = generate(readSettings(), plan); save(); render(); });
  elClear.addEventListener("click", function () { if (confirm("Töm hela veckomenyn?")) { window.WeekPlan.clear(); plan = null; render(); } });
  elPrint.addEventListener("click", function () { window.print(); });
  elToCart.addEventListener("click", function () {
    if (!plan) return;
    var count = {};
    Object.keys(plan.slots).forEach(function (k) { var sl = plan.slots[k]; if (sl && sl.recipeId) count[sl.recipeId] = (count[sl.recipeId] || 0) + 1; });
    var added = 0;
    Object.keys(count).forEach(function (id) { if (!window.recipeById(id)) return; window.Cart.add(id, plan.personer * count[id]); added++; });
    elCartMsg.innerHTML = added + " recept från veckan tillagda i inköpslistan (skalat till " + plan.personer + (plan.personer === 1 ? " portion" : " portioner") + " per måltid). <a href=\"inkopslista.html\">Öppna inköpslistan</a>.";
  });
  document.addEventListener("myrecipes:changed", function () { if (plan) render(); });

  /* ---------- init ---------- */
  (function init() {
    var saved = window.WeekPlan.get();
    if (saved) { plan = saved; applySettings(saved); }
    // migrera ev. "haveFoods" från en sparad plan till Pantry om Pantry är tom
    if (window.Pantry && !window.Pantry.list().length && saved && (saved.haveFoods || []).length) {
      window.Pantry.set(saved.haveFoods); setFoodChips(saved.haveFoods);
    }
    render();
  })();
})();
