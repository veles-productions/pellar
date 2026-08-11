/* Pellar sales page v8 — motion and interaction.

   - Scroll motion is GSAP ScrollTrigger (vendored, no CDN).
   - The theme control is #theme-knob, NOT #theme: app.js binds a legacy
     class-based toggle to #theme and a different id keeps them apart.
   - Scrub runs twice — the hero machine's scene is static on purpose, and
     the orb is the big one. The orb resolving as you pass it is the thing
     that stops the page reading as AI-magic generation.
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
    try { localStorage.setItem('pellar-theme', next); } catch (e) {}
  }
  var stored = null;
  try { stored = localStorage.getItem('pellar-theme'); } catch (e) {}
  applyTheme(stored === 'light' ? 'light' : 'dark');
  if (sw) {
    sw.addEventListener('click', function () {
      applyTheme((root.getAttribute('data-theme') || 'dark') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── Reduced motion: animated WebP ignores the media query, so swap
        in the final-frame still. ─────────────────────────── */
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

  /* ── The orb scrub ────────────────────────────────────────
     Scroll drives currentTime. Guarded three ways: no GSAP, no metadata,
     or a browser that refuses the seek all fall back to the finished
     frame — never to an empty hand. */
  var orb = document.getElementById('orb-video');
  if (orb) {
    var restAtEnd = function () {
      var set = function () {
        if (orb.duration) { try { orb.currentTime = Math.max(0, orb.duration - 0.05); } catch (e) {} }
      };
      if (orb.readyState >= 1) set();
      else orb.addEventListener('loadedmetadata', set, { once: true });
    };

    if (reduce || !hasGsap) {
      restAtEnd();
    } else {
      var broken = false;
      orb.addEventListener('error', function () { broken = true; restAtEnd(); }, { once: true });

      var initOrb = function () {
        var d = orb.duration;
        if (!isFinite(d) || d <= 0 || broken) { restAtEnd(); return; }
        orb.pause();
        ScrollTrigger.create({
          trigger: '.voice',
          start: 'top bottom',
          end: 'bottom 55%',
          scrub: 0.6,
          onUpdate: function (self) {
            try { orb.currentTime = self.progress * (d - 0.05); } catch (e) {}
          }
        });
        ScrollTrigger.refresh();
      };
      if (orb.readyState >= 1) initOrb();
      else orb.addEventListener('loadedmetadata', initOrb, { once: true });
    }
  }

  /* ── Hero machine: the heard command cycles, and the timecode runs.
        Both exist so the machine reads as switched on rather than
        photographed. ─────────────────────────────────────── */
  var COMMANDS = [
    '“Show the match stats.”',
    '“Put the results up.”',
    '“Update the score to two–one.”'
  ];
  var cmd = document.querySelector('[data-command]');
  if (cmd && !reduce) {
    var ci = 0;
    window.setInterval(function () {
      ci = (ci + 1) % COMMANDS.length;
      cmd.style.opacity = '0';
      window.setTimeout(function () {
        cmd.textContent = COMMANDS[ci];
        cmd.style.opacity = '1';
      }, 190);
    }, 4200);
  }

  var mtc = document.getElementById('machine-tc');
  if (mtc && !reduce) {
    var f = 8, s = 17, m = 42, h = 0;
    window.setInterval(function () {
      f += 1;
      if (f > 24) { f = 0; s += 1; }
      if (s > 59) { s = 0; m += 1; }
      if (m > 59) { m = 0; h += 1; }
      var p = function (n) { return n < 10 ? '0' + n : '' + n; };
      mtc.textContent = p(h) + ':' + p(m) + ':' + p(s) + ':' + p(f);
    }, 40);
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

  /* ── The key lights a beat after it is pressed ─────────── */
  document.addEventListener('click', function (e) {
    var k = e.target.closest ? e.target.closest('.key') : null;
    if (!k) return;
    k.classList.add('is-lit');
    window.setTimeout(function () { k.classList.remove('is-lit'); }, 420);
  });

  /* ── Panel preview scrubber. PREVIEW only — playout does not exist. */
  var bar = document.querySelector('.transport .bar i');
  var tc  = document.querySelector('.transport .tc');
  if (bar && tc && !reduce) {
    var t = 0;
    window.setInterval(function () {
      t = (t + 1) % 300;
      bar.style.left = (4 + (t / 300) * 92) + '%';
      var mm = String(Math.floor(t / 60)); while (mm.length < 2) mm = '0' + mm;
      var ss = String(t % 60);             while (ss.length < 2) ss = '0' + ss;
      tc.innerHTML = '00:' + mm + ':' + ss + ' <em>/ 00:05:00</em>';
    }, 1000);
  }

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
