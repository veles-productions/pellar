/* Pellar sales page v4 — motion.
   Scrub-scroll is the page's signature move: it appears once as the hero
   mechanic and once as a background device, per the agreed skeleton. */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Theme toggle ─────────────────────────────────────────
     Dark is the default; light is a first-class mode, not an
     afterthought. Choice persists. */
  var stored = null;
  try { stored = localStorage.getItem('pellar-theme'); } catch (e) {}
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.setAttribute('data-theme', stored);
  }
  function markTheme() {
    var cur = document.documentElement.getAttribute('data-theme') || 'dark';
    Array.prototype.forEach.call(document.querySelectorAll('[data-theme-set]'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-theme-set') === cur);
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-theme-set]'), function (b) {
    b.addEventListener('click', function () {
      var next = b.getAttribute('data-theme-set');
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('pellar-theme', next); } catch (e) {}
      markTheme();
    });
  });
  markTheme();

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

  /* ── Hero scrub ───────────────────────────────────────────
     Scroll position drives the video's currentTime rather than
     playback driving itself. The rail on the right shows where
     you are in the clip — the same object as the transport bar
     inside the product, which is the point. */
  var video = document.getElementById('hero-video');
  var stage = document.getElementById('hero-safe');
  var thumb = document.getElementById('scrub-thumb');
  var duration = 0;
  var target = 0;
  var current = 0;
  var raf = null;

  function ready() {
    duration = video.duration;
    if (!isFinite(duration) || duration <= 0) return;
    onScroll();
  }

  function onScroll() {
    if (!duration || !stage) return;
    var rect = stage.getBoundingClientRect();
    var travel = rect.height + window.innerHeight;
    /* 0 when the stage top hits the viewport bottom, 1 when its bottom leaves the top */
    var p = (window.innerHeight - rect.top) / travel;
    p = Math.max(0, Math.min(1, p));
    target = p * duration;
    if (thumb) thumb.style.top = (p * 100).toFixed(2) + '%';
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function tick() {
    raf = null;
    /* ease toward the target so a fast flick reads as a scrub, not a jump */
    current += (target - current) * 0.18;
    if (Math.abs(target - current) < 0.008) current = target;
    try { video.currentTime = current; } catch (e) {}
    if (current !== target) raf = requestAnimationFrame(tick);
  }

  if (video) {
    if (reduce) {
      /* no scrub — just show a frame */
      video.addEventListener('loadeddata', function () { try { video.currentTime = 0.1; } catch (e) {} });
    } else {
      if (video.readyState >= 1) ready();
      video.addEventListener('loadedmetadata', ready);
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
    }
  }

  /* ── Lazy loops ───────────────────────────────────────────
     Background clips only run while they are on screen. A page
     about live production should not be the thing melting a laptop. */
  var lazies = document.querySelectorAll('video[data-lazy-play]');
  if ('IntersectionObserver' in window && !reduce) {
    var lo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target;
        if (en.isIntersecting) { v.play().catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: .2 });
    Array.prototype.forEach.call(lazies, function (v) { lo.observe(v); });
  }

  /* ── Nav: mark the section you are in ─────────────────── */
  var links = document.querySelectorAll('.nav-links a');
  var sections = [];
  Array.prototype.forEach.call(links, function (a) {
    var el = document.querySelector(a.getAttribute('href'));
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

  /* ── Panel: the transport bar advances so the UI reads as
        being used, not photographed (positive ref 10). ───── */
  var bar = document.querySelector('.transport .bar i');
  var tc  = document.querySelector('.transport .tc');
  if (bar && tc && !reduce) {
    var t = 0;
    setInterval(function () {
      t = (t + 1) % 300;                       /* 5:00 loop */
      bar.style.left = (4 + (t / 300) * 92) + '%';
      var m = String(Math.floor(t / 60)).padStart(2, '0');
      var s = String(t % 60).padStart(2, '0');
      tc.innerHTML = '00:' + m + ':' + s + ' <em>/ 00:05:00</em>';
    }, 1000);
  }
})();
