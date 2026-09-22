// Sisteme de Operare (SO) — /os documentation
// Landing-page behavior only: tab switching + deep-linking via #hash.
// Nothing here talks to a server or stores anything.

document.addEventListener('DOMContentLoaded', function () {
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.tabbar .tab'));
  var panels = {};
  tabs.forEach(function (t) {
    panels[t.dataset.tab] = document.getElementById('tab-' + t.dataset.tab);
  });

  function activate(name, updateHash) {
    if (!panels[name]) return;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    Object.keys(panels).forEach(function (k) {
      var on = k === name;
      panels[k].classList.toggle('active', on);
      panels[k].hidden = !on;
    });
    if (updateHash !== false) {
      history.replaceState(null, '', '#' + name);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () { activate(t.dataset.tab); });
  });

  // Deep-link: index.html#evaluare opens straight on that tab.
  var initial = (location.hash || '').replace('#', '');
  if (initial && panels[initial]) {
    activate(initial, false);
  }

  // Session/module cards whose page isn't published yet: keep them
  // inert rather than linking to a 404. A card becomes a real link
  // simply by giving it an href in the HTML once its page exists.
  document.querySelectorAll('.card.wip').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
    });
  });
});
