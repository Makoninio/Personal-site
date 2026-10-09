// Theme toggle, reveal-on-scroll, nav state, shelf arrows. No dependencies.
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Theme: a saved choice wins (applied early in <head>), otherwise follow the OS
  var toggle = document.querySelector('.theme-toggle');
  var current = function () {
    return root.getAttribute('data-theme') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  };
  var label = function () {
    toggle.setAttribute('aria-label', current() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  };
  if (toggle) {
    root.setAttribute('data-theme', current());
    label();
    toggle.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      label();
    });
  }

  // Reveal on scroll
  var targets = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  }

  // Show the wordmark once the big hero name scrolls away
  var nav = document.querySelector('.site-nav');
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.45); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Shelf prev/next buttons
  document.querySelectorAll('[data-shelf]').forEach(function (btns) {
    var shelf = document.getElementById(btns.getAttribute('data-shelf'));
    if (!shelf) return;
    var prev = btns.querySelector('.prev');
    var next = btns.querySelector('.next');
    var step = function () {
      var card = shelf.firstElementChild;
      return card ? card.getBoundingClientRect().width + 20 : 300;
    };
    var sync = function () {
      prev.disabled = shelf.scrollLeft < 4;
      next.disabled = shelf.scrollLeft + shelf.clientWidth >= shelf.scrollWidth - 4;
    };
    prev.addEventListener('click', function () { shelf.scrollBy({ left: -step(), behavior: 'smooth' }); });
    next.addEventListener('click', function () { shelf.scrollBy({ left: step(), behavior: 'smooth' }); });
    shelf.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
