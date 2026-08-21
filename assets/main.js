/* North Haven — front-end behaviour
   No dependencies. Everything degrades gracefully without JS. */

(function () {
  'use strict';

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var drawer = document.getElementById('mobile-nav');

  if (toggle && drawer) {
    var setNav = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('data-open', String(open));
    };

    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    drawer.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // close the drawer if the viewport grows past the desktop breakpoint
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 860) setNav(false);
    });
  }

  /* ---------- reveal on scroll ---------- */
  var revealables = document.querySelectorAll('[data-reveal]');

  if (revealables.length) {
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

      revealables.forEach(function (el, i) {
        el.style.transitionDelay = Math.min(i % 3, 2) * 70 + 'ms';
        io.observe(el);
      });
    }
  }

  /* ---------- demo request form ----------
     Two modes:
       1. data-endpoint set  → POST JSON to the back end
       2. data-endpoint empty → open WhatsApp with the enquiry pre-filled
     Mode 2 means the site is useful the day it goes live, before any back end exists. */

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

      if (endpoint) {
        var btn = form.querySelector('button[type="submit"]');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
          .then(function (r) {
            if (!r.ok) throw new Error('Request failed');
            form.reset();
            say('ok', 'Thanks — we’ll message you on WhatsApp shortly.');
          })
          .catch(function () {
            say('err', 'Something went wrong. Message us directly on WhatsApp instead.');
          })
          .finally(function () {
            if (btn) { btn.disabled = false; btn.textContent = 'Send'; }
          });
        return;
      }

      // fallback — hand off to WhatsApp
      var number = (form.getAttribute('data-whatsapp') || '').replace(/\D/g, '');
      var text =
        'Hi North Haven — I’d like a demo.\n\n' +
        'Name: ' + data.name + '\n' +
        'Business: ' + data.business + '\n' +
        'WhatsApp: ' + data.phone +
        (data.message ? '\n\nMost asked: ' + data.message : '');

      if (!number) {
        say('err', 'Our WhatsApp number isn’t set up yet. Please email hello@northhaven.mv.');
        return;
      }

      window.open('https://wa.me/' + number + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      say('ok', 'Opening WhatsApp — send the message and we’ll take it from there.');
    });
  }

  /* ---------- year in footer ---------- */
  var years = document.querySelectorAll('[data-year]');
  if (years.length) {
    var y = String(new Date().getFullYear());
    years.forEach(function (el) { el.textContent = y; });
  }
})();
