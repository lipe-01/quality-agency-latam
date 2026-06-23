// ===========================================================
// QUALITY AGENCY LATAM — Interactions
// ===========================================================

document.addEventListener('DOMContentLoaded', function () {

  // -----------------------------------------------------------
  // Current year in footer
  // -----------------------------------------------------------
  var yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -----------------------------------------------------------
  // Mobile nav toggle
  // -----------------------------------------------------------
  var navToggle = document.getElementById('navToggle');
  var mainNav = document.querySelector('.main-nav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = mainNav.classList.toggle('main-nav--open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when a nav link is clicked
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('main-nav--open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // -----------------------------------------------------------
  // Portfolio carousel — auto-scroll + click to open full size
  // (currently placeholder slides; will activate fully once
  // real portfolio images are added with data-full attributes)
  // -----------------------------------------------------------
  var track = document.querySelector('.portfolio__track');
  if (track) {
    var scrollAmount = 1;
    var autoScrollId;

    function startAutoScroll() {
      autoScrollId = setInterval(function () {
        if (track.scrollWidth - track.clientWidth <= track.scrollLeft) {
          track.scrollLeft = 0;
        } else {
          track.scrollLeft += scrollAmount;
        }
      }, 30);
    }

    startAutoScroll();

    // Pause on hover/focus for accessibility, resume on leave
    track.addEventListener('mouseenter', function () { clearInterval(autoScrollId); });
    track.addEventListener('mouseleave', function () { startAutoScroll(); });

    // Click any slide with a real image (data-full) to open full-size in a new tab
    track.addEventListener('click', function (e) {
      var slide = e.target.closest('.portfolio__slide');
      if (slide && slide.dataset.full) {
        window.open(slide.dataset.full, '_blank', 'noopener');
      }
    });
  }

  // -----------------------------------------------------------
  // Time zone converter
  // Business hours base: Mon–Fri, 07:00–19:00 Brasília (GMT-3)
  // -----------------------------------------------------------
  var tzSelect = document.getElementById('tzSelect');
  var tzResult = document.getElementById('tzResult');

  function formatHour(h) {
    h = ((h % 24) + 24) % 24;
    var period = h >= 12 ? 'PM' : 'AM';
    var displayH = h % 12;
    if (displayH === 0) displayH = 12;
    return displayH + ':00 ' + period;
  }

  function updateTimezoneDisplay() {
    if (!tzSelect || !tzResult) return;
    var targetOffset = parseFloat(tzSelect.value);
    var baseOffset = -3; // Brasília
    var diff = targetOffset - baseOffset;

    var startHour = 7 + diff;
    var endHour = 19 + diff;

    var dayNote = '';
    if (startHour < 0 || startHour >= 24) dayNote = ' (previous/next day may apply)';

    tzResult.textContent =
      'Our business hours (Mon–Fri) in your time zone: ' +
      formatHour(startHour) + ' – ' + formatHour(endHour) + dayNote;
  }

  if (tzSelect) {
    tzSelect.addEventListener('change', updateTimezoneDisplay);
    updateTimezoneDisplay();
  }

  // -----------------------------------------------------------
  // Language buttons — connected to Weglot's real translation API
  // Current free-plan language: German (DE)
  // -----------------------------------------------------------
  var langButtons = document.querySelectorAll('.lang-btn');
  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      langButtons.forEach(function (b) { b.classList.remove('lang-btn--active'); });
      btn.classList.add('lang-btn--active');

      var lang = btn.dataset.lang;
      // Weglot.switchTo() is provided by the Weglot script loaded in <head>.
      // It only works once a real api_key has been added there.
      if (window.Weglot && typeof window.Weglot.switchTo === 'function') {
        window.Weglot.switchTo(lang);
      }
    });
  });

  // -----------------------------------------------------------
  // Contact form — submit via fetch to Formspree, show inline
  // success message instead of redirecting away from the site
  // -----------------------------------------------------------
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            contactForm.innerHTML =
              '<p class="form-success">Thank you — your request has been received. ' +
              'We reply during business hours: Monday to Friday, 7:00 AM – 7:00 PM (Brasília time).</p>';
          } else {
            if (btn) { btn.textContent = originalText; btn.disabled = false; }
            alert('Something went wrong sending your request. Please try again or contact us directly via WhatsApp.');
          }
        })
        .catch(function () {
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
          alert('Something went wrong sending your request. Please try again or contact us directly via WhatsApp.');
        });
    });
  }

  // -----------------------------------------------------------
  // Opinion form — same fetch-based approach, inline confirmation
  // -----------------------------------------------------------
  var opinionForm = document.getElementById('opinionForm');
  if (opinionForm) {
    opinionForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = opinionForm.querySelector('button[type="submit"]');
      var originalText = btn ? btn.textContent : '';
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }

      fetch(opinionForm.action, {
        method: 'POST',
        body: new FormData(opinionForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            opinionForm.innerHTML =
              '<p class="form-success">Thank you! Your opinion has been submitted and will appear once reviewed by our team.</p>';
          } else {
            if (btn) { btn.textContent = originalText; btn.disabled = false; }
            alert('Something went wrong submitting your opinion. Please try again.');
          }
        })
        .catch(function () {
          if (btn) { btn.textContent = originalText; btn.disabled = false; }
          alert('Something went wrong submitting your opinion. Please try again.');
        });
    });
  }

});
