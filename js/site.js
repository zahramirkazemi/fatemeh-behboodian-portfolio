(function () {
  'use strict';

  var root = document.querySelector('[data-root]');
  if (!root) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- reveal-on-scroll ---------- */
  if (!reduced) {
    var els = Array.prototype.slice.call(root.querySelectorAll('[data-reveal]'));
    els.forEach(function (el) {
      var d = el.getAttribute('data-reveal-delay') || 0;
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition =
        'opacity .75s cubic-bezier(.2,.8,.2,1) ' + d + 'ms, transform .85s cubic-bezier(.2,.8,.2,1) ' + d + 'ms';
    });
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'none';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach(function (el) {
      io.observe(el);
    });
    // Reveal anything already in view immediately, so first paint isn't blank.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        els.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.top < window.innerHeight && r.bottom > 0) {
            el.style.opacity = '1';
            el.style.transform = 'none';
            io.unobserve(el);
          }
        });
      });
    });
    // Safety net in case IntersectionObserver never fires (e.g. hidden tab).
    setTimeout(function () {
      els.forEach(function (el) {
        if (getComputedStyle(el).opacity !== '1') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 1400);
  }

  /* ---------- scroll progress bar ---------- */
  var bar = root.querySelector('[data-progress]');
  var pin = root.querySelector('[data-pin]');
  var rail = root.querySelector('[data-rail]');

  function onScroll() {
    if (pin && rail) {
      var r = pin.getBoundingClientRect();
      var span = pin.offsetHeight - window.innerHeight;
      var p = Math.min(1, Math.max(0, -r.top / (span || 1)));
      var max = Math.max(0, rail.scrollWidth - rail.clientWidth);
      rail.scrollLeft = p * max;
    }
    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = Math.min(1, Math.max(0, window.scrollY / (h || 1))) * 100 + '%';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- home page only: cursor trails ---------- */
  if (root.getAttribute('data-root') === 'home' && !reduced && window.matchMedia('(pointer:fine)').matches) {
    var c1 = root.querySelector('[data-trail]');
    var c2 = root.querySelector('[data-trail2]');
    var tx = -100,
      ty = -100,
      x1 = -100,
      y1 = -100,
      on = false;

    // Hide the OS cursor so the purple "you" pointer is the real cursor.
    document.documentElement.style.cursor = 'none';
    var style = document.createElement('style');
    style.textContent =
      '[data-root="home"], [data-root="home"] * { cursor: none !important; }';
    document.head.appendChild(style);

    window.addEventListener(
      'pointermove',
      function (e) {
        tx = e.clientX;
        ty = e.clientY;
        if (!on) {
          on = true;
          if (c1) c1.style.opacity = '1';
        }
      },
      { passive: true }
    );

    // Fatemeh's cursor wanders on its own between random resting spots.
    var x2 = window.innerWidth * 0.18,
      y2 = window.innerHeight * 0.62;
    var gx = x2,
      gy = y2,
      hold = 0;
    function pickGoal() {
      gx = (0.08 + Math.random() * 0.5) * window.innerWidth;
      gy = (0.2 + Math.random() * 0.6) * window.innerHeight;
      hold = 40 + Math.random() * 90;
    }
    pickGoal();
    if (c2) {
      c2.style.opacity = '0.85';
      c2.style.transform = 'translate(' + x2 + 'px,' + y2 + 'px)';
    }

    (function loop() {
      // Snap tightly to the pointer so it feels like the real cursor.
      x1 += (tx - x1) * 0.65;
      y1 += (ty - y1) * 0.65;
      var dx = gx - x2,
        dy = gy - y2;
      if (Math.hypot(dx, dy) < 6) {
        if (hold-- < 0) pickGoal();
      } else {
        x2 += dx * 0.035;
        y2 += dy * 0.035;
      }
      if (c1) c1.style.transform = 'translate(' + x1 + 'px,' + y1 + 'px)';
      if (c2) c2.style.transform = 'translate(' + x2 + 'px,' + y2 + 'px)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- mobile nav ---------- */
  var nav = root.querySelector('[data-nav]');
  var navToggle = root.querySelector('[data-nav-toggle]');
  var navPanel = root.querySelector('[data-nav-panel]');
  var navBackdrop = root.querySelector('[data-nav-backdrop]');
  if (nav && navToggle && navPanel) {
    function setNavOpen(open) {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    navToggle.addEventListener('click', function () {
      setNavOpen(!nav.classList.contains('is-open'));
    });
    if (navBackdrop) {
      navBackdrop.addEventListener('click', function () {
        setNavOpen(false);
      });
    }
    navPanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setNavOpen(false);
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNavOpen(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setNavOpen(false);
    });
  }

  /* ---------- home page only: contact form ---------- */
  var form = root.querySelector('[data-contact-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var label = form.querySelector('[data-submit-label]');
      var submitBtn = form.querySelector('[type="submit"]');
      var data = new FormData(form);
      var payload = {
        name: data.get('name'),
        email: data.get('email'),
        message: data.get('message'),
        _subject: 'Portfolio contact from ' + (data.get('name') || 'visitor'),
        _template: 'table'
      };

      if (submitBtn) submitBtn.disabled = true;
      if (label) label.textContent = 'Sending…';

      fetch('https://formsubmit.co/ajax/Fatemeh.behboodian99@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Send failed');
          return res.json();
        })
        .then(function () {
          if (label) label.textContent = 'Thanks — I will reply soon';
          form.reset();
        })
        .catch(function () {
          if (label) label.textContent = 'Could not send — try email instead';
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
})();
