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

     /* ---- Auto-generare sidebar "Această pagină" din h2-urile paginii ---- */
  const pageNav = document.getElementById('pageNav');
  if (pageNav) {
    const tabMeta = {
      curs:         { label: 'Curs',        icon: 'fa-book-open' },
      exemple:      { label: 'Exemple',     icon: 'fa-lightbulb' },
      lab:          { label: 'Laborator',   icon: 'fa-flask' },
      cheat:        { label: 'Cheat Sheet', icon: 'fa-bolt' },
      autoevaluare: { label: 'Autoevaluare',icon: 'fa-circle-check' }
    };
    let html = '';
    document.querySelectorAll('.tab-pane').forEach(pane => {
      const key = pane.id.replace(/^t\d+-/, ''); // "t3-curs" -> "curs"
      const meta = tabMeta[key] || { label: key, icon: 'fa-circle' };
      const headings = pane.querySelectorAll('h2[id]');
      if (!headings.length) return;
      html += `<span class="sidebar-label">${meta.label}</span>`;
      headings.forEach(h => {
        html += `<a class="sidebar-link" href="#${h.id}"><i class="fa-solid ${meta.icon} fa-fw"></i> ${h.textContent}</a>`;
      });
    });
    pageNav.innerHTML = html;
  }

});
