(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll('img[data-still]').forEach(function (image) {
      image.src = image.getAttribute('data-still');
    });
  }

  var commands = ['"Put the poll up."', '"Show the latest standings."', '"Update the score to two-one."'];
  var commandIndex = 0;
  var commandNode = document.querySelector('[data-command]');
  if (commandNode && !reduced) {
    window.setInterval(function () {
      commandIndex = (commandIndex + 1) % commands.length;
      commandNode.style.opacity = '0';
      window.setTimeout(function () {
        commandNode.textContent = commands[commandIndex];
        commandNode.style.opacity = '1';
      }, 180);
    }, 4200);
  }

  var templates = {
    sport: { label: 'Sport / Match stats', plate: 'assets/backplates/stadium.jpg', output: 'assets/graphics/sport-matchstats-alpha.webp', alt: 'Animated match statistics template', command: '"Show the match stats."' },
    markets: { label: 'Markets / Index strip', plate: 'assets/backplates/markets.jpg', output: 'assets/graphics/markets-bar-alpha.webp', alt: 'Animated market index strip', command: '"Put the market move on screen."' },
    affairs: { label: 'Current affairs / Results', plate: 'assets/backplates/homestudio.jpg', output: 'assets/graphics/affairs-election-alpha.webp', alt: 'Animated election results template', command: '"Show the latest results."' },
    esports: { label: 'Esports / Standings', plate: 'assets/backplates/gaming.jpg', output: 'assets/graphics/esports-standings-alpha.webp', alt: 'Animated esports standings template', command: '"Bring up the standings."' }
  };

  var tabs = Array.prototype.slice.call(document.querySelectorAll('[data-template]'));
  var plate = document.querySelector('[data-stage-plate]');
  var output = document.querySelector('[data-stage-output]');
  var label = document.querySelector('[data-stage-label]');
  var stageCommand = document.querySelector('[data-stage-command]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var selected = templates[tab.getAttribute('data-template')];
      if (!selected) return;
      tabs.forEach(function (item) { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      plate.src = selected.plate;
      output.src = selected.output;
      output.alt = selected.alt;
      label.textContent = selected.label;
      stageCommand.textContent = selected.command;
    });
  });

  /* Waitlist — live.
     Posts to the n8n webhook ("Pellar Waitlist Capture" on n8n.moonacle.com),
     which validates the address and runs the double opt-in. This form used to
     be a preview stub that printed a message and threw the address away. */
  var ENDPOINT = 'https://n8n.moonacle.com/webhook/pellar-waitlist';
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var accessForm = document.querySelector('[data-preview-form]');
  if (accessForm) {
    accessForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = accessForm.querySelector('input[type=email]');
      var select = accessForm.querySelector('select');
      var button = accessForm.querySelector('button[type=submit]');
      var status = accessForm.querySelector('.form-status');
      var value = (input.value || '').trim();

      if (!EMAIL.test(value)) {
        status.textContent = 'That address does not look right. Please check it.';
        status.classList.add('err');
        input.focus();
        return;
      }

      button.disabled = true;
      status.classList.remove('err');
      status.textContent = 'Adding you...';

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: value,
          segment: select ? select.value : '',
          page: location.pathname
        })
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        status.textContent = 'Check your inbox - confirm the link and you are on the list.';
        input.value = '';
        if (select) select.selectedIndex = 0;
      }).catch(function () {
        status.classList.add('err');
        status.textContent = 'That did not go through. Please try again in a minute.';
      }).finally(function () {
        button.disabled = false;
      });
    });
  }

  /* Theme. Dark is the default; the choice persists. v3 shipped without a
     toggle - the light palette is a real override block in the stylesheet,
     not a filter inversion. */
  var root = document.documentElement;
  var storedTheme = null;
  try { storedTheme = localStorage.getItem('pellar-theme'); } catch (e) {}
  if (storedTheme === 'light') root.classList.add('light');

  var themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    var syncTheme = function () {
      var isLight = root.classList.contains('light');
      themeBtn.setAttribute('aria-checked', isLight ? 'true' : 'false');
      themeBtn.setAttribute('aria-label', isLight ? 'Dark theme' : 'Light theme');
    };
    syncTheme();
    themeBtn.addEventListener('click', function () {
      root.classList.toggle('light');
      try { localStorage.setItem('pellar-theme', root.classList.contains('light') ? 'light' : 'dark'); } catch (e) {}
      syncTheme();
    });
  }

  var scrubVideos = Array.prototype.slice.call(document.querySelectorAll('[data-scrub-video]'));
  var scrubTicking = false;
  function updateScrubVideos() {
    scrubTicking = false;
    if (reduced || !scrubVideos.length) return;
    scrubVideos.forEach(function (video) {
      if (!video.duration || !video.parentElement) return;
      var rect = video.parentElement.getBoundingClientRect();
      var travel = window.innerHeight + rect.height;
      if (travel <= 0) return;
      var raw = (window.innerHeight - rect.top) / travel;
      // A band trims the head and tail of the travel so the clip plays out while
      // the element is actually on screen, not while it is half off the viewport.
      var band = parseFloat(video.getAttribute('data-scrub-band')) || 0;
      if (band > 0 && band < 0.5) raw = (raw - band) / (1 - 2 * band);
      var target = Math.min(1, Math.max(0, raw)) * video.duration;
      if (Math.abs(video.currentTime - target) > 0.01) video.currentTime = target;
    });
  }
  function requestScrubUpdate() {
    if (scrubTicking) return;
    scrubTicking = true;
    window.requestAnimationFrame(updateScrubVideos);
  }
  scrubVideos.forEach(function (video) {
    video.addEventListener('loadedmetadata', updateScrubVideos);
  });
  window.addEventListener('scroll', requestScrubUpdate, { passive: true });
  window.addEventListener('resize', requestScrubUpdate);
  updateScrubVideos();
}());
