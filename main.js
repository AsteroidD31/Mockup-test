/* ============================================
   PIOZZA — Main JavaScript
   3D Animations, GSAP + ScrollTrigger, Lenis
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (!loadingScreen) return;

  const tl = gsap.timeline();
  tl.to('.loading-logo', {
    scale: 1.05,
    duration: 0.4,
    ease: 'power2.inOut',
    yoyo: true,
    repeat: 1,
  })
  .to(loadingScreen, {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.inOut',
    onComplete: () => {
      loadingScreen.style.display = 'none';
      document.body.style.overflow = '';
      lenis.start();
      initHeroAnimations();
    }
  }, '+=0.1');
}

// ============================================
// NAVBAR
// ============================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  // Scroll-based background
  lenis.on('scroll', ({ scroll }) => {
    if (scroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Also listen to native scroll for fallback
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }, { passive: true });

  // Mobile toggle
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Navbar entrance
  gsap.from('.nav-logo', { y: -20, opacity: 0, duration: 0.6, delay: 0.2, ease: 'power3.out' });
  gsap.from('.nav-link', { y: -15, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power3.out' });
  gsap.from('.nav-right', { y: -15, opacity: 0, duration: 0.5, delay: 0.4, ease: 'power3.out' });
}

// ============================================
// HERO — 3D FLOATING PIZZA
// ============================================
function initHeroAnimations() {
  // Pizza entrance: removed to make the pizza a static asset
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo('.hero-tag',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
    .fromTo('.hero-headline',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.4'
    )
    .fromTo('.hero-subheadline',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.4'
    )
    .fromTo('.hero-buttons',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.3'
    )
    .fromTo('.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      '-=0.2'
    );

  // Continuous 3D floating animation: removed to keep pizza static

  // Mouse-driven 3D tilt: removed to keep pizza static

  // Scroll-based parallax: called below but updated to exclude pizza
  initHeroScrollParallax();
}

function initPizza3DTilt() {
  // Empty function since mouse tilt is disabled for the static pizza
}

function initHeroScrollParallax() {
  // Scroll parallax for pizza image: removed to keep pizza static

  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
    y: -60,
    opacity: 0.2,
    ease: 'none',
  });

  gsap.to('.hero-scroll-indicator', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: '20% top',
      scrub: 1,
    },
    opacity: 0,
    y: -20,
    ease: 'none',
  });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollRevealAnimations() {
  // Set initial states
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 50 });
  });
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.set(el, { opacity: 0, x: -50 });
  });
  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.set(el, { opacity: 0, x: 50 });
  });

  // Animate to visible
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    });
  });
  gsap.utils.toArray('.reveal-left').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    });
  });
  gsap.utils.toArray('.reveal-right').forEach((el) => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
    });
  });
}

// ============================================
// MENU CARDS — STAGGER
// ============================================
function initMenuAnimations() {
  const cards = gsap.utils.toArray('.menu-card');
  gsap.set(cards, { opacity: 0, y: 80 });

  gsap.to(cards, {
    scrollTrigger: { trigger: '.menu-grid', start: 'top 85%', toggleActions: 'play none none none' },
    y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
  });
}

// ============================================
// COUNTER ANIMATION
// ============================================
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-count'), 10);
    const suffix = counter.getAttribute('data-suffix') || '';

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 90%',
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            counter.innerHTML = Math.floor(obj.val) + suffix;
          },
        });
      },
      once: true,
    });
  });
}

// ============================================
// ORDER CARDS
// ============================================
function initOrderAnimations() {
  const cards = gsap.utils.toArray('.platform-card');
  gsap.set(cards, { opacity: 0, y: 40, scale: 0.95 });

  gsap.to(cards, {
    scrollTrigger: { trigger: '.order-platforms', start: 'top 85%', toggleActions: 'play none none none' },
    y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out',
  });
}

// ============================================
// FOOTER
// ============================================
function initFooterAnimation() {
  const footerGrid = document.querySelector('.footer-grid');
  if (!footerGrid) return;
  gsap.set(footerGrid, { opacity: 0, y: 30 });
  gsap.to(footerGrid, {
    scrollTrigger: { trigger: '.footer', start: 'top 90%', toggleActions: 'play none none none' },
    y: 0, opacity: 1, duration: 0.7, ease: 'power3.out',
  });
}

// ============================================
// SMOOTH SCROLL ANCHORS
// ============================================
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      try {
        const targetEl = document.querySelector(href);
        if (targetEl) lenis.scrollTo(targetEl, { offset: -80 });
      } catch (err) {
        console.error('Smooth scroll failed for selector:', href, err);
      }
    });
  });
}

// ============================================
// REVIEWS SLIDER HOVER PAUSE
// ============================================
function initReviewsHover() {
  const container = document.querySelector('.reviews-slider-container');
  const track = document.getElementById('reviews-track');
  if (!container || !track) return;

  container.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });

  container.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.overflow = 'hidden';
  lenis.stop();

  initNavbar();
  initScrollRevealAnimations();
  initMenuAnimations();
  initCounterAnimations();
  initOrderAnimations();
  initFooterAnimation();
  initSmoothAnchors();
  initReviewsHover();
  initLoadingScreen();
});
