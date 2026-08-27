// ===== Word cycler =====
(function () {
  const words = document.querySelectorAll('.cycler-word');
  if (!words.length) return;
  let i = 0;
  setInterval(() => {
    words[i].classList.remove('is-active');
    i = (i + 1) % words.length;
    words[i].classList.add('is-active');
  }, 2600);
})();

// ===== Scroll reveal (IntersectionObserver, cheap) =====
(function () {
  const targets = document.querySelectorAll(
    '.offer, .about, .services, .why, .portfolio, .contact'
  );
  targets.forEach((el) => el.classList.add('reveal'));

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
})();

// ===== Lightweight parallax on hero blobs (transform only, throttled) =====
(function () {
  const blobA = document.querySelector('.blob-a');
  const blobB = document.querySelector('.blob-b');
  if (!blobA || !blobB) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        // Only animate while hero is roughly in view — cheap guard
        if (y < window.innerHeight * 1.2) {
          blobA.style.transform = `translate3d(0, ${y * 0.15}px, 0)`;
          blobB.style.transform = `translate3d(0, ${y * -0.1}px, 0)`;
        }
        ticking = false;
      });
    },
    { passive: true }
  );
})();

// ===== Mobile drawer navigation =====
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const links = document.querySelectorAll('.drawer-link, .drawer-cta-btn');

  if (!toggle || !drawer || !overlay) return;

  function toggleDrawer() {
    const isActive = drawer.classList.toggle('is-active');
    toggle.classList.toggle('is-active');
    overlay.classList.toggle('is-active');
    document.body.style.overflow = isActive ? 'hidden' : '';
    document.body.classList.toggle('drawer-open', isActive);
  }

  function closeDrawer() {
    drawer.classList.remove('is-active');
    toggle.classList.remove('is-active');
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
    document.body.classList.remove('drawer-open');
  }

  toggle.addEventListener('click', toggleDrawer);
  overlay.addEventListener('click', closeDrawer);
  links.forEach(link => link.addEventListener('click', closeDrawer));
})();

// ===== Mobile Nav Scroll Background =====
(function () {
  const nav = document.querySelector('.nav');
  const offerSection = document.getElementById('offer');
  if (!nav || !offerSection) return;

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Toggle background when offer section reaches the nav
        if (offerSection.getBoundingClientRect().top <= 80) {
          nav.classList.add('nav-scrolled');
        } else {
          nav.classList.remove('nav-scrolled');
        }
        ticking = false;
      });
    },
    { passive: true }
  );
})();

// ===== WhatsApp FAB — show only after hero leaves viewport =====
(function () {
  const fab = document.getElementById('whatsapp-fab');
  const hero = document.getElementById('hero');
  if (!fab || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // hero is intersecting  → user is in/near hero → hide FAB
      // hero NOT intersecting → hero has scrolled away  → show FAB
      if (entry.isIntersecting) {
        fab.classList.remove('is-visible');
      } else {
        fab.classList.add('is-visible');
      }
    },
    {
      // Fire as soon as any part of the hero enters or leaves the viewport
      threshold: 0
    }
  );

  observer.observe(hero);
})();

// ===== Launch Reel — lazy-loaded looping video =====
(function () {
  const section = document.getElementById('launch-reel');
  const video = document.getElementById('launch-reel-video');
  if (!section || !video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let sourceLoaded = false;

  function loadSource() {
    if (sourceLoaded) return;
    sourceLoaded = true;
    video.src = 'assets/video/vibrous_launch.mp4';
    video.load();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadSource();
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0 }
  );

  observer.observe(section);
})();

// ===== Showcase Reel — lazy-loaded looping video =====
(function () {
  const section = document.getElementById('showcase-reel');
  const video = document.getElementById('showcase-reel-video');
  if (!section || !video) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let sourceLoaded = false;

  function loadSource() {
    if (sourceLoaded) return;
    sourceLoaded = true;
    video.src = 'assets/video/showcase_reel.mp4';
    video.load();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadSource();
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { rootMargin: '200px 0px', threshold: 0 }
  );

  observer.observe(section);
})();

// ===== Offer Heading Parallax Scroll (Optimized — No Layout Thrashing) =====
(function () {
  const offerSection = document.getElementById('offer');
  if (!offerSection) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  // Cache dimensions to prevent layout recalculations (thrashing) inside the scroll handler
  let offerOffsetTop = 0;
  let offerHeight = 0;
  let viewportHeight = window.innerHeight;

  function updateDimensions() {
    offerOffsetTop = offerSection.offsetTop;
    offerHeight = offerSection.offsetHeight;
    viewportHeight = window.innerHeight;
  }

  // Calculate once fonts/images are ready
  window.addEventListener('load', updateDimensions);
  window.addEventListener('resize', updateDimensions, { passive: true });
  updateDimensions(); // Initial baseline

  let ticking = false;

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // Check if the section is within the viewport range
        if (scrollY + viewportHeight > offerOffsetTop && scrollY < offerOffsetTop + offerHeight) {
          const relativeScroll = scrollY - (offerOffsetTop - viewportHeight);
          const range = offerHeight + viewportHeight;
          const progress = relativeScroll / range;
          const centerProgress = progress - 0.5;

          const shiftValue = centerProgress * 150;

          offerSection.style.setProperty('--scroll-shift-left', `${-shiftValue}px`);
          offerSection.style.setProperty('--scroll-shift-right', `${shiftValue}px`);
        }
        ticking = false;
      });
    },
    { passive: true }
  );
})();


