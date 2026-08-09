/* Hero-slideshow — wisselt de foto's in .hero-slides door.
   De eerste slide staat al in de HTML met een echte src; de rest wordt pas
   na window.load ingeladen, zodat de hero meteen zichtbaar is. */
(function () {
  'use strict';

  var INTERVAL = 6000;

  function init() {
    var container = document.querySelector('.hero-slides');
    if (!container) return;

    var slides = container.querySelectorAll('.hero-slides__img');
    if (slides.length < 2) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    function loadRest() {
      for (var i = 1; i < slides.length; i++) {
        var src = slides[i].getAttribute('data-src');
        if (src) {
          slides[i].setAttribute('src', src);
          slides[i].removeAttribute('data-src');
        }
      }
    }

    if (document.readyState === 'complete') {
      loadRest();
    } else {
      window.addEventListener('load', loadRest);
    }

    var current = 0;
    var timer = null;

    function advance() {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }

    function start() {
      if (timer === null) timer = window.setInterval(advance, INTERVAL);
    }

    function stop() {
      if (timer !== null) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop();
      else start();
    });

    start();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
