/* Pellar landing page — theme toggle, reduced-motion stills, dummy waitlist. */
(function () {
  'use strict';

  /* ── Theme ──────────────────────────────────────────────
     Dark is the default, because the product is dark by default. The OS
     setting is deliberately NOT followed — a visitor who sees the site and
     then sees the app should not experience a change of product. Only an
     explicit choice on this page overrides it. */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('pellar-theme'); } catch (e) { /* private mode */ }
  if (stored === 'light' || stored === 'dark') root.className = stored;

  var themeBtn = document.getElementById('theme');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.classList.contains('light') ? 'dark' : 'light';
      root.className = next;
      try { localStorage.setItem('pellar-theme', next); } catch (e) { /* ignore */ }
    });
  }

  /* ── Reduced motion ─────────────────────────────────────
     The graphics are animated WebP, so CSS cannot stop them. Swap each one
     for its final-frame PNG instead, and pause the proof video. */
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(document.querySelectorAll('img[data-still]'), function (img) {
      img.src = img.getAttribute('data-still');
    });
    Array.prototype.forEach.call(document.querySelectorAll('video[autoplay]'), function (v) {
      v.removeAttribute('autoplay');
      v.removeAttribute('loop');
      v.pause();
    });
  }

  /* ── Waitlist ───────────────────────────────────────────
     Posts to the n8n webhook (workflow "Pellar Waitlist Capture" on
     n8n.moonacle.com), which validates the address and emails each signup
     to the team via Resend. The endpoint answers CORS preflights itself. */
  var ENDPOINT = 'https://n8n.moonacle.com/webhook/pellar-waitlist';
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  Array.prototype.forEach.call(document.querySelectorAll('form[data-waitlist]'), function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var input = form.querySelector('input[type=email]');
      var msg = form.querySelector('.signup-msg');
      var seg = form.querySelector('select');
      var btn = form.querySelector('button[type=submit]');
      var value = (input.value || '').trim();

      if (!EMAIL.test(value)) {
        msg.textContent = 'That address does not look right. Please check it.';
        msg.classList.add('err');
        input.focus();
        return;
      }

      btn.disabled = true;
      msg.classList.remove('err');
      msg.textContent = 'Adding you…';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, segment: seg ? seg.value : '', page: location.pathname })
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        msg.textContent = 'You are on the list. We will write before sign-ups open.';
        input.value = '';
        if (seg) seg.selectedIndex = 0;
      }).catch(function () {
        msg.classList.add('err');
        msg.textContent = 'That did not go through. Please try again in a minute.';
      }).finally(function () {
        btn.disabled = false;
      });
    });
  });

  /* ── Tactile details ────────────────────────────────────
     LED pulse after a primary-button click (the CSS lights the strip
     while pressed; this keeps it lit a beat longer, like a console key
     confirming the command). */
  document.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.btn-primary') : null;
    if (!b) return;
    b.classList.add('is-lit');
    setTimeout(function () { b.classList.remove('is-lit'); }, 420);
  });

  /* Scroll-scrubbed "lights on": the statement band pins and scrolling
     drives the studio video from black to fully lit. GSAP ScrollTrigger
     (vendored) does the pin; reduced motion or a missing lib falls back
     to the fully-lit final frame. */
  var scrubVid = document.querySelector('.band-scrub video');
  if (scrubVid) {
    scrubVid.pause();
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var showLit = function () {
      if (scrubVid.duration) scrubVid.currentTime = Math.max(0, scrubVid.duration - 0.05);
    };
    if (reduced || !window.gsap || !window.ScrollTrigger) {
      if (scrubVid.readyState >= 1) showLit();
      else scrubVid.addEventListener('loadedmetadata', showLit);
    } else {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: '.band-scrub',
        start: 'top top',
        end: '+=140%',
        pin: true,
        scrub: 0.6,
        onUpdate: function (self) {
          if (scrubVid.duration) {
            scrubVid.currentTime = self.progress * (scrubVid.duration - 0.05);
          }
        }
      });
    }
  }

  /* Mixer fader <-> graphics carousel sync. The fader only shows in the
     small-screen layout where the grid scrolls horizontally. */
  var fader = document.getElementById('grid-fader');
  var grid = document.querySelector('#graphics .grid');
  if (fader && grid) {
    var syncing = false;
    var range = function () { return Math.max(1, grid.scrollWidth - grid.clientWidth); };
    fader.addEventListener('input', function () {
      syncing = true;
      grid.scrollLeft = (fader.value / 100) * range();
      setTimeout(function () { syncing = false; }, 60);
    });
    grid.addEventListener('scroll', function () {
      if (!syncing) fader.value = (grid.scrollLeft / range()) * 100;
    }, { passive: true });
  }
})();
