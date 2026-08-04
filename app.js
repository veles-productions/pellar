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
     DUMMY. This posts nowhere. It validates the address, keeps it in
     localStorage so the page can be demonstrated, and shows a success state.
     Before launch this needs a real endpoint — the April site shipped with a
     form wired to nothing and that is the mistake being avoided here. */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  Array.prototype.forEach.call(document.querySelectorAll('form[data-waitlist]'), function (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var input = form.querySelector('input[type=email]');
      var msg = form.querySelector('.signup-msg');
      var seg = form.querySelector('select');
      var value = (input.value || '').trim();

      if (!EMAIL.test(value)) {
        msg.textContent = 'That address does not look right. Please check it.';
        msg.classList.add('err');
        input.focus();
        return;
      }

      var list = [];
      try { list = JSON.parse(localStorage.getItem('pellar-waitlist') || '[]'); } catch (e) { list = []; }
      list.push({ email: value, segment: seg ? seg.value : '', at: new Date().toISOString() });
      try { localStorage.setItem('pellar-waitlist', JSON.stringify(list)); } catch (e) { /* ignore */ }

      msg.classList.remove('err');
      msg.textContent = 'Local preview only — this address was not sent. Connect the waitlist endpoint before launch.';
      input.value = '';
      if (seg) seg.selectedIndex = 0;
    });
  });
})();
