/* ============================================================
   "Förbättra ett recept" – mata in din rätt, få byten/tillägg
   utifrån antiinflammatorisk kost, och spara resultatet som ett
   eget recept (som dyker upp i receptlistan och inköpslistan).
   ============================================================ */

(function () {
  var BYTEN    = window.BYTEN || [];
  var TIPS     = window.LAGG_TILL_TIPS || [];
  var KOKTIPS  = window.TILLAGNINGSTIPS || [];
  var CHIPS    = window.MINDRE_BRA_CHIPS || [];
  var LIKNANDE = window.LIKNANDE || [];

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
  var elMycketBlk = document.getElementById("fb-mycket-block");
  var elMycket    = document.getElementById("fb-mycket");
  var elLaggTill  = document.getElementById("fb-lagg-till");
  var elKok       = document.getElementById("fb-tillagning");
  var elLiknande  = document.getElementById("fb-liknande");
  var elPreview   = document.getElementById("fb-preview");
  var elSpara     = document.getElementById("fb-spara");
  var elSparaInk  = document.getElementById("fb-spara-inkop");
  var elSparad    = document.getElementById("fb-sparad");
  if (!elRows) return;

  var rows = [];          // [{mangd:Number|null, enhet, namn, _wrap, _namnInput, _mangdInput, _enhetSel, _swapped}]
  var editId = null;      // sätts om vi redigerar ett befintligt eget recept
  var baseradPa = null;   // recept-id om detta är en "egen version av" ett annat recept
  var weekSlot = null;    // <dagindex>-<måltid> om vi kom hit från en veckomeny-ruta
  var fromName = null;    // originalreceptets namn (för beskrivningstexten)
  var baseMood = [];      // mood-taggar som ärvs från originalet

  // portionsväljare – när antalet ändras skalas mängderna i raderna proportionellt
  var lastPortioner = 4;
  var stepper = window.makeStepper(4, 1, function (n) {
    rescaleRows(lastPortioner, n);
    lastPortioner = n;
    refreshIfShown();
  });
  elPortHold.appendChild(stepper);
  function rescaleRows(from, to) {
    if (!from || !to || from === to) return;
    var f = to / from;
    rows.forEach(function (row) {
      if (row.mangd != null && !isNaN(row.mangd)) {
        row.mangd = Math.round(row.mangd * f * 100) / 100;
        if (row._mangdInput) row._mangdInput.value = row.mangd;
      }
    });
  }

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
  function findLiknande(namn) {
    var low = namn.toLowerCase();
    for (var i = 0; i < LIKNANDE.length; i++) {
      var L = LIKNANDE[i];
      for (var j = 0; j < L.traffar.length; j++) { if (low.indexOf(L.traffar[j]) !== -1) return L; }
    }
    return null;
  }
  function capitalize(s) { s = String(s).trim(); return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  function makeRowEl(row) {
    var wrap = document.createElement("div"); wrap.className = "ingr-row-wrap";
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

    var split = document.createElement("button");
    split.type = "button"; split.className = "in-split"; split.textContent = "byt ut en del"; split.title = "Byt ut en del av den här ingrediensen";

    var rm = document.createElement("button");
    rm.type = "button"; rm.className = "in-rm"; rm.textContent = "×"; rm.title = "Ta bort raden";
    rm.addEventListener("click", function () {
      var i = rows.indexOf(row); if (i !== -1) { rows.splice(i, 1); wrap.remove(); refreshIfShown(); }
    });

    div.appendChild(mangd); div.appendChild(enhet); div.appendChild(namn); div.appendChild(split); div.appendChild(rm);
    wrap.appendChild(div);

    /* --- panel för "byt ut en del" --- */
    var panel = document.createElement("div"); panel.className = "split-panel hidden"; wrap.appendChild(panel);
    split.addEventListener("click", function () {
      if (!panel.classList.contains("hidden")) { panel.classList.add("hidden"); return; }
      buildSplitPanel();
      panel.classList.remove("hidden");
    });
    function buildSplitPanel() {
      panel.innerHTML = "";
      var nm = (row.namn || "").trim() || "ingrediensen";
      var Y = (row.mangd != null && !isNaN(row.mangd)) ? row.mangd : null;

      var head = document.createElement("p"); head.className = "help";
      head.innerHTML = "Byt ut en del av <strong>" + esc(nm) + "</strong>:";
      panel.appendChild(head);

      var keepVal = null, slider = null, keepOut = null;
      if (Y != null && Y > 0) {
        var step = (Y >= 200) ? 25 : (Y >= 20 ? 5 : 0.25);
        keepVal = Math.round((Y / 2) / step) * step;
        var lbl = document.createElement("label"); lbl.className = "split-keep-row";
        lbl.appendChild(document.createTextNode("Behåll "));
        slider = document.createElement("input"); slider.type = "range"; slider.min = "0"; slider.max = String(Y); slider.step = String(step); slider.value = String(keepVal);
        keepOut = document.createElement("span"); keepOut.className = "split-keep";
        function paintKeep() { keepVal = parseFloat(slider.value); keepOut.textContent = window.niceNumber(keepVal) + (row.enhet ? " " + row.enhet : "") + " av " + window.niceNumber(Y) + (row.enhet ? " " + row.enhet : ""); }
        slider.addEventListener("input", paintKeep);
        lbl.appendChild(slider); lbl.appendChild(document.createTextNode(" ")); lbl.appendChild(keepOut);
        panel.appendChild(lbl); paintKeep();
      } else {
        var note = document.createElement("p"); note.className = "help"; note.textContent = "Raden saknar mängd – då byts hela ingrediensen ut.";
        panel.appendChild(note);
      }

      var rl = document.createElement("p"); rl.style.margin = ".6rem 0 .2rem"; rl.textContent = "Ersätt resten med:"; panel.appendChild(rl);
      var repInput = document.createElement("input"); repInput.type = "text"; repInput.className = "split-namn"; repInput.placeholder = "…skriv en ingrediens";
      var why = document.createElement("p"); why.className = "split-why help hidden";

      var lik = findLiknande(nm);
      if (lik) {
        var chips = document.createElement("div"); chips.className = "chips";
        lik.alternativ.forEach(function (alt) {
          var b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.textContent = alt.namn;
          b.addEventListener("click", function () {
            repInput.value = capitalize(alt.namn);
            why.textContent = alt.varfor; why.classList.remove("hidden");
            chips.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("is-checked"); });
            b.classList.add("is-checked");
          });
          chips.appendChild(b);
        });
        panel.appendChild(chips);
      }
      panel.appendChild(repInput);
      panel.appendChild(why);

      var btnRow = document.createElement("div"); btnRow.className = "btn-row";
      var confirm = document.createElement("button"); confirm.type = "button"; confirm.className = "btn btn-secondary"; confirm.textContent = "Dela & byt";
      var cancel = document.createElement("button"); cancel.type = "button"; cancel.className = "btn btn-ghost"; cancel.textContent = "Avbryt";
      cancel.addEventListener("click", function () { panel.classList.add("hidden"); });
      confirm.addEventListener("click", function () {
        var repName = (repInput.value || "").trim();
        if (!repName) { repInput.focus(); return; }
        applySplit(row, (Y != null && Y > 0 ? keepVal : null), repName);
        panel.classList.add("hidden");
      });
      btnRow.appendChild(confirm); btnRow.appendChild(cancel);
      panel.appendChild(btnRow);
    }

    row._wrap = wrap; row._namnInput = namn; row._mangdInput = mangd; row._enhetSel = enhet;
    return wrap;
  }
  function addRow(row, focusIt) {
    rows.push(row); elRows.appendChild(makeRowEl(row));
    refreshIfShown();
    if (focusIt && row._namnInput) row._namnInput.focus();
  }
  function seedEmpty(n) { for (var i = 0; i < (n || 3); i++) { var r = { mangd: null, enhet: "", namn: "" }; rows.push(r); elRows.appendChild(makeRowEl(r)); } }
  function nonEmptyRows() { return rows.filter(function (r) { return r.namn && r.namn.trim(); }); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  elAddRad.addEventListener("click", function () { addRow({ mangd: null, enhet: "", namn: "" }, true); });

  // Dela en rad: behåll keepAmt av ingrediensen, lägg en ny rad med resten som repName.
  // keepAmt == null (eller raden saknar mängd) -> byt hela raden mot repName.
  function applySplit(row, keepAmt, repName) {
    repName = String(repName || "").trim();
    if (!repName) return;
    var Y = (row.mangd != null && !isNaN(row.mangd)) ? row.mangd : null;
    if (Y != null && Y > 0 && keepAmt != null && keepAmt > 0 && keepAmt < Y) {
      var repAmt = Math.round((Y - keepAmt) * 100) / 100;
      row.mangd = Math.round(keepAmt * 100) / 100;
      if (row._mangdInput) row._mangdInput.value = row.mangd;
      var newRow = { mangd: repAmt, enhet: row.enhet || "", namn: capitalize(repName), _swapped: false };
      var idx = rows.indexOf(row);
      rows.splice(idx >= 0 ? idx + 1 : rows.length, 0, newRow);
      var el = makeRowEl(newRow);
      if (row._wrap && row._wrap.after) row._wrap.after(el); else elRows.appendChild(el);
    } else {
      row.namn = capitalize(repName); row._swapped = false;
      if (row._namnInput) row._namnInput.value = row.namn;
    }
    refreshIfShown();
  }

  /* ---------- analys ---------- */
  function findByte(namn) {
    var low = namn.toLowerCase();
    for (var i = 0; i < BYTEN.length; i++) {
      var b = BYTEN[i];
      for (var j = 0; j < b.traffar.length; j++) { if (low.indexOf(b.traffar[j]) !== -1) return b; }
    }
    return null;
  }
  // Editor-rader som är "för mycket" av en stapelvara, givet antal portioner.
  function heavyRows(P) {
    var out = [];
    var STAPLES = window.STAPLE_GRANSER || [];
    nonEmptyRows().forEach(function (row) {
      if (row.mangd == null || isNaN(row.mangd) || row.mangd <= 0) return;
      var nm = String(row.namn || "").toLowerCase();
      for (var i = 0; i < STAPLES.length; i++) {
        var g = STAPLES[i];
        if (!g.traffar.some(function (t) { return nm.indexOf(t) !== -1; })) continue;
        var lim = g.gransPerPortion[row.enhet || ""];
        if (lim == null) break;
        if (row.mangd / P > lim) out.push({ row: row, grans: g, perPortion: row.mangd / P });
        break;
      }
    });
    return out;
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

    /* 1b) "mycket av något?" – stapelvaror som dominerar */
    if (elMycket) {
      elMycket.innerHTML = "";
      var portioner = stepper.getValue() || 1;
      var flaggor = (window.STAPLE_GRANSER || []).length ? heavyRows(portioner) : [];
      if (!flaggor.length) {
        if (elMycketBlk) elMycketBlk.classList.add("hidden");
      } else {
        if (elMycketBlk) elMycketBlk.classList.remove("hidden");
        flaggor.forEach(function (f) {
          var row = f.row, g = f.grans, pp = f.perPortion;
          var card = document.createElement("div"); card.className = "swap-card staple-card";
          var head = document.createElement("p"); head.className = "swap-head";
          head.innerHTML = (g.typ === "baljväxt" ? "🫘 " : "🍚 ") + "Rätten är tung på <strong>" + esc(g.etikett) + "</strong>";
          card.appendChild(head);
          var detail = document.createElement("p"); detail.className = "swap-why";
          var perStr = window.niceNumber(Math.round(pp * 100) / 100) + (row.enhet ? " " + row.enhet : "");
          var amtStr = window.formatAmount(row.mangd, row.enhet);
          detail.textContent = (amtStr ? amtStr + " " : "") + (row.namn || g.etikett) + " – ungefär " + perStr + " per portion. " +
            (g.typ === "baljväxt"
              ? "Många äter redan mycket baljväxter – byt gärna en del mot något i samma familj för variation."
              : "Mycket stärkelse – byt en del mot en fiberrikare variant eller mer grönsaker.");
          card.appendChild(detail);

          var half = Math.round((row.mangd / 2) * 100) / 100;
          var firstAlt = (g.alternativ && g.alternativ[0]) || "kikärtor";
          var btnRow = document.createElement("div"); btnRow.className = "btn-row";
          var bHalf = document.createElement("button"); bHalf.type = "button"; bHalf.className = "btn btn-secondary";
          bHalf.textContent = "Byt ut hälften mot " + firstAlt;
          bHalf.addEventListener("click", function () { applySplit(row, half, firstAlt); });
          var bAll = document.createElement("button"); bAll.type = "button"; bAll.className = "btn btn-ghost";
          bAll.textContent = "Byt ut allt mot " + firstAlt;
          bAll.addEventListener("click", function () { applySplit(row, null, firstAlt); });
          btnRow.appendChild(bHalf); btnRow.appendChild(bAll);
          card.appendChild(btnRow);

          // fler alternativ som chips: byter ut hälften mot det valda
          if (g.alternativ && g.alternativ.length > 1) {
            var altP = document.createElement("p"); altP.className = "help"; altP.style.margin = ".5rem 0 .2rem"; altP.textContent = "…eller byt ut hälften mot:";
            card.appendChild(altP);
            var chips = document.createElement("div"); chips.className = "chips";
            g.alternativ.slice(1).forEach(function (alt) {
              var c = document.createElement("button"); c.type = "button"; c.className = "chip"; c.textContent = alt;
              c.addEventListener("click", function () { applySplit(row, half, alt); });
              chips.appendChild(c);
            });
            card.appendChild(chips);
          }
          elMycket.appendChild(card);
        });
      }
    }

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
    var beskr = baseradPa ? ("Egen version av «" + (fromName || "ett recept") + "».")
              : (editId ? "Eget recept (redigerat)." : "Eget recept.");
    var r = {
      id: editId || window.MyRecipes.newId(),
      namn: (elNamn.value || "").trim() || "Mitt recept",
      maltid: maltid,
      tid: (tid && tid > 0) ? tid : null,
      portioner: stepper.getValue(),
      ingredienser: ingr,
      mood: (baseMood || []).slice(),
      allergener: detectAllergener(ingr),
      plus: detectPlus(ingr),
      beskrivning: beskr,
      steg: steg,
      egen: true
    };
    if (baseradPa) r.baseradPa = baseradPa;
    return r;
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
    if (weekSlot && window.WeekPlan && window.WeekPlan.setSlotRecipeFromEdit) {
      window.WeekPlan.setSlotRecipeFromEdit(weekSlot, r.id);
    }
    return r;
  }
  function showSaved(r) {
    elSparad.innerHTML = "";
    var h = document.createElement("h3"); h.textContent = "✓ Sparat: " + r.namn; elSparad.appendChild(h);
    var p = document.createElement("p");
    p.textContent = weekSlot
      ? "Receptet finns nu under Recept (märkt “Eget recept”), och rutan i veckomenyn pekar nu på det här receptet i stället."
      : "Receptet finns nu under Recept (märkt “Eget recept”). Du kan filtrera fram det, ändra antal portioner och lägga det i inköpslistan.";
    elSparad.appendChild(p);
    var row = document.createElement("div"); row.className = "btn-row";
    var a1 = document.createElement("a"); a1.href = "recept.html"; a1.className = "btn btn-primary"; a1.textContent = "Visa i receptlistan"; row.appendChild(a1);
    if (weekSlot) {
      var avm = document.createElement("a"); avm.href = "veckomeny.html"; avm.className = "btn btn-secondary"; avm.textContent = "Tillbaka till veckomenyn";
      row.appendChild(avm);
    }
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

  /* ---------- init / redigerings- och versionsläge ---------- */
  function loadIngredientRows(list) {
    (list || []).forEach(function (it) {
      var row = { mangd: (it.mangd != null ? it.mangd : null), enhet: it.enhet || "", namn: window.ingrLabel(it), _swapped: false };
      rows.push(row); elRows.appendChild(makeRowEl(row));
    });
  }
  (function init() {
    var params = new URLSearchParams(location.search);
    var ed = params.get("edit");
    var fromId = params.get("from");
    var r = ed ? window.MyRecipes.get(ed) : null;

    if (r) {
      // redigera ett befintligt eget recept
      editId = r.id;
      baseradPa = r.baseradPa || null;
      baseMood = (r.mood || []).slice();
      if (baseradPa) { var bf = window.recipeById(baseradPa); fromName = bf ? bf.namn : null; }
      elNamn.value = r.namn || "";
      setMaltider(r.maltid || []);
      stepper.setValue(r.portioner || 4);
      if (r.tid) elTid.value = r.tid;
      loadIngredientRows(r.ingredienser);
      if (!rows.length) seedEmpty(2);
      if (r.steg && r.steg.length) elSteg.value = r.steg.join("\n");
      var en = document.getElementById("fb-edit-note"); if (en) en.classList.remove("hidden");
      analyse();
    } else if (fromId && window.recipeById(fromId)) {
      // gör en EGEN VERSION av ett befintligt recept (originalet rörs inte)
      var base = window.recipeById(fromId);
      editId = null;
      baseradPa = base.id;
      fromName = base.namn;
      baseMood = (base.mood || []).slice();
      elNamn.value = "Min version av " + base.namn;
      setMaltider(base.maltid || []);
      stepper.setValue(base.portioner || 4);
      if (base.tid) elTid.value = base.tid;
      loadIngredientRows(base.ingredienser);
      if (!rows.length) seedEmpty(2);
      if (base.steg && base.steg.length) elSteg.value = base.steg.join("\n");
      var fn = document.getElementById("fb-from-note");
      if (fn) {
        fn.innerHTML = "Du gör en egen version av <strong>«" + esc(base.namn) + "»</strong> – originalreceptet ändras inte. Använd <em>byt ut en del</em> på en rad för att t.ex. byta hälften av en ingrediens mot något annat.";
        fn.classList.remove("hidden");
      }
      analyse();
    } else {
      seedEmpty(3);
    }
    lastPortioner = stepper.getValue();

    // slot-kontext: rätten kom från en ruta i veckomenyn
    var slotParam = params.get("slot");
    if (slotParam && /^\d+-\w+$/.test(slotParam)) {
      weekSlot = slotParam;
      var parts = slotParam.split("-");
      var di = parseInt(parts[0], 10), me = parts[1];
      var DAGAR = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
      var mealLabel = window.labelFor(window.MALTIDER, me);
      var note = document.getElementById("fb-slot-note");
      if (note) {
        note.innerHTML = "🗓️ <strong>Du redigerar en rätt från veckomenyn</strong> – " + (DAGAR[di] || "?") + ", " + mealLabel.toLowerCase() + ". När du sparar uppdateras både dina recept och rutan i veckomenyn.";
        note.classList.remove("hidden");
      }
    }
  })();
})();
