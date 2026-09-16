/* ============================================================
   M6 OCW – app.js
   Tabs · Sidebar toggle · Copy code · Active link highlight
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Tab switching ---- */
  document.querySelectorAll('.tab-nav').forEach(nav => {
    const paneContainer = nav.nextElementSibling;
    nav.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const target = btn.dataset.tab;
        // search sibling panes or within parent
        const panes = (paneContainer || btn.closest('.tab-wrap'))
          .querySelectorAll('.tab-pane');
        panes.forEach(p => {
          p.classList.toggle('active', p.id === target);
        });
      });
    });
  });

  /* ---- Mobile sidebar toggle ---- */
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ---- Copy code buttons ---- */
  document.querySelectorAll('.code-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const pre = btn.closest('.code-block').querySelector('pre');
      const text = pre.innerText;
      navigator.clipboard.writeText(text).then(() => {
        btn.textContent = 'Copiat!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copiază';
          btn.classList.remove('copied');
        }, 1800);
      }).catch(() => {
        btn.textContent = 'Eroare';
      });
    });
  });

  /* ---- Highlight active sidebar link ---- */
  const currentFile = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.sidebar-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || href.endsWith('/' + currentFile)) {
      link.classList.add('active');
    }
  });

  /* ---- Smooth section highlight on scroll ---- */
  const headings = document.querySelectorAll('.main h2[id], .main h3[id]');
  if (headings.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          document.querySelectorAll('.sidebar-anchor').forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-60px 0px -60% 0px' });
    headings.forEach(h => observer.observe(h));
  }

     /* ---- Auto-generare "Sesiuni" (navigare intre pagini) ---- */
  const SESSIONS = [
    { file: 'sesiunea-0.html',  label: 'S0 – Syllabus' },
    { file: 'sesiunea-0b.html', label: 'S0b – Limbaje' },
    { file: 'sesiunea-1.html',  label: 'S1 – Calculator și C++' },
    { file: 'sesiunea-2.html',  label: 'S2 – Variabile și tipuri' },
    { file: 'sesiunea-3.html',  label: 'S3 – Expresii și evaluarea lor' },
    // adaugi aici o linie noua de fiecare data cand apare o sesiune noua
  ];

  const sessionNav = document.getElementById('sessionNav');
  if (sessionNav) {
    const currentFile = location.pathname.split('/').pop() || 'index.html';
    let html = '<span class="sidebar-label">Sesiuni</span>';
    SESSIONS.forEach(s => {
      const activeClass = s.file === currentFile ? ' active' : '';
      html += `<a class="sidebar-link${activeClass}" href="${s.file}">${s.label}</a>`;
    });
    html += '<a class="sidebar-link" href="index.html">← Înapoi la modul</a>';
    sessionNav.innerHTML = html;
  }

  
});
