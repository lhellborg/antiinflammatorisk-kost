/* ============================================================
   Veckomeny – lagras i webbläsaren (localStorage). En aktuell
   veckomeny i taget. Lyssna på "weekplan:changed" på document.

   Sparas som:
   {
     meals:    ["lunch","middag"],   // vilka måltider som planeras
     personer: 4,
     exclude:  [],                    // allergener att utesluta
     vardagsmax: 30,                  // minuter (0 = ingen gräns) för vardagsmiddagar
     rester:   true,                  // planera in storkok/rester
     haveFoods:[],                    // råvaru-id "har hemma" (för viktning)
     slots: {                         // nyckel: "<dagindex 0..6>-<måltid>"
       "0-middag": { recipeId: "...", pinned: false, leftoverFrom: null },
       "1-lunch":  { recipeId: "...", pinned: false, leftoverFrom: "0-middag" },
       ...
     }
   }
   ============================================================ */

window.VECKODAGAR = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];

window.WeekPlan = (function () {
  function KEY() { return window.nsKey ? window.nsKey("aik_veckomeny_v1") : "aik_veckomeny_v1"; }
  function read() {
    try { var o = JSON.parse(localStorage.getItem(KEY()) || "null"); return (o && typeof o === "object" && o.slots) ? o : null; }
    catch (e) { return null; }
  }
  function write(o) {
    try { localStorage.setItem(KEY(), JSON.stringify(o)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("weekplan:changed", { detail: o }));
  }
  // Uppdaterar en slots recept till newId. Om slotten är en rester-ruta
  // (eller har rester-rutor som pekar på sig) följer alla relaterade rutor
  // med – samma recept tillagas ju en gång och äts på flera ställen.
  // Om slotten inte finns ännu (tom ruta) skapas den.
  function setSlotRecipeFromEdit(slotKey, newId) {
    var p = read(); if (!p || !p.slots) return;
    var sl = p.slots[slotKey];
    if (!sl) {
      // ruta saknades – skapa den från grunden
      p.slots[slotKey] = { recipeId: newId, pinned: false, leftoverFrom: null };
      write(p); return;
    }
    var anchor = sl.leftoverFrom || slotKey;
    if (!p.slots[anchor]) anchor = slotKey;
    Object.keys(p.slots).forEach(function (k) {
      var s = p.slots[k];
      if (s && (k === anchor || s.leftoverFrom === anchor)) {
        s.recipeId = newId;
        delete s.freeText; // skriver vi över med ett riktigt recept får fritexten gå
      }
    });
    write(p);
  }

  return {
    get: read,
    set: write,
    setSlotRecipeFromEdit: setSlotRecipeFromEdit,
    clear: function () { try { localStorage.removeItem(KEY()); } catch (e) {} document.dispatchEvent(new CustomEvent("weekplan:changed", { detail: null })); }
  };
})();
