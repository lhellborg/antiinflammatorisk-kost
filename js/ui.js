/* ============================================================
   Små återanvändbara UI-bitar: portionsväljare och ingredienslista.
   Kräver labels.js (scaleAmount, formatAmount, ravaraLabel).
   ============================================================ */

// Portionsväljare: − [ N portioner ] +
// onChange(nyttAntal) anropas vid ändring. Returnerar elementet, som
// dessutom har .getValue() och .setValue(n).
window.makeStepper = function (value, min, onChange) {
  min = min || 1;
  var cur = Math.max(min, Math.round(value || 1));

  var wrap = document.createElement("div"); wrap.className = "stepper";
  var minus = document.createElement("button");
  minus.type = "button"; minus.className = "step-btn"; minus.textContent = "−";
  minus.setAttribute("aria-label", "Färre portioner");
  var out = document.createElement("span"); out.className = "step-val";
  var plus = document.createElement("button");
  plus.type = "button"; plus.className = "step-btn"; plus.textContent = "+";
  plus.setAttribute("aria-label", "Fler portioner");

  function paint() { out.textContent = cur + (cur === 1 ? " portion" : " portioner"); }
  function set(v, silent) {
    v = Math.max(min, Math.round(v));
    if (v === cur) return;
    cur = v; paint();
    if (!silent && onChange) onChange(cur);
  }
  minus.addEventListener("click", function () { set(cur - 1); });
  plus.addEventListener("click", function () { set(cur + 1); });

  paint();
  wrap.appendChild(minus); wrap.appendChild(out); wrap.appendChild(plus);
  wrap.getValue = function () { return cur; };
  wrap.setValue = function (v) { set(v, true); };
  return wrap;
};

// <ul> med "1 dl havregryn", skalat till angivet antal portioner.
// haveSet (valfri) = lista med råvaru-id besökaren redan har hemma; de
// markeras då med en bock.
window.renderIngredientList = function (recipe, portioner, haveSet) {
  var have = haveSet ? (Array.isArray(haveSet) ? haveSet : []) : [];
  var ul = document.createElement("ul"); ul.className = "ingr-list";
  (recipe.ingredienser || []).forEach(function (it) {
    var li = document.createElement("li");
    var amt = window.scaleAmount(it.mangd, recipe.portioner, portioner);
    var amtStr = window.formatAmount(amt, it.enhet);
    if (amtStr) {
      var s = document.createElement("span"); s.className = "ingr-amt"; s.textContent = amtStr;
      li.appendChild(s); li.appendChild(document.createTextNode(" "));
    }
    li.appendChild(document.createTextNode(window.ingrLabel(it)));
    if (have.indexOf(it.id) !== -1) {
      li.classList.add("have");
      var b = document.createElement("span"); b.className = "have-mark"; b.textContent = " ✓ har hemma";
      li.appendChild(b);
    }
    ul.appendChild(li);
  });
  return ul;
};

// Råvaru-id:n i ett recept (oavsett mängdformat).
window.ingredientIds = function (recipe) {
  return (recipe.ingredienser || []).map(function (it) { return it.id; });
};
