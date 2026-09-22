// Sisteme de Operare (SO) — /os documentation
// Tab switching, mobile sidebar toggle, and the student progress panel
// (loaded client-side from progres.csv — nothing here talks to a server
// beyond fetching that one static file, and nothing is stored).

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- mobile left-sidebar toggle ---------------- */
  var toggle = document.getElementById('sidebarToggle');
  var sidebar = document.querySelector('.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', function () { sidebar.classList.toggle('open'); });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('open') &&
          !sidebar.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  document.querySelectorAll('.is-upcoming').forEach(function (el) {
    el.addEventListener('click', function (e) { e.preventDefault(); });
  });

  /* ---------------- tabs ---------------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabbar .tab'));
  var panels = {};
  tabs.forEach(function (t) { panels[t.dataset.tab] = document.getElementById('tab-' + t.dataset.tab); });

  function activateTab(name, updateHash) {
    if (!panels[name]) return;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Object.keys(panels).forEach(function (k) {
      panels[k].classList.toggle('active', k === name);
    });
    if (updateHash !== false) history.replaceState(null, '', '#' + name);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { activateTab(t.dataset.tab); });
  });

  var initialTab = (location.hash || '').replace('#', '');
  if (initialTab && panels[initialTab]) activateTab(initialTab, false);

  /* ---------------- student progress panel ---------------- */
  // Expected file: progres.csv, next to index.html, with header:
  //   cod,uptime
  // One row per student, "cod" being the private code you gave them
  // (never their real name), "uptime" the number of days computed from
  // the VPL/Moodle export. Re-export and overwrite this file after each
  // session — the page always reads it fresh, no rebuild needed.
  var VERSION_THRESHOLDS = [
    { min: 80, label: 'v2.0 LTS' },
    { min: 60, label: 'v1.5' },
    { min: 40, label: 'v1.0' },
    { min: 20, label: 'v0.5' },
    { min: 0,  label: 'v0.1' }
  ];

  function versionFor(uptime) {
    for (var i = 0; i < VERSION_THRESHOLDS.length; i++) {
      if (uptime >= VERSION_THRESHOLDS[i].min) return VERSION_THRESHOLDS[i].label;
    }
    return 'v0.1';
  }

  function parseCsv(text) {
    var lines = text.trim().split(/\r?\n/);
    var rows = [];
    for (var i = 1; i < lines.length; i++) { // skip header
      var parts = lines[i].split(',');
      if (parts.length < 2) continue;
      var cod = parts[0].trim();
      var uptime = parseFloat(parts[1]);
      if (!cod || isNaN(uptime)) continue;
      rows.push({ cod: cod, uptime: uptime });
    }
    return rows;
  }

  var progressData = [];
  var srInput = document.getElementById('srCodeInput');
  var srButton = document.getElementById('srSearchBtn');
  var srResult = document.getElementById('srResult');
  var srEmpty = document.getElementById('srEmpty');
  var srLeaderboard = document.getElementById('srLeaderboard');

  function renderLeaderboard() {
    if (!srLeaderboard) return;
    var top = progressData.slice().sort(function (a, b) { return b.uptime - a.uptime; }).slice(0, 5);
    srLeaderboard.innerHTML = '';
    top.forEach(function (row, i) {
      var li = document.createElement('li');
      li.innerHTML = '<span><span class="rank">#' + (i + 1) + '</span>' + row.cod + '</span><span>' + row.uptime + ' zile</span>';
      srLeaderboard.appendChild(li);
    });
    if (!top.length) srLeaderboard.innerHTML = '<li class="sr-empty">Niciun progres încărcat încă.</li>';
  }

  function showResult(row) {
    if (!srResult) return;
    if (!row) {
      srResult.classList.remove('show');
      if (srEmpty) srEmpty.style.display = 'block';
      return;
    }
    if (srEmpty) srEmpty.style.display = 'none';
    var version = versionFor(row.uptime);
    var nextIdx = VERSION_THRESHOLDS.findIndex(function (v) { return v.label === version; }) - 1;
    var next = nextIdx >= 0 ? VERSION_THRESHOLDS[nextIdx] : null;
    var pct = next ? Math.min(100, Math.round((row.uptime / next.min) * 100)) : 100;

    srResult.innerHTML =
      '<div class="sr-version">PitOS ' + version + '</div>' +
      '<div class="sr-uptime">Uptime: ' + row.uptime + ' zile</div>' +
      '<div class="sr-bar-track"><div class="sr-bar-fill" style="width:' + pct + '%"></div></div>';
    srResult.classList.add('show');
  }

  if (srButton && srInput) {
    srButton.addEventListener('click', function () {
      var code = srInput.value.trim();
      var row = progressData.find(function (r) { return r.cod.toLowerCase() === code.toLowerCase(); });
      showResult(row || null);
    });
    srInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') srButton.click();
    });
  }

  fetch('progres.csv')
    .then(function (r) { if (!r.ok) throw new Error('no csv'); return r.text(); })
    .then(function (text) {
      progressData = parseCsv(text);
      renderLeaderboard();
    })
    .catch(function () {
      // No progres.csv published yet, or the page was opened directly
      // from disk (fetch of a local file is blocked by the browser) —
      // fails silently, panel just stays empty until it's live on
      // GitHub Pages with a real progres.csv next to it.
      renderLeaderboard();
    });
});
