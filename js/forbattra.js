/* ============================================================
   "Förbättra ett recept" – mata in din rätt, få byten/tillägg
   utifrån antiinflammatorisk kost, och spara resultatet som ett
   eget recept (som dyker upp i receptlistan och inköpslistan).
   ============================================================ */

(function () {
  var BYTEN   = window.BYTEN || [];
  var TIPS    = window.LAGG_TILL_TIPS || [];
  var KOKTIPS = window.TILLAGNINGSTIPS || [];
  var CHIPS   = window.MINDRE_BRA_CHIPS || [];

  var elNamn      = document.getElementById("fb-namn");
  var elMaltid    = document.getElementById("fb-maltid");
  var elPortHold  = document.getElementById("fb-portioner");
  var elTid       = document.getElementById("fb-tid");
  var elBadChips  = document.getElementById("fb-bad-chips");
  var elRows      = document.getElementById("fb-ingredienser");
  var elAddRad    = document.getElementById("fb-add-rad");
  var elSteg      = document.getElementById("fb-steg");
  var elAnalysera = document.getElementById("fb-analysera");
  var elResultat  = document.getElementById("fb-resultat");
  var elByten     = document.getElementById("fb-byten");
  var elLaggTill  = document.getElementById("fb-lagg-till");
  var elKok       = document.getElementById("fb-tillagning");
  var elLiknande  = document.getElementById("fb-liknande");
  var elPreview   = document.getElementById("fb-preview");
  var elSpara     = document.getElementById("fb-spara");
  var elSparaInk  = document.getElementById("fb-spara-inkop");
  var elSparad    = document.getElementById("fb-sparad");
  if (!elRows) return;

  var rows = [];          // [{mangd:Number|null, enhet, namn, _el, _namnInput, _mangdInput, _enhetSel, _swapped}]
  var editId = null;      // sätts om vi redigerar ett befintligt eget recept

  // portionsväljare
  var stepper = window.makeStepper(4, 1, function () { refreshIfShown(); });
  elPortHold.appendChild(stepper);

  // måltid-chips
  window.MALTIDER.forEach(function (m) {
    var l = document.createElement("label"); l.className = "chip olive";
    var i = document.createElement("input"); i.type = "checkbox"; i.value = m.id;
    i.addEventListener("change", function () { l.classList.toggle("is-checked", i.checked); });
    l.appendChild(i); l.appendChild(document.createTextNode(m.label));
    elMaltid.appendChild(l);
  });
  function checkedMaltider() {
    return Array.prototype.map.call(elMaltid.querySelectorAll("input:checked"), function (i) { return i.value; });
  }
  function setMaltider(arr) {
    elMaltid.querySelectorAll("input").forEach(function (i) {
      i.checked = arr.indexOf(i.value) !== -1;
      i.closest(".chip").classList.toggle("is-checked", i.checked);
    });
  }

  // snabbval "mindre bra"-ingredienser → lägger till en rad
  CHIPS.forEach(function (c) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = "+ " + c.label;
    b.addEventListener("click", function () { addRow({ mangd: null, enhet: "", namn: c.namn }, true); });
    elBadChips.appendChild(b);
  });

  /* ---------- ingrediensrader ---------- */
  function makeRowEl(row) {
    var div = document.createElement("div"); div.className = "ingr-row";

    var mangd = document.createElement("input");
    mangd.type = "number"; mangd.step = "0.25"; mangd.min = "0"; mangd.className = "in-mangd"; mangd.placeholder = "mängd";
    if (row.mangd != null) mangd.value = row.mangd;
    mangd.addEventListener("input", function () { row.mangd = mangd.value === "" ? null : parseFloat(mangd.value); });
    mangd.addEventListener("change", refreshIfShown);

    var enhet = document.createElement("select"); enhet.className = "in-enhet";
    window.ENHETER.forEach(function (e) {
      var o = document.createElement("option"); o.value = e; o.textContent = e === "" ? "(enhet)" : e;
      if (e === (row.enhet || "")) o.selected = true; enhet.appendChild(o);
    });
    enhet.addEventListener("change", function () { row.enhet = enhet.value; refreshIfShown(); });

    var namn = document.createElement("input");
    namn.type = "text"; namn.className = "in-namn"; namn.placeholder = "ingrediens, t.ex. crème fraiche"; namn.value = row.namn || "";
    namn.addEventListener("input", function () { row.namn = namn.value; row._swapped = false; });
    namn.addEventListener("change", refreshIfShown);

    var rm = document.createElement("button");
    rm.type = "button"; rm.className = "in-rm"; rm.textContent = "×"; rm.title = "Ta bort raden";
    rm.addEventListener("click", function () {
      var i = rows.indexOf(row); if (i !== -1) { rows.splice(i, 1); div.remove(); refreshIfShown(); }
    });

    div.appendChild(mangd); div.appendChild(enhet); div.appendChild(namn); div.appendChild(rm);
    row._el = div; row._namnInput = namn; row._mangdInput = mangd; row._enhetSel = enhet;
    return div;
  }
  function addRow(row, focusIt) {
    rows.push(row); elRows.appendChild(makeRowEl(row));
    refreshIfShown();
    if (focusIt && row._namnInput) row._namnInput.focus();
  }
  function seedEmpty(n) { for (var i = 0; i < (n || 3); i++) { var r = { mangd: null, enhet: "", namn: "" }; rows.push(r); elRows.appendChild(makeRowEl(r)); } }
  function nonEmptyRows() { return rows.filter(function (r) { return r.namn && r.namn.trim(); }); }
  elAddRad.addEventListener("click", function () { addRow({ mangd: null, enhet: "", namn: "" }, true); });

  /* ---------- analys ---------- */
  function findByte(namn) {
    var low = namn.toLowerCase();
    for (var i = 0; i < BYTEN.length; i++) {
      var b = BYTEN[i];
      for (var j = 0; j < b.traffar.length; j++) { if (low.indexOf(b.traffar[j]) !== -1) return b; }
    }
    return null;
  }
  function tag(text, cls) { var s = document.createElement("span"); s.className = "tag" + (cls ? " " + cls : ""); s.textContent = text; return s; }

  function analyse() {
    /* 1) byt ut */
    elByten.innerHTML = "";
    var foundAny = false;
    nonEmptyRows().forEach(function (row) {
      if (row._swapped) return;
      var nm = row.namn.trim();
      var b = findByte(nm);
      if (!b) return;
      // hoppa över om raden redan ÄR det föreslagna bytet (t.ex. "fullkornspasta")
      if (nm.toLowerCase().indexOf(b.byt_namn.toLowerCase()) !== -1) return;
      foundAny = true;
      var card = document.createElement("div"); card.className = "swap-card";
      var head = document.createElement("p"); head.className = "swap-head";
      var from = document.createElement("span"); from.className = "swap-from"; from.textContent = row.namn.trim();
      var arr = document.createElement("span"); arr.className = "swap-arrow"; arr.textContent = " → ";
      var to = document.createElement("span"); to.className = "swap-to"; to.textContent = b.byt_namn;
      head.appendChild(from); head.appendChild(arr); head.appendChild(to);
      var why = document.createElement("p"); why.className = "swap-why"; why.textContent = b.varfor;
      var btn = document.createElement("button"); btn.type = "button"; btn.className = "btn btn-secondary"; btn.textContent = "Byt ut";
      btn.addEventListener("click", function () {
        row.namn = b.byt_namn; row._swapped = true;
        if (!b.behall) { row.mangd = null; row.enhet = ""; }
        if (row._namnInput) row._namnInput.value = row.namn;
        if (row._mangdInput) row._mangdInput.value = (row.mangd != null ? row.mangd : "");
        if (row._enhetSel) row._enhetSel.value = row.enhet || "";
        analyse();
      });
      card.appendChild(head); card.appendChild(why); card.appendChild(btn);
      elByten.appendChild(card);
    });
    if (!foundAny) elByten.innerHTML = '<p class="help">Inga uppenbara "byt ut"-förslag utifrån det du skrivit – bra! Kolla gärna tilläggen nedan ändå.</p>';

    /* 2) lägg till */
    elLaggTill.innerHTML = "";
    var have = nonEmptyRows().map(function (r) { return r.namn.toLowerCase(); });
    TIPS.forEach(function (t) {
      var firstWord = t.namn.toLowerCase().split(/[ /]/)[0];
      if (have.some(function (h) { return h.indexOf(firstWord) !== -1; })) return;
      var li = document.createElement("div"); li.className = "tip-row";
      var btn = document.createElement("button"); btn.type = "button"; btn.className = "btn btn-ghost"; btn.textContent = "+ " + t.namn;
      btn.addEventListener("click", function () { addRow({ mangd: (t.mangd != null ? t.mangd : null), enhet: t.enhet || "", namn: t.namn }); });
      var txt = document.createElement("span"); txt.className = "tip-txt"; txt.textContent = t.text;
      li.appendChild(btn); li.appendChild(txt);
      elLaggTill.appendChild(li);
    });
    if (!elLaggTill.children.length) elLaggTill.innerHTML = '<p class="help">Du verkar redan ha med det mesta – snyggt!</p>';

    /* 3) tillagningstips */
    elKok.innerHTML = "";
    var ul = document.createElement("ul");
    KOKTIPS.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ul.appendChild(li); });
    elKok.appendChild(ul);

    /* 4) liknande recept */
    renderLiknande();

    /* 5) förhandsvisning av det förbättrade receptet */
    renderPreview();

    elResultat.classList.remove("hidden");
    elSparad.classList.add("hidden");
  }
  function refreshIfShown() { if (!elResultat.classList.contains("hidden")) analyse(); }

  function renderLiknande() {
    elLiknande.innerHTML = "";
    var mine = checkedMaltider();
    var pool = (window.RECEPT || []).filter(function (r) {
      return mine.length === 0 ? true : (r.maltid || []).some(function (m) { return mine.indexOf(m) !== -1; });
    });
    var myWords = (elNamn.value || "").toLowerCase().split(/\W+/).filter(function (w) { return w.length > 3; });
    pool = pool.map(function (r) {
      var s = Math.random(); var rn = r.namn.toLowerCase();
      myWords.forEach(function (w) { if (rn.indexOf(w) !== -1) s += 3; });
      return { r: r, s: s };
    }).sort(function (a, b) { return b.s - a.s; }).slice(0, 3);
    if (!pool.length) { elLiknande.innerHTML = '<p class="help">—</p>'; return; }
    var grid = document.createElement("div"); grid.className = "card-grid";
    pool.forEach(function (it) {
      var r = it.r;
      var c = document.createElement("article"); c.className = "card";
      var h = document.createElement("h3"); h.textContent = r.namn; c.appendChild(h);
      var meta = document.createElement("div"); meta.className = "meta";
      (r.maltid || []).forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
      if (r.tid) meta.appendChild(tag("≈ " + r.tid + " min", "time"));
      c.appendChild(meta);
      var d = document.createElement("p"); d.className = "desc"; d.textContent = r.beskrivning; c.appendChild(d);
      var a = document.createElement("a"); a.href = "recept.html"; a.className = "btn btn-ghost"; a.textContent = "Se i receptlistan"; c.appendChild(a);
      grid.appendChild(c);
    });
    elLiknande.appendChild(grid);
  }

  /* ---------- bygg recept-objekt ---------- */
  var GODA = ["spenat","broccoli","tomat","lok","vitlok","avokado","bar","citron","lax","valnotter","mandel","chiafron","linfro","olivolja","ingefara","gurkmeja","kanel","havregryn","quinoa","linser","kikartor","naturell yoghurt","morot","rodbeta","banan","apple","fullkorn"];
  function detectPlus(ingr) {
    var res = [];
    ingr.forEach(function (it) {
      if (GODA.indexOf(it.id) !== -1) { var l = window.ravaraLabel(it.id); if (res.indexOf(l) === -1) res.push(l); return; }
      var nm = (it.namn || "").toLowerCase();
      var kw = { "bovet":"bovetemjöl","linser":"linser","bön":"bönor","kikärt":"kikärtor","fullkorn":"fullkorn","grönkål":"grönkål","spenat":"spenat","bär":"bär","oliv":"olivolja","gurkmeja":"gurkmeja","ingefära":"ingefära","valnöt":"valnötter","mandel":"mandel","frö":"frön","quinoa":"quinoa","lax":"lax","havre":"havre" };
      Object.keys(kw).forEach(function (k) { if (nm.indexOf(k) !== -1 && res.indexOf(kw[k]) === -1) res.push(kw[k]); });
    });
    return res.slice(0, 6);
  }
  function detectAllergener(ingr) {
    var txt = ingr.map(function (it) { return (it.namn || window.ravaraLabel(it.id)).toLowerCase() + " " + it.id; }).join(" | ");
    var res = [];
    function any(words) { return words.some(function (w) { return txt.indexOf(w) !== -1; }); }
    if (any(["vetemjöl","mjöl","pasta","bröd","brod","korn","råg","rag","couscous","bulgur","ströbröd","strobrod","gluten","fullkorn"])) res.push("gluten");
    if (any(["ägg","agg"])) res.push("agg");
    if (any(["fisk","lax","torsk","räk","rak","sill","makrill","tonfisk","skaldjur","sardin"])) res.push("fisk");
    if (any(["mjölk","mjolk","grädde","gradde","ost","yoghurt","smör","smor","crème fraiche","creme fraiche","kvarg","fil","mejeri"])) res.push("mjolk");
    if (any(["nöt","mandel","cashew","valnöt","valnot","hasselnöt","hasselnot","pekan","pistage","jordnöt","jordnot"])) res.push("notter");
    if (any(["soja","tofu","edamame"])) res.push("soja");
    return res.filter(function (v, i, a) { return a.indexOf(v) === i; });
  }
  function capitalize(s) { s = String(s).trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function buildRecipeObject() {
    var ingr = nonEmptyRows().map(function (row) {
      var nm = row.namn.trim();
      var rid = window.matchRavara(nm);
      var amount = (row.mangd != null && !isNaN(row.mangd)) ? row.mangd : null;
      if (rid) return { id: rid, mangd: amount, enhet: row.enhet || "" };
      return { id: nm.toLowerCase(), mangd: amount, enhet: row.enhet || "", namn: capitalize(nm) };
    });
    var maltid = checkedMaltider(); if (!maltid.length) maltid = ["middag"];
    var tid = elTid.value ? parseInt(elTid.value, 10) : null;
    var steg = (elSteg.value || "").split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    return {
      id: editId || window.MyRecipes.newId(),
      namn: (elNamn.value || "").trim() || "Mitt recept",
      maltid: maltid,
      tid: (tid && tid > 0) ? tid : null,
      portioner: stepper.getValue(),
      ingredienser: ingr,
      mood: [],
      allergener: detectAllergener(ingr),
      plus: detectPlus(ingr),
      beskrivning: editId ? "Eget recept (redigerat)." : "Eget recept.",
      steg: steg,
      egen: true
    };
  }

  function renderPreview() {
    var r = buildRecipeObject();
    elPreview.innerHTML = "";
    var h = document.createElement("h3"); h.textContent = r.namn; elPreview.appendChild(h);
    var meta = document.createElement("div"); meta.className = "meta";
    r.maltid.forEach(function (m) { meta.appendChild(tag(window.labelFor(window.MALTIDER, m), "meal")); });
    if (r.tid) meta.appendChild(tag("≈ " + r.tid + " min", "time"));
    (r.plus || []).forEach(function (p) { meta.appendChild(tag("✓ " + p, "plus")); });
    (r.allergener || []).forEach(function (a) { meta.appendChild(tag("innehåller " + window.labelFor(window.ALLERGENER, a).toLowerCase(), "warn")); });
    elPreview.appendChild(meta);
    var head = document.createElement("div"); head.className = "ingr-head";
    var strong = document.createElement("strong"); strong.textContent = "Ingredienser (" + r.portioner + (r.portioner === 1 ? " portion" : " portioner") + ")";
    head.appendChild(strong); elPreview.appendChild(head);
    if (r.ingredienser.length) elPreview.appendChild(window.renderIngredientList(r, r.portioner));
    else { var p = document.createElement("p"); p.className = "help"; p.textContent = "Inga ingredienser ännu."; elPreview.appendChild(p); }
    if (r.steg && r.steg.length) {
      var st = document.createElement("strong"); st.className = "block-title"; st.textContent = "Så här gör du"; elPreview.appendChild(st);
      var ol = document.createElement("ol"); ol.className = "steps";
      r.steg.forEach(function (s) { var li = document.createElement("li"); li.textContent = s; ol.appendChild(li); });
      elPreview.appendChild(ol);
    }
  }

  /* ---------- spara ---------- */
  function saveRecipe() {
    if (!nonEmptyRows().length) { alert("Lägg till minst en ingrediens först."); return null; }
    var r = buildRecipeObject();
    window.MyRecipes.add(r);
    editId = r.id; // fortsatt sparande uppdaterar samma recept
    return r;
  }
  function showSaved(r) {
    elSparad.innerHTML = "";
    var h = document.createElement("h3"); h.textContent = "✓ Sparat: " + r.namn; elSparad.appendChild(h);
    var p = document.createElement("p");
    p.textContent = "Receptet finns nu under Recept (märkt “Eget recept”). Du kan filtrera fram det, ändra antal portioner och lägga det i inköpslistan.";
    elSparad.appendChild(p);
    var row = document.createElement("div"); row.className = "btn-row";
    var a1 = document.createElement("a"); a1.href = "recept.html"; a1.className = "btn btn-primary"; a1.textContent = "Visa i receptlistan"; row.appendChild(a1);
    var b2 = document.createElement("button"); b2.type = "button"; b2.className = "btn btn-secondary"; b2.textContent = "Lägg i inköpslistan";
    b2.addEventListener("click", function () { window.Cart.add(r.id, r.portioner); b2.textContent = "✓ Tillagd"; b2.disabled = true; });
    row.appendChild(b2);
    var a3 = document.createElement("a"); a3.href = "inkopslista.html"; a3.className = "btn btn-ghost"; a3.textContent = "Till inköpslistan"; row.appendChild(a3);
    elSparad.appendChild(row);
    elSparad.classList.remove("hidden");
    elSparad.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  elAnalysera.addEventListener("click", function () {
    if (!nonEmptyRows().length) { alert("Skriv in minst en ingrediens i din rätt först."); return; }
    analyse();
    elResultat.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  elSpara.addEventListener("click", function () { var r = saveRecipe(); if (r) showSaved(r); });
  elSparaInk.addEventListener("click", function () {
    var r = saveRecipe(); if (!r) return;
    window.Cart.add(r.id, r.portioner);
    window.location.href = "inkopslista.html";
  });

  /* ---------- skicka in (mailto + kopierbar text) ---------- */
  function composeMail() {
    var r = buildRecipeObject();
    var L = [];
    L.push("Hej! Här är ett recept jag gärna vill ha en antiinflammatorisk omskrivning på:");
    L.push("");
    L.push("Rätt: " + r.namn);
    L.push("Måltid: " + r.maltid.map(function (m) { return window.labelFor(window.MALTIDER, m); }).join(", "));
    L.push("Portioner: " + r.portioner);
    L.push("");
    L.push("Ingredienser:");
    r.ingredienser.forEach(function (it) {
      var amt = window.formatAmount(it.mangd, it.enhet);
      L.push("- " + (amt ? amt + " " : "") + window.ingrLabel(it));
    });
    if (r.steg && r.steg.length) { L.push(""); L.push("Så här gör jag:"); r.steg.forEach(function (s, i) { L.push((i + 1) + ". " + s); }); }
    L.push(""); L.push("Tack!");
    return { recept: r, text: L.join("\n") };
  }
  var elSkickaText = document.getElementById("fb-skicka-text");
  document.getElementById("fb-skicka").addEventListener("click", function () {
    var m = composeMail();
    elSkickaText.value = m.text;
    /* OBS: byt e-postadressen nedan om du vill ha inskicken till en annan adress
       (eller ersätt med ett formulär, t.ex. Formspree). */
    window.location.href = "mailto:linda.hellborg@gmail.com?subject=" +
      encodeURIComponent("Receptförslag: " + m.recept.namn) + "&body=" + encodeURIComponent(m.text);
  });
  document.getElementById("fb-kopiera").addEventListener("click", function () {
    if (!elSkickaText.value) elSkickaText.value = composeMail().text;
    elSkickaText.select();
    try { document.execCommand("copy"); } catch (e) {}
    var b = document.getElementById("fb-kopiera"); b.textContent = "✓ Kopierat"; setTimeout(function () { b.textContent = "Kopiera texten"; }, 2000);
  });

  /* ---------- init / redigeringsläge ---------- */
  (function init() {
    var params = new URLSearchParams(location.search);
    var ed = params.get("edit");
    var r = ed ? window.MyRecipes.get(ed) : null;
    if (r) {
      editId = r.id;
      elNamn.value = r.namn || "";
      setMaltider(r.maltid || []);
      stepper.setValue(r.portioner || 4);
      if (r.tid) elTid.value = r.tid;
      (r.ingredienser || []).forEach(function (it) {
        var row = { mangd: (it.mangd != null ? it.mangd : null), enhet: it.enhet || "", namn: window.ingrLabel(it), _swapped: true };
        rows.push(row); elRows.appendChild(makeRowEl(row));
      });
      if (!rows.length) seedEmpty(2);
      if (r.steg && r.steg.length) elSteg.value = r.steg.join("\n");
      var note = document.getElementById("fb-edit-note"); if (note) note.classList.remove("hidden");
      analyse();
    } else {
      seedEmpty(3);
    }
  })();
})();
