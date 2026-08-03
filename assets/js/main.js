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

/* ===== root cause: tap to expand full analysis (mobile) ===== */
(function(){
  document.querySelectorAll('.rootcause-toggle').forEach(function(btn){
    var wrap = btn.previousElementSibling;
    if (!wrap || !wrap.classList.contains('rootcause-wrap')) return;
    btn.addEventListener('click', function(){
      var isOpen = wrap.classList.toggle('expanded');
      btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      btn.innerHTML = isOpen
        ? 'Sembunyikan analisis <span class="rt-arrow">↓</span>'
        : 'Baca analisis lengkap <span class="rt-arrow">↓</span>';
    });
  });
})();

/* ===== screenshots: tap to enlarge (lightbox) ===== */
(function(){
  var overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.innerHTML = '<button class="lightbox-close" aria-label="Tutup gambar">✕</button><img alt="">';
  document.body.appendChild(overlay);
  var overlayImg = overlay.querySelector('img');

  function open(src, alt){
    overlayImg.src = src;
    overlayImg.alt = alt || '';
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function close(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.media-slot img').forEach(function(img){
    img.addEventListener('click', function(){ open(img.currentSrc || img.src, img.alt); });
  });
  overlay.addEventListener('click', function(e){
    if (e.target === overlay || e.target.classList.contains('lightbox-close')) close();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') close();
  });
})();

/* ===== nav: highlight active section while scrolling ===== */
(function(){
  var links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;
  var sections = Array.prototype.map.call(links, function(link){
    return document.querySelector(link.getAttribute('href'));
  }).filter(Boolean);

  if (!('IntersectionObserver' in window) || !sections.length) return;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var link = document.querySelector('.nav-links a[href="#' + entry.target.id + '"]');
      if (!link) return;
      if (entry.isIntersecting) {
        links.forEach(function(l){ l.classList.remove('active'); });
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach(function(s){ io.observe(s); });
})();
