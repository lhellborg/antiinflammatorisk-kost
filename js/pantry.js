/* ============================================================
   "Vad har du hemma?" – råvaror besökaren säger sig ha hemma.
   Lagras i webbläsaren (localStorage). Delas av veckomenyn (som
   viktar förslagen mot det) och inköpslistan (som visar hur
   mycket av det som faktiskt behövs). Lyssna på "pantry:changed".
   ============================================================ */

window.Pantry = (function () {
  var KEY = "aik_har_hemma_v1";
  function read() {
    try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function write(a) {
    try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("pantry:changed", { detail: { ids: a.slice() } }));
  }
  return {
    list:  read,
    has:   function (id) { return read().indexOf(id) !== -1; },
    set:   function (ids) { write((ids || []).slice()); },
    toggle:function (id) { var a = read(), i = a.indexOf(id); if (i === -1) a.push(id); else a.splice(i, 1); write(a); return a.indexOf(id) !== -1; },
    clear: function () { write([]); }
  };
})();
