/* ============================================================
   Lokala profiler – flera personer i samma webbläsare med varsin
   privat data (kundvagn, veckomeny, har-hemma, egna recept,
   festmeny). Recepten i data/recept.js är samma för alla.

   Nyckelmodell:
     aik_profiles_v1                 -> { active, list:[{id,namn,farg,pin?}] }
     aik:<profileId>:<suffix>        -> per-profil-data (Cart, WeekPlan, ...)

   Stores använder window.nsKey(suffix) i stället för en hårdkodad
   nyckel, så samma kod kör mot olika "lådor" beroende på vilken
   profil som är aktiv.

   PIN är "lås av misstag" – inte säkerhet. Vem som helst med
   utvecklarverktyg kan kringgå den. Vill man ha riktigt privat
   data: använd olika webbläsarprofiler eller olika enheter.
   ============================================================ */

window.Profiles = (function () {
  var META_KEY = "aik_profiles_v1";

  function readMeta() {
    try { var o = JSON.parse(localStorage.getItem(META_KEY) || "null"); return (o && o.list && o.list.length) ? o : null; }
    catch (e) { return null; }
  }
  function writeMeta(m) {
    try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {}
    if (typeof document !== "undefined" && document.dispatchEvent) {
      document.dispatchEvent(new CustomEvent("profile:changed", { detail: m }));
    }
  }
  function newId() { return "p_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  // Nyckelnamn (utan profil-prefix) som ska migreras från äldre versioner av sajten.
  var LEGACY_KEYS = [
    "aik_inkopslista_v2",
    "aik_egna_recept_v1",
    "aik_veckomeny_v1",
    "aik_har_hemma_v1",
    "aik_festmeny_v1"
  ];

  function migrateLegacyTo(profileId) {
    LEGACY_KEYS.forEach(function (k) {
      var v = localStorage.getItem(k);
      if (v != null) {
        localStorage.setItem("aik:" + profileId + ":" + k, v);
        localStorage.removeItem(k);
      }
    });
  }

  function ensureInit() {
    var m = readMeta();
    if (m) return m;
    var id = newId();
    var prof = { id: id, namn: "Min profil", farg: "terracotta" };
    m = { active: id, list: [prof] };
    migrateLegacyTo(id);
    writeMeta(m);
    return m;
  }

  // Kör en gång vid module load så migration sker innan stores läser keys.
  ensureInit();

  function meta() { return readMeta() || ensureInit(); }
  function findProfile(id) { return meta().list.filter(function (p) { return p.id === id; })[0] || null; }

  // Namespace-helper för stores
  window.nsKey = function (suffix) { return "aik:" + meta().active + ":" + suffix; };

  return {
    list: function () { return meta().list.slice(); },
    active: function () { var m = meta(); return findProfile(m.active) || m.list[0]; },
    activeId: function () { return meta().active; },

    switch: function (id) {
      var m = meta();
      if (!findProfile(id)) return false;
      m.active = id; writeMeta(m); return true;
    },
    add: function (namn, farg) {
      var m = meta();
      var p = { id: newId(), namn: (namn || "").trim() || ("Profil " + (m.list.length + 1)), farg: farg || "olive" };
      m.list.push(p); writeMeta(m); return p;
    },
    rename: function (id, namn) {
      var m = meta();
      for (var i = 0; i < m.list.length; i++) {
        if (m.list[i].id === id) { m.list[i].namn = String(namn || "").trim() || m.list[i].namn; writeMeta(m); return true; }
      }
      return false;
    },
    setColor: function (id, farg) {
      var m = meta();
      for (var i = 0; i < m.list.length; i++) {
        if (m.list[i].id === id) { m.list[i].farg = farg || "olive"; writeMeta(m); return true; }
      }
      return false;
    },
    setPin: function (id, pin) {
      var m = meta();
      for (var i = 0; i < m.list.length; i++) {
        if (m.list[i].id === id) {
          if (pin && String(pin).length) m.list[i].pin = String(pin); else delete m.list[i].pin;
          writeMeta(m); return true;
        }
      }
      return false;
    },
    remove: function (id) {
      var m = meta();
      if (m.list.length <= 1) return false;            // måste finnas minst en
      if (!findProfile(id)) return false;
      m.list = m.list.filter(function (p) { return p.id !== id; });
      if (m.active === id) m.active = m.list[0].id;
      writeMeta(m);
      // ta bort den raderade profilens data
      var prefix = "aik:" + id + ":";
      var toRemove = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) toRemove.push(k);
      }
      toRemove.forEach(function (k) { localStorage.removeItem(k); });
      return true;
    },

    /* ---------- Export / import ---------- */
    exportProfile: function (id) {
      var p = findProfile(id); if (!p) return null;
      var prefix = "aik:" + id + ":";
      var data = {};
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) data[k.slice(prefix.length)] = localStorage.getItem(k);
      }
      return {
        version: 1,
        exported_at: new Date().toISOString(),
        profile: { namn: p.namn, farg: p.farg || "olive" },
        data: data
      };
    },
    importProfile: function (payload, opts) {
      if (!payload || !payload.profile || !payload.data) return null;
      opts = opts || {};
      var m = meta();
      var id, p;
      if (opts.replaceId && findProfile(opts.replaceId)) {
        id = opts.replaceId; p = findProfile(id);
        p.namn = payload.profile.namn || p.namn;
        p.farg = payload.profile.farg || p.farg;
        // töm befintliga keys
        var prefix = "aik:" + id + ":"; var toRemove = [];
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(prefix) === 0) toRemove.push(k);
        }
        toRemove.forEach(function (k) { localStorage.removeItem(k); });
      } else {
        id = newId();
        p = { id: id, namn: payload.profile.namn || "Importerad profil", farg: payload.profile.farg || "olive" };
        m.list.push(p);
      }
      Object.keys(payload.data).forEach(function (suffix) {
        try { localStorage.setItem("aik:" + id + ":" + suffix, payload.data[suffix]); } catch (e) {}
      });
      writeMeta(m);
      return p;
    },

    /* Hjälp för tester / debug: rensa alla profiler och namespace-data */
    __reset: function () {
      var keys = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k === META_KEY || k.indexOf("aik:") === 0)) keys.push(k);
      }
      keys.forEach(function (k) { localStorage.removeItem(k); });
    }
  };
})();
