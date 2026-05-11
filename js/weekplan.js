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
  var KEY = "aik_veckomeny_v1";
  function read() {
    try { var o = JSON.parse(localStorage.getItem(KEY) || "null"); return (o && typeof o === "object" && o.slots) ? o : null; }
    catch (e) { return null; }
  }
  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("weekplan:changed", { detail: o }));
  }
  return {
    get: read,
    set: write,
    clear: function () { try { localStorage.removeItem(KEY); } catch (e) {} document.dispatchEvent(new CustomEvent("weekplan:changed", { detail: null })); }
  };
})();
