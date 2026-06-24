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
  gsap.from('.nav-link, .nav-cta', { y: -15, opacity: 0, duration: 0.5, stagger: 0.08, delay: 0.3, ease: 'power3.out' });
}

// ============================================
// HERO — 3D FLOATING PIZZA
// ============================================
function initHeroAnimations() {
  const pizza = document.getElementById('hero-pizza-img');
  const wrapper = document.getElementById('hero-pizza-wrapper');

  // Pizza entrance: scale up from small, rotate in from angle, fade in
  const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl
    .fromTo(pizza,
      { scale: 0.6, rotateX: 25, rotateZ: -15, opacity: 0, y: 80 },
      { scale: 1, rotateX: 8, rotateZ: -5, opacity: 1, y: 0, duration: 1.4, ease: 'power2.out' }
    )
    .fromTo('.hero-tag',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 },
      '-=0.9'
    )
    .fromTo('.hero-headline',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
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

  // Continuous 3D floating animation
  gsap.to(pizza, {
    y: -18,
    rotateX: 10,
    rotateZ: -3,
    duration: 3.5,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    delay: 1.5,
  });

  // Mouse-driven 3D tilt
  initPizza3DTilt();

  // Scroll-based parallax
  initHeroScrollParallax();
}

function initPizza3DTilt() {
  const wrapper = document.getElementById('hero-pizza-wrapper');
  const hero = document.getElementById('hero');
  if (!wrapper || !hero) return;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(wrapper, {
      rotateY: x * 8,
      rotateX: -y * 8,
      duration: 0.8,
      ease: 'power2.out',
      transformPerspective: 1200,
    });
  });

  hero.addEventListener('mouseleave', () => {
    gsap.to(wrapper, {
      rotateY: 0,
      rotateX: 0,
      duration: 1,
      ease: 'power2.out',
    });
  });
}

function initHeroScrollParallax() {
  gsap.to('#hero-pizza-img', {
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
    scale: 1.2,
    rotateX: 15,
    rotateZ: 5,
    y: -60,
    ease: 'none',
  });

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
      e.preventDefault();
      const targetEl = document.querySelector(anchor.getAttribute('href'));
      if (targetEl) lenis.scrollTo(targetEl, { offset: -80 });
    });
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
  initLoadingScreen();
});
