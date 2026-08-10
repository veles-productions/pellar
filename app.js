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
})();
