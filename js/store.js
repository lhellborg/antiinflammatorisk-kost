/* ============================================================
   Inköpslistan – enkel lagring i webbläsaren (localStorage).
   Sparar vilka recept besökaren markerat OCH för hur många
   portioner. Delas av alla sidor. Lyssna på "cart:changed" på
   document för att reagera när listan ändras.

   Lagras som [{ id: "recept-id", portioner: 2 }, ...]
   ============================================================ */

window.Cart = (function () {
  function KEY() { return window.nsKey ? window.nsKey("aik_inkopslista_v2") : "aik_inkopslista_v2"; }

  function read() {
    try {
      var raw = localStorage.getItem(KEY());
      var arr = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(arr)) return [];
      // tål gammalt format (bara strängar) – tolka som okänt antal portioner
      return arr.map(function (x) {
        if (typeof x === "string") return { id: x, portioner: null };
        return { id: x.id, portioner: (typeof x.portioner === "number" && x.portioner > 0) ? x.portioner : null };
      }).filter(function (x) { return x.id; });
    } catch (e) { return []; }
  }

  function write(arr) {
    try { localStorage.setItem(KEY(), JSON.stringify(arr)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: { items: arr.slice() } }));
  }

  function find(arr, id) {
    for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return i;
    return -1;
  }

  return {
    list:  function () { return read(); },
    count: function () { return read().length; },
    has:   function (id) { return find(read(), id) !== -1; },
    get:   function (id) { var a = read(), i = find(a, id); return i === -1 ? null : a[i]; },
    add:   function (id, portioner) {
      var a = read(), i = find(a, id);
      if (i === -1) a.push({ id: id, portioner: portioner || null });
      else if (portioner) a[i].portioner = portioner;
      write(a);
    },
    setPortions: function (id, portioner) {
      var a = read(), i = find(a, id);
      if (i !== -1) { a[i].portioner = portioner || null; write(a); }
    },
    remove: function (id) { write(read().filter(function (x) { return x.id !== id; })); },
    toggle: function (id, portioner) {
      if (this.has(id)) { this.remove(id); return false; }
      this.add(id, portioner); return true;
    },
    clear: function () { write([]); }
  };
})();

// Uppdatera siffran i menyn ("Inköpslista (3)")
window.updateCartBadge = function () {
  var n = window.Cart.count();
  document.querySelectorAll("[data-cart-badge]").forEach(function (el) {
    el.textContent = n > 0 ? " (" + n + ")" : "";
  });
};

document.addEventListener("cart:changed", window.updateCartBadge);
document.addEventListener("DOMContentLoaded", window.updateCartBadge);
