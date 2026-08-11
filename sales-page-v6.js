/* Pellar sales page v6 — motion and interaction.

   Notes for whoever picks this up:
   - Scroll motion is GSAP ScrollTrigger (vendored, no CDN). The house rule
     says GSAP, and it also buys correct teardown and refresh-on-resize.
   - The theme control is a switch (role="switch" + aria-checked), and its
     id is #theme-knob, NOT #theme. app.js binds a legacy class-based
     toggle to #theme; a different id is what stops the two fighting.
   - Scrub appears twice, which is what makes it the page's signature: the
     hero clip, and the orb. The orb one matters — the poll resolves out of
     it as you pass, so it reads as a graphic being placed rather than as
     AI magic generating something out of nothing.
*/
(function () {
  'use strict';

  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduce = mq.matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ── Theme ────────────────────────────────────────────── */
  var root = document.documentElement;
  var sw = document.getElementById('theme-knob');

  function applyTheme(next) {
    root.setAttribute('data-theme', next);
    if (sw) {
      sw.setAttribute('aria-checked', next === 'light' ? 'true' : 'false');
      sw.setAttribute('aria-label', next === 'light' ? 'Dark theme' : 'Light theme');
    }
    try { localStorage.setItem('pellar-theme', next); } catch (e) { /* private mode */ }
  }

  var stored = null;
  try { stored = localStorage.getItem('pellar-theme'); } catch (e) {}
  applyTheme(stored === 'light' ? 'light' : 'dark');

  if (sw) {
    sw.addEventListener('click', function () {
      applyTheme((root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── Reduced motion: animated WebP ignores the media query, so the
        only honest fix is to swap in the final-frame still. ── */
  function freezeGraphics() {
    Array.prototype.forEach.call(document.querySelectorAll('img[data-still]'), function (img) {
      var still = img.getAttribute('data-still');
      if (still && img.getAttribute('src') !== still) img.src = still;
    });
  }
  if (reduce) freezeGraphics();

  /* ── Reveal on scroll ─────────────────────────────────── */
  var risers = document.querySelectorAll('.rise');
  if (!('IntersectionObserver' in window) || reduce) {
    Array.prototype.forEach.call(risers, function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: .08 });
    Array.prototype.forEach.call(risers, function (el) { io.observe(el); });
  }

  /* ── Scrub helper ─────────────────────────────────────────
     Scroll drives currentTime instead of playback driving itself.
     Guarded three ways: no GSAP, no metadata, or a browser that refuses
     the seek all fall back to a single held frame. */
  function scrub(video, trigger, opts, onProgress) {
    if (!video || !trigger) return;

    var hold = function (t) {
      var set = function () { try { video.currentTime = t; } catch (e) {} };
      if (video.readyState >= 1) set();
      else video.addEventListener('loadedmetadata', set, { once: true });
    };

    if (reduce || !hasGsap) { hold(opts.restFrame || 0.1); return; }

    var broken = false;
    video.addEventListener('error', function () { broken = true; }, { once: true });

    var init = function () {
      var d = video.duration;
      if (!isFinite(d) || d <= 0 || broken) { hold(opts.restFrame || 0.1); return; }
      video.pause();
      ScrollTrigger.create({
        trigger: trigger,
        start: opts.start,
        end: opts.end,
        scrub: opts.scrub || 0.5,
        onUpdate: function (self) {
          var p = self.progress;
          /* Safari throws if the media is not seekable yet; a failed seek
             must not take the rest of the page down with it. */
          try { video.currentTime = p * (d - 0.05); } catch (e) {}
          if (onProgress) onProgress(p);
        }
      });
      ScrollTrigger.refresh();
    };

    if (video.readyState >= 1) init();
    else video.addEventListener('loadedmetadata', init, { once: true });
  }

  /* Hero: the clip runs as the frame crosses the viewport, and the rail
     on the right is the same object as the transport bar in the product. */
  var thumb = document.getElementById('scrub-thumb');
  scrub(
    document.getElementById('hero-video'),
    document.getElementById('hero-safe'),
    { start: 'top bottom', end: 'bottom top', scrub: 0.5 },
    function (p) { if (thumb) thumb.style.top = (p * 100).toFixed(2) + '%'; }
  );

  /* Orb: resolves the poll as you scroll past it. Ends before the section
     leaves the middle of the screen so it is fully formed while read.
     restFrame is the LAST frame, so a fallback shows the finished graphic
     rather than an empty hand. */
  var orb = document.getElementById('orb-video');
  if (orb) {
    scrub(orb, document.querySelector('.voice'),
      { start: 'top bottom', end: 'bottom 50%', scrub: 0.6, restFrame: 1e4 });
    /* clamp the fallback to the real duration once it is known */
    orb.addEventListener('loadedmetadata', function () {
      if ((reduce || !hasGsap) && orb.duration) {
        try { orb.currentTime = Math.max(0, orb.duration - 0.05); } catch (e) {}
      }
    }, { once: true });
  }

  /* ── Template console ─────────────────────────────────── */
  var TEMPLATES = {
    sport: {
      label: 'Sport / Match stats', plate: 'assets/backplates/stadium.jpg',
      out: 'assets/graphics/sport-matchstats-alpha.webp',
      still: 'assets/graphics/sport-matchstats.png',
      alt: 'Match statistics template animating with possession, shots and corners',
      say: '“Show the match stats.”'
    },
    markets: {
      label: 'Markets / Index strip', plate: 'assets/backplates/markets.jpg',
      out: 'assets/graphics/markets-bar-alpha.webp',
      still: 'assets/graphics/markets-bar.png',
      alt: 'Market movers strip animating with index values',
      say: '“Put the market move on screen.”'
    },
    affairs: {
      label: 'Current affairs / Results', plate: 'assets/proof/studio-floor.jpg',
      out: 'assets/graphics/affairs-election-alpha.webp',
      still: 'assets/graphics/affairs-election.png',
      alt: 'Election results template animating with party shares',
      say: '“Show the latest results.”'
    },
    esports: {
      label: 'Esports / Standings', plate: 'assets/backplates/gaming.jpg',
      out: 'assets/graphics/esports-standings-alpha.webp',
      still: 'assets/graphics/esports-standings.png',
      alt: 'Esports standings table animating with team positions',
      say: '“Bring up the standings.”'
    }
  };

  var tabs      = Array.prototype.slice.call(document.querySelectorAll('[data-template]'));
  var stagePane = document.getElementById('stage');
  var plate     = document.querySelector('[data-stage-plate]');
  var output    = document.querySelector('[data-stage-output]');
  var stageLbl  = document.querySelector('[data-stage-label]');
  var stageSay  = document.querySelector('[data-stage-command]');

  function selectTab(tab, focusIt) {
    var t = TEMPLATES[tab.getAttribute('data-template')];
    if (!t || !stagePane) return;

    tabs.forEach(function (item) {
      var on = item === tab;
      item.classList.toggle('active', on);
      item.setAttribute('aria-selected', on ? 'true' : 'false');
      item.tabIndex = on ? 0 : -1;
    });
    stagePane.setAttribute('aria-labelledby', tab.id);
    if (focusIt) tab.focus();

    var paint = function () {
      if (plate) plate.src = t.plate;
      if (output) {
        output.src = reduce ? t.still : t.out;
        output.setAttribute('data-still', t.still);
        output.alt = t.alt;
      }
      if (stageLbl) stageLbl.textContent = t.label;
      if (stageSay) stageSay.textContent = t.say;
    };

    if (reduce) { paint(); return; }
    stagePane.classList.add('swapping');
    window.setTimeout(function () {
      paint();
      stagePane.classList.remove('swapping');
    }, 200);
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { selectTab(tab, false); });
    tab.addEventListener('keydown', function (ev) {
      var next = null;
      if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
      else if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
      else if (ev.key === 'Home') next = tabs[0];
      else if (ev.key === 'End') next = tabs[tabs.length - 1];
      if (!next) return;
      ev.preventDefault();
      selectTab(next, true);
    });
  });

  /* ── Nav: mark the section you are in ─────────────────── */
  var sections = [];
  Array.prototype.forEach.call(document.querySelectorAll('.nav-links a'), function (a) {
    var href = a.getAttribute('href');
    var el = href && href.charAt(0) === '#' ? document.querySelector(href) : null;
    if (el) sections.push({ a: a, el: el });
  });
  if (sections.length && 'IntersectionObserver' in window) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        sections.forEach(function (s) { s.a.classList.toggle('on', s.el === en.target); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { so.observe(s.el); });
  }

  /* ── The key lights a beat after it is pressed, like a console
        button confirming the command. app.js does this for .btn-primary,
        which this build no longer uses. ───────────────────── */
  document.addEventListener('click', function (e) {
    var k = e.target.closest ? e.target.closest('.key') : null;
    if (!k) return;
    k.classList.add('is-lit');
    window.setTimeout(function () { k.classList.remove('is-lit'); }, 420);
  });

  /* ── Panel preview scrubber ticks so the UI reads as being used.
        PREVIEW only — nothing here implies playout. ───────── */
  var bar = document.querySelector('.transport .bar i');
  var tc  = document.querySelector('.transport .tc');
  if (bar && tc && !reduce) {
    var t = 0;
    window.setInterval(function () {
      t = (t + 1) % 300;
      bar.style.left = (4 + (t / 300) * 92) + '%';
      var m = String(Math.floor(t / 60)); while (m.length < 2) m = '0' + m;
      var s = String(t % 60);              while (s.length < 2) s = '0' + s;
      tc.innerHTML = '00:' + m + ':' + s + ' <em>/ 00:05:00</em>';
    }, 1000);
  }

  /* If the viewer turns reduced motion on mid-session, respect it. */
  var onPrefChange = function () {
    reduce = mq.matches;
    if (reduce) {
      freezeGraphics();
      if (hasGsap) ScrollTrigger.getAll().forEach(function (st) { st.kill(); });
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', onPrefChange);
  else if (mq.addListener) mq.addListener(onPrefChange);
})();
