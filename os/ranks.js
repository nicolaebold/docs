/* PitOS — shared rank/role model + CSV parsing, used by dashboard.html and leaderboard.html */
window.PitOS = (function () {

  var RANKS = [
    { min: 0,  version: 'v0.1',     key: 'boot',      title: 'Bootstrapper',     icon: 'fa-terminal', color: '#8b91a1', glow: 'rgba(139,145,161,.45)', tagline: 'Primul kernel a compilat. Abia a pornit.' },
    { min: 20, version: 'v0.5',     key: 'hacker',    title: 'Kernel Hacker',    icon: 'fa-bug',       color: '#2952e3', glow: 'rgba(41,82,227,.45)',   tagline: 'Sistemul rulează. Uneori tremură.' },
    { min: 40, version: 'v1.0',     key: 'architect', title: 'System Architect', icon: 'fa-sitemap',   color: '#6941c6', glow: 'rgba(105,65,198,.45)',  tagline: 'Subsistemele critice sunt stabile.' },
    { min: 60, version: 'v1.5',     key: 'release',   title: 'Release Engineer', icon: 'fa-rocket',    color: '#c2720c', glow: 'rgba(194,114,12,.45)',  tagline: 'Se pregătește lansarea majoră.' },
    { min: 80, version: 'v2.0 LTS', key: 'bdfl',      title: 'BDFL',             icon: 'fa-crown',     color: '#1a7f37', glow: 'rgba(26,127,55,.45)',   tagline: 'Sistem complet. Susținut. Stabil pe termen lung.' }
  ];

  function rankFor(uptime) {
    var r = RANKS[0];
    for (var i = 0; i < RANKS.length; i++) if (uptime >= RANKS[i].min) r = RANKS[i];
    return r;
  }
  function nextRank(rank) {
    var idx = RANKS.indexOf(rank);
    return idx >= 0 && idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
  }
  function pctToNext(uptime) {
    var r = rankFor(uptime);
    var n = nextRank(r);
    if (!n) return 100;
    var span = n.min - r.min;
    return Math.max(0, Math.min(100, Math.round(((uptime - r.min) / span) * 100)));
  }

  function parseCsv(text) {
    var lines = text.trim().split(/\r?\n/);
    var header = lines[0].split(',').map(function (h) { return h.trim(); });
    var rows = [];
    for (var i = 1; i < lines.length; i++) {
      var parts = lines[i].split(',');
      if (parts.length < 2) continue;
      var row = {};
      header.forEach(function (h, idx) { row[h] = (parts[idx] || '').trim(); });
      if (!row.cod) continue;
      row.uptime = parseFloat(row.uptime);
      if (isNaN(row.uptime)) continue;
      rows.push(row);
    }
    return rows;
  }

  function svgRing(size, stroke) {
    var r = (size - stroke) / 2;
    return { r: r, c: 2 * Math.PI * r };
  }

  return { RANKS: RANKS, rankFor: rankFor, nextRank: nextRank, pctToNext: pctToNext, parseCsv: parseCsv, svgRing: svgRing };
})();
