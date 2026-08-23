(function () {
  'use strict';

  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme */
  var toggleBtn = document.querySelector('[data-theme-toggle]');
  if (toggleBtn) {
    var label = toggleBtn.querySelector('[data-theme-label]');
    var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;

    var storedTheme = function () {
      try {
        var t = localStorage.getItem('nh-theme');
        return (t === 'light' || t === 'dark') ? t : null;
      } catch (e) { return null; }
    };

    var systemTheme = function () { return mq && mq.matches ? 'light' : 'dark'; };

    var applyTheme = function (mode) {
      root.setAttribute('data-theme', mode);

      var isLight = mode === 'light';
      if (label) label.textContent = isLight ? 'Switch to dark theme' : 'Switch to light theme';

      var meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', isLight ? '#FBFAF8' : '#07100F');
    };

    applyTheme(storedTheme() || systemTheme());

    /* no explicit choice yet, so track the operating system live */
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', function () {
        if (!storedTheme()) applyTheme(systemTheme());
      });
    }

    toggleBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('nh-theme', next); } catch (e) {}
    });
  }

  /* header */
  var header = document.querySelector('.site-header');
  if (header) {
    var stick = function () {
      header.setAttribute('data-stuck', window.pageYOffset > 8 ? 'true' : 'false');
    };
    stick();
    window.addEventListener('scroll', stick, { passive: true });
  }

  /* mobile navigation */
  var navToggle = document.querySelector('.nav__toggle');
  var drawer = document.getElementById('mobile-nav');

  if (navToggle && drawer) {
    var isNavOpen = function () { return navToggle.getAttribute('aria-expanded') === 'true'; };

    var setNav = function (open) {
      navToggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('data-open', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = drawer.querySelector('a');
        if (first) first.focus();
      }
    };

    navToggle.addEventListener('click', function () {
      setNav(!isNavOpen());
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    /* while the drawer is open it is the only thing you can reach */
    document.addEventListener('keydown', function (e) {
      if (!isNavOpen()) return;

      if (e.key === 'Escape') {
        setNav(false);
        navToggle.focus();
        return;
      }

      if (e.key !== 'Tab') return;

      var stops = [navToggle].concat(
        Array.prototype.slice.call(drawer.querySelectorAll('a'))
      );
      var i = stops.indexOf(document.activeElement);
      if (i === -1) return;

      var next = e.shiftKey ? i - 1 : i + 1;
      if (next < 0) next = stops.length - 1;
      if (next >= stops.length) next = 0;

      e.preventDefault();
      stops[next].focus();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 960 && isNavOpen()) setNav(false);
    });
  }

  /* hero conversation */
  var demo = document.getElementById('demo');
  var stage = demo && demo.querySelector('.demo__body');

  if (stage) {
    var steps = Array.prototype.filter.call(stage.children, function (el) {
      return el.hasAttribute('data-seq') || el.classList.contains('typing');
    });
    var replay = demo.querySelector('[data-replay]');
    var timers = [];
    var running = false;

    var showAll = function () {
      steps.forEach(function (el) {
        if (el.classList.contains('typing')) el.classList.remove('is-on');
        else el.classList.add('is-in');
      });
    };

    var reset = function () {
      timers.forEach(clearTimeout);
      timers = [];
      steps.forEach(function (el) {
        el.classList.remove('is-in');
        el.classList.remove('is-on');
      });
    };

    var play = function () {
      if (running) return;
      running = true;
      reset();

      var at = 260;
      steps.forEach(function (el) {
        var hold = parseInt(el.getAttribute('data-hold'), 10);
        if (isNaN(hold)) hold = 900;

        if (el.classList.contains('typing')) {
          timers.push(setTimeout(function () { el.classList.add('is-on'); }, at));
          timers.push(setTimeout(function () { el.classList.remove('is-on'); }, at + hold));
        } else {
          timers.push(setTimeout(function () { el.classList.add('is-in'); }, at));
        }
        at += hold;
      });

      timers.push(setTimeout(function () {
        running = false;
        if (replay) replay.hidden = false;
      }, at + 400));
    };

    if (reduced) {
      showAll();
    } else {
      var started = false;
      var check = function () {
        if (started) return;
        var r = stage.getBoundingClientRect();
        if (r.bottom <= 0) {
          started = true;
          showAll();
          if (replay) replay.hidden = false;
        } else if (r.top < window.innerHeight * 0.88) {
          started = true;
          play();
        }
      };

      var ticking = false;
      var onScroll = function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () { ticking = false; check(); });
      };

      check();
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      window.addEventListener('load', check);
      setTimeout(check, 400);
      setTimeout(function () {
        if (started) return;
        var r = stage.getBoundingClientRect();
        if (r.bottom < 0) { started = true; showAll(); if (replay) replay.hidden = false; }
        else if (r.top < window.innerHeight) { started = true; play(); }
      }, 2500);

      if (replay) {
        replay.addEventListener('click', function () {
          replay.hidden = true;
          play();
        });
      }
    }
  }

  /* step rules draw when the sequence comes into view */
  var stepEls = document.querySelectorAll('.step');
  if (stepEls.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(stepEls, function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { threshold: 0.2 });
      Array.prototype.forEach.call(stepEls, function (el) { io.observe(el); });
    }
  }

  /* demo request form */
  var form = document.getElementById('demo-form');
  var status = document.getElementById('form-status');

  if (form) {
    var say = function (state, text) {
      if (!status) return;
      status.setAttribute('data-state', state);
      status.textContent = text;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var required = ['name', 'business', 'phone'];
      var missing = required.filter(function (n) {
        return !form.elements[n] || !form.elements[n].value.trim();
      });

      if (missing.length) {
        say('err', 'Please fill in your name, business name and WhatsApp number.');
        var first = form.elements[missing[0]];
        if (first) first.focus();
        return;
      }

      var data = {
        name: form.elements.name.value.trim(),
        business: form.elements.business.value.trim(),
        phone: form.elements.phone.value.trim(),
        message: form.elements.message ? form.elements.message.value.trim() : ''
      };

      var endpoint = form.getAttribute('data-endpoint');
      var btn = form.querySelector('button[type="submit"]');

      if (endpoint) {
        if (btn) btn.setAttribute('aria-busy', 'true');

        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (r) {
            if (!r.ok) throw new Error('Request failed');
            form.reset();
            say('ok', 'Thanks. We’ll message you on WhatsApp shortly.');
          })
          .catch(function () {
            say('err', 'That didn’t send. Message us directly on WhatsApp instead.');
          })
          .finally(function () {
            if (btn) btn.removeAttribute('aria-busy');
          });
        return;
      }

      var number = (form.getAttribute('data-whatsapp') || '').replace(/\D/g, '');

      if (!number) {
        say('err', 'Our WhatsApp number isn’t set up yet. Please email hello@northhaven.mv.');
        return;
      }

      var text =
        'Hi North Haven, I’d like a demo.\n\n' +
        'Name: ' + data.name + '\n' +
        'Business: ' + data.business + '\n' +
        'WhatsApp: ' + data.phone +
        (data.message ? '\n\nMost asked: ' + data.message : '');

      window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      say('ok', 'Opening WhatsApp. Send the message and we’ll take it from there.');
    });
  }

  /* footer year */
  var years = document.querySelectorAll('[data-year]');
  if (years.length) {
    var y = String(new Date().getFullYear());
    Array.prototype.forEach.call(years, function (el) { el.textContent = y; });
  }
})();
