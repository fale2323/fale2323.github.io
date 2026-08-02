/* ===== reveal-on-scroll ===== */
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var els = document.querySelectorAll('.reveal');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }

/* ===== live metrics (GitHub API) ===== */
// ---------- Live Metrics: fetch public repo stats from GitHub API ----------
  // Unauthenticated, client-side, no build step needed. Fails gracefully offline
  // or if rate-limited (60 req/hr per IP) -- falls back to "—" with an error status.
  (function(){
    function timeAgoId(iso){
      var diffMs = Date.now() - new Date(iso).getTime();
      var days = Math.floor(diffMs / 86400000);
      if (days <= 0) return 'hari ini';
      if (days === 1) return '1 hari lalu';
      if (days < 30) return days + ' hari lalu';
      var months = Math.floor(days/30);
      if (months < 12) return months + ' bulan lalu';
      return Math.floor(months/12) + ' tahun lalu';
    }

    document.querySelectorAll('.metric-card[data-repo]').forEach(function(card){
      var repo = card.dataset.repo;
      var statusEl = card.querySelector('[data-status]');
      fetch('https://api.github.com/repos/' + repo)
        .then(function(res){ if (!res.ok) throw new Error('HTTP ' + res.status); return res.json(); })
        .then(function(data){
          card.querySelector('[data-field="stars"]').textContent = data.stargazers_count ?? '—';
          card.querySelector('[data-field="commit"]').textContent = data.pushed_at ? timeAgoId(data.pushed_at) : '—';
          statusEl.textContent = 'live dari GitHub API';
          statusEl.classList.add('live');
        })
        .catch(function(){
          statusEl.textContent = 'Tidak bisa memuat data live saat ini';
          statusEl.classList.add('err');
        });
    });
  })();

/* ===== mobile nav toggle (accessible hamburger) ===== */
(function(){
  var toggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav-links-list');
  if (!toggle || !nav) return;

  function closeNav(){
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
  function openNav(){
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
  }

  toggle.addEventListener('click', function(){
    var isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeNav(); else openNav();
  });

  nav.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeNav();
  });
})();
