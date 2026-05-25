/**
 * MysoftNexus — main.js
 * Lightweight vanilla JS: header scroll, mobile nav, intersection observer animations
 */

(function () {
  'use strict';

  /* ============================================================
     HEADER SCROLL EFFECT
     ============================================================ */
  const header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      navLinks.classList.toggle('is-open', !expanded);

      // Animate hamburger → X
      const spans = this.querySelectorAll('span');
      if (!expanded) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }


  /* ============================================================
     INTERSECTION OBSERVER — SCROLL REVEAL
     ============================================================ */
  const revealTargets = document.querySelectorAll(
    '.arch-card, .auto-card, .module-card, .ps-item, .trust-item, .ps-column'
  );

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el, i) {
      // Stagger cards within same parent
      el.style.transitionDelay = (i % 4) * 0.07 + 's';
      el.classList.add('reveal-ready');
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    revealTargets.forEach(function (el) {
      el.classList.add('revealed');
    });
  }


  /* ============================================================
     SMOOTH SCROLL FOR ANCHOR LINKS
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(getComputedStyle(document.documentElement)
          .getPropertyValue('--header-h'), 10) || 68;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 16;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ============================================================
     ACTIVE NAV LINK ON SCROLL
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.remove('nav-link--active');
            if (a.getAttribute('href') === '#' + entry.target.id) {
              a.classList.add('nav-link--active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach(function (s) { sectionObserver.observe(s); });

})();
