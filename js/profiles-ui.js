/* ============================================================
   Profilväljare i sidhuvudet – injekteras automatiskt på alla
   sidor som laddar den här filen. Visar aktiv profil + dropdown
   för att byta, lägga till, eller gå till "Hantera profiler".
   ============================================================ */

(function () {
  function escapeHTML(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c];
    });
  }

  function init() {
    if (!window.Profiles) return;
    var header = document.querySelector(".site-header .wrap");
    if (!header || header.querySelector(".profile-switcher")) return; // redan injekterat

    var sw  = document.createElement("div"); sw.className = "profile-switcher";
    var btn = document.createElement("button"); btn.type = "button"; btn.className = "profile-trigger";
    btn.setAttribute("aria-haspopup", "true"); btn.setAttribute("aria-expanded", "false");
    var menu = document.createElement("div"); menu.className = "profile-menu hidden"; menu.setAttribute("role", "menu");
    sw.appendChild(btn); sw.appendChild(menu);
    header.appendChild(sw);

    function renderTrigger() {
      var p = window.Profiles.active();
      btn.innerHTML = '<span class="profile-dot ' + escapeHTML(p.farg || "olive") + '" aria-hidden="true"></span><span class="profile-name">' + escapeHTML(p.namn) + '</span><span class="profile-chev" aria-hidden="true">▾</span>';
      btn.title = "Aktiv profil: " + p.namn + " (klicka för att byta)";
    }
    function renderMenu() {
      menu.innerHTML = "";
      var cur = window.Profiles.active();
      window.Profiles.list().forEach(function (pp) {
        var item = document.createElement("button");
        item.type = "button";
        item.className = "profile-menu-item" + (pp.id === cur.id ? " current" : "");
        var dot = document.createElement("span"); dot.className = "profile-dot " + (pp.farg || "olive"); item.appendChild(dot);
        var nm = document.createElement("span"); nm.className = "profile-menu-name"; nm.textContent = pp.namn; item.appendChild(nm);
        if (pp.pin) { var lock = document.createElement("span"); lock.className = "profile-lock"; lock.textContent = "🔒"; lock.title = "PIN-skyddad"; item.appendChild(lock); }
        if (pp.id === cur.id) { var ck = document.createElement("span"); ck.className = "check"; ck.textContent = "✓"; item.appendChild(ck); }
        item.addEventListener("click", function () { switchTo(pp.id); });
        menu.appendChild(item);
      });
      var sep = document.createElement("div"); sep.className = "profile-menu-sep"; menu.appendChild(sep);

      var addBtn = document.createElement("button");
      addBtn.type = "button"; addBtn.className = "profile-menu-item"; addBtn.textContent = "+ Lägg till profil";
      addBtn.addEventListener("click", function () { closeMenu(); addProfile(); });
      menu.appendChild(addBtn);

      var mng = document.createElement("a"); mng.className = "profile-menu-item"; mng.textContent = "Hantera profiler …"; mng.href = "hantera-profiler.html";
      menu.appendChild(mng);
    }

    function openMenu()  { renderMenu(); menu.classList.remove("hidden"); btn.setAttribute("aria-expanded", "true"); }
    function closeMenu() { menu.classList.add("hidden"); btn.setAttribute("aria-expanded", "false"); }

    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      if (menu.classList.contains("hidden")) openMenu(); else closeMenu();
    });
    document.addEventListener("click", function (e) {
      if (!sw.contains(e.target)) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.classList.contains("hidden")) closeMenu();
    });

    function switchTo(id) {
      var p = window.Profiles.list().filter(function (x) { return x.id === id; })[0];
      if (!p) return;
      if (p.id === window.Profiles.activeId()) { closeMenu(); return; }
      if (p.pin) {
        var entered = window.prompt("PIN-kod för \"" + p.namn + "\":");
        if (entered === null) return;
        if (String(entered) !== String(p.pin)) { alert("Fel PIN."); return; }
      }
      window.Profiles.switch(id);
      window.location.reload();
    }
    function addProfile() {
      var namn = window.prompt("Vad ska den nya profilen heta?");
      if (!namn || !namn.trim()) return;
      var p = window.Profiles.add(namn.trim());
      if (window.confirm("Vill du växla till \"" + p.namn + "\" nu?")) {
        window.Profiles.switch(p.id); window.location.reload();
      } else {
        renderTrigger();
      }
    }

    renderTrigger();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
