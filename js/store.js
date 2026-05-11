/* ============================================================
   Inköpslistan – enkel lagring i webbläsaren (localStorage).
   Håller reda på vilka recept besökaren har markerat. Delas av
   alla sidor. Lyssna på "cart:changed" på document för att
   reagera när listan ändras.
   ============================================================ */

window.Cart = (function () {
  var KEY = "aik_inkopslista_v1";

  function read() {
    try {
      var raw = localStorage.getItem(KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function write(arr) {
    try { localStorage.setItem(KEY, JSON.stringify(arr)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("cart:changed", { detail: { ids: arr.slice() } }));
  }

  return {
    list:  function () { return read(); },
    count: function () { return read().length; },
    has:   function (id) { return read().indexOf(id) !== -1; },
    add:   function (id) { var a = read(); if (a.indexOf(id) === -1) { a.push(id); write(a); } },
    remove:function (id) { var a = read().filter(function (x) { return x !== id; }); write(a); },
    toggle:function (id) { this.has(id) ? this.remove(id) : this.add(id); return this.has(id); },
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
