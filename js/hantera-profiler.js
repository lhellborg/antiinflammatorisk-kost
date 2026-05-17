/* ============================================================
   Hantera-profiler-sidan: byt namn / färg / PIN, exportera till
   JSON-fil, ta bort, lägg till, importera.
   ============================================================ */

(function () {
  var COLORS = ["terracotta", "olive", "blue", "pink", "amber", "purple"];
  var list = document.getElementById("profile-list");
  if (!list) return;

  function escapeHTML(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function suffixFromKeyCount(id) {
    var prefix = "aik:" + id + ":";
    var n = 0;
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(prefix) === 0) n++;
    }
    return n;
  }

  function render() {
    list.innerHTML = "";
    var profiles = window.Profiles.list();
    var activeId = window.Profiles.activeId();
    profiles.forEach(function (p) {
      var card = document.createElement("div"); card.className = "profile-card";

      var dot = document.createElement("span"); dot.className = "profile-dot " + (p.farg || "olive"); card.appendChild(dot);

      var nameWrap = document.createElement("div"); nameWrap.className = "profile-card-name";
      nameWrap.appendChild(document.createTextNode(p.namn));
      if (p.id === activeId) {
        var tag = document.createElement("span"); tag.className = "profile-card-tag"; tag.textContent = "aktiv";
        tag.style.marginLeft = ".5rem"; nameWrap.appendChild(tag);
      }
      if (p.pin) {
        var lock = document.createElement("span"); lock.textContent = " 🔒"; lock.title = "PIN-skyddad"; nameWrap.appendChild(lock);
      }
      card.appendChild(nameWrap);

      // färgväljare
      var sw = document.createElement("div"); sw.className = "color-swatches";
      COLORS.forEach(function (c) {
        var b = document.createElement("button"); b.type = "button"; b.className = "color-swatch profile-dot " + c + (c === (p.farg || "olive") ? " selected" : "");
        b.title = c;
        b.addEventListener("click", function () { window.Profiles.setColor(p.id, c); render(); });
        sw.appendChild(b);
      });
      card.appendChild(sw);

      // åtgärder
      var acts = document.createElement("div"); acts.className = "profile-card-actions";

      var renameBtn = document.createElement("button"); renameBtn.type = "button"; renameBtn.className = "btn btn-ghost"; renameBtn.textContent = "Byt namn";
      renameBtn.addEventListener("click", function () {
        var n = window.prompt("Nytt namn för profilen:", p.namn);
        if (n && n.trim()) { window.Profiles.rename(p.id, n.trim()); render(); }
      });
      acts.appendChild(renameBtn);

      var pinBtn = document.createElement("button"); pinBtn.type = "button"; pinBtn.className = "btn btn-ghost";
      pinBtn.textContent = p.pin ? "Ändra PIN" : "Sätt PIN";
      pinBtn.addEventListener("click", function () {
        var n = window.prompt(p.pin ? "Ny PIN (tomt = ta bort):" : "Välj PIN-kod (siffror, valfri):", p.pin || "");
        if (n === null) return;
        window.Profiles.setPin(p.id, n.trim() || null);
        render();
      });
      acts.appendChild(pinBtn);

      var exportBtn = document.createElement("button"); exportBtn.type = "button"; exportBtn.className = "btn btn-ghost"; exportBtn.textContent = "Exportera";
      exportBtn.addEventListener("click", function () { downloadJson(p); });
      acts.appendChild(exportBtn);

      if (p.id !== activeId) {
        var switchBtn = document.createElement("button"); switchBtn.type = "button"; switchBtn.className = "btn btn-secondary"; switchBtn.textContent = "Växla hit";
        switchBtn.addEventListener("click", function () {
          if (p.pin) {
            var e = window.prompt("PIN-kod för \"" + p.namn + "\":");
            if (e === null) return;
            if (String(e) !== String(p.pin)) { alert("Fel PIN."); return; }
          }
          window.Profiles.switch(p.id);
          window.location.reload();
        });
        acts.appendChild(switchBtn);
      }

      if (profiles.length > 1) {
        var delBtn = document.createElement("button"); delBtn.type = "button"; delBtn.className = "btn btn-ghost"; delBtn.textContent = "Ta bort";
        delBtn.style.color = "var(--terracotta-dark)";
        delBtn.addEventListener("click", function () {
          var n = suffixFromKeyCount(p.id);
          var msg = 'Ta bort profilen "' + p.namn + '"? All data (' + n + ' lagrade poster) försvinner permanent.';
          if (window.confirm(msg)) { window.Profiles.remove(p.id); render(); }
        });
        acts.appendChild(delBtn);
      }

      card.appendChild(acts);
      list.appendChild(card);
    });
  }

  function downloadJson(p) {
    var payload = window.Profiles.exportProfile(p.id);
    if (!payload) return;
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var safeName = String(p.namn).replace(/[^a-zA-Z0-9_\-]+/g, "_").toLowerCase() || "profil";
    a.href = url; a.download = "aik-profil-" + safeName + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  document.getElementById("add-profile").addEventListener("click", function () {
    var n = window.prompt("Vad ska profilen heta?");
    if (!n || !n.trim()) return;
    window.Profiles.add(n.trim());
    render();
  });

  var fileInput = document.getElementById("import-file");
  document.getElementById("import-profile").addEventListener("click", function () { fileInput.click(); });
  fileInput.addEventListener("change", function () {
    var f = fileInput.files && fileInput.files[0]; if (!f) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var payload = JSON.parse(e.target.result);
        if (!payload || !payload.profile || !payload.data) throw new Error("Filen ser inte ut som en profilexport.");
        var p = window.Profiles.importProfile(payload);
        if (p) { alert("Profil \"" + p.namn + "\" importerad."); render(); }
      } catch (err) {
        alert("Kunde inte läsa filen: " + (err.message || err));
      }
      fileInput.value = "";
    };
    reader.readAsText(f);
  });

  render();
})();
