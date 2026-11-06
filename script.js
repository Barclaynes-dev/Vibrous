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
    '.pricing-section, .about, .services, .built-for, .why, .portfolio, .performance, .contact'
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

// ===== Nav Scroll Background =====
(function () {
  const nav = document.querySelector('.nav');
  const triggerSection = document.getElementById('pricing') || document.getElementById('offer');
  if (!nav || !triggerSection) return;

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        // Toggle background when pricing section reaches the nav
        if (triggerSection.getBoundingClientRect().top <= 80) {
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

// Pricing card parallax and tilt effects removed.

// ===== FAQ accordion =====
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all
      items.forEach((i) => {
        i.classList.remove('is-open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      // Open clicked (unless it was already open)
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

// ===== FAQ View more / Show less =====
(function () {
  const toggleBtn = document.getElementById('faq-toggle');
  const extra = document.querySelector('.faq-extra');
  const label = toggleBtn && toggleBtn.querySelector('.faq-toggle-label');
  if (!toggleBtn || !extra) return;

  // Wrap the direct children in one div so grid-template-rows animates correctly
  const inner = document.createElement('div');
  while (extra.firstChild) inner.appendChild(extra.firstChild);
  extra.appendChild(inner);

  toggleBtn.addEventListener('click', () => {
    const isOpen = extra.classList.contains('is-open');

    if (isOpen) {
      // Collapse — close any open extra items first
      extra.querySelectorAll('.faq-item.is-open').forEach((i) => {
        i.classList.remove('is-open');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      extra.classList.remove('is-open');
      extra.setAttribute('aria-hidden', 'true');
      toggleBtn.setAttribute('aria-expanded', 'false');
      label.textContent = 'View more';
    } else {
      extra.classList.add('is-open');
      extra.setAttribute('aria-hidden', 'false');
      toggleBtn.setAttribute('aria-expanded', 'true');
      label.textContent = 'Show less';
    }
  });
})();

// ===== About — Read more / Show less =====
(function () {
  const btn = document.getElementById('about-read-more');
  const panel = document.getElementById('about-more');
  const lbl = btn && btn.querySelector('.about-read-more-label');
  if (!btn || !panel) return;

  btn.addEventListener('click', () => {
    const isOpen = panel.classList.contains('is-open');

    if (isOpen) {
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      btn.setAttribute('aria-expanded', 'false');
      lbl.textContent = 'Read more';
    } else {
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
      btn.setAttribute('aria-expanded', 'true');
      lbl.textContent = 'Show less';
    }
  });
})();

// ===== Flip Text (ported from Vengence UI) =====
(function () {
  const DURATION  = 2.2;   // seconds — matches component default
  const DELAY     = 0;     // initial delay offset
  const LOOP      = true;
  const SEPARATOR = ' ';

  const targets = document.querySelectorAll('[data-flip-text]');
  if (!targets.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  targets.forEach((el) => {
    const text      = el.textContent.trim();
    const words     = text.split(SEPARATOR);
    const totalChars = text.length; // includes spaces in global index calculation

    // Build global char index — mirrors getCharIndex() in the React component
    const charGlobalIndex = [];
    let idx = 0;
    words.forEach((word, wi) => {
      for (let ci = 0; ci < word.length; ci++) {
        charGlobalIndex.push({ word: wi, char: ci, global: idx });
        idx++;
      }
      if (wi < words.length - 1) idx++; // account for the space separator
    });

    // Clear and rebuild DOM
    el.textContent = '';
    el.classList.add('flip-text-wrapper');

    let charPointer = 0;

    words.forEach((word, wi) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'word';

      word.split('').forEach((char) => {
        const globalIdx = charGlobalIndex[charPointer]?.global ?? 0;
        charPointer++;

        const normalised = globalIdx / totalChars;
        const sine       = Math.sin(normalised * (Math.PI / 2));
        const charDelay  = prefersReduced ? 0 : (sine * (DURATION * 0.25) + DELAY);

        const charSpan = document.createElement('span');
        charSpan.className = 'flip-char';
        charSpan.textContent = char;
        charSpan.style.setProperty('--flip-duration',  `${DURATION}s`);
        charSpan.style.setProperty('--flip-delay',     `${charDelay.toFixed(3)}s`);
        charSpan.style.setProperty('--flip-iteration', LOOP ? 'infinite' : '1');

        if (prefersReduced) {
          charSpan.style.animationName = 'none';
        }

        wordSpan.appendChild(charSpan);
      });

      el.appendChild(wordSpan);

      // Add space between words (except after last)
      if (wi < words.length - 1) {
        const space = document.createElement('span');
        space.className = 'whitespace';
        space.innerHTML = '&nbsp;';
        el.appendChild(space);
        charPointer++; // skip the space slot
      }
    });
  });
})();

// ===== Pricing Configuration & Dynamic Rendering =====
(function () {
  const PRICING = {
    plans: { starter: 350000, growth: 650000, business: 1200000 },
    whatsappNumber: "256758335971"
  };

  const formatPrice = (num) => {
    return Number(num).toLocaleString('en-US');
  };

  // Render prices from config
  const priceVals = document.querySelectorAll('.pricing-section .price-val[data-plan]');
  priceVals.forEach((val) => {
    const plan = val.getAttribute('data-plan');
    if (plan && PRICING.plans[plan] !== undefined) {
      val.textContent = formatPrice(PRICING.plans[plan]);
    }
  });

  // Build WhatsApp links from config
  const planNames = {
    starter: 'Starter plan',
    growth: 'Growth plan',
    business: 'Business plan'
  };

  const buttons = document.querySelectorAll('.pricing-section .pricing-btn[data-plan]');
  buttons.forEach((btn) => {
    const plan = btn.getAttribute('data-plan');
    const planName = planNames[plan] || 'Starter plan';
    const message = encodeURIComponent(`Hi Vibrous, I'm interested in the ${planName}.`).replace(/'/g, '%27');
    btn.href = `https://wa.me/${PRICING.whatsappNumber}?text=${message}`;
    btn.target = '_blank';
    btn.rel = 'noopener';
  });
})();


// ===== Performance Section — Lighthouse scores =====
(function () {
  // ----------------------------------------------------------------
  // CONFIG — fill in real Lighthouse mobile scores (0–100) and the
  // month/year they were measured, e.g. measured: "Nov 2026".
  // Leave any score as null (or measured as "") to keep the section
  // hidden until you have real data.
  // ----------------------------------------------------------------
  const LIGHTHOUSE = {
    performance:   null,
    accessibility: null,
    bestPractices: null,
    seo:           null,
    measured:      ""
  };
  // ----------------------------------------------------------------

  const section = document.getElementById('performance');
  if (!section) return;

  // Guard: hide section completely if any score is missing
  const scores = [LIGHTHOUSE.performance, LIGHTHOUSE.accessibility, LIGHTHOUSE.bestPractices, LIGHTHOUSE.seo];
  const allFilled = LIGHTHOUSE.measured.trim() !== '' && scores.every((s) => s !== null && !isNaN(s));
  if (!allFilled) {
    section.setAttribute('aria-hidden', 'true');
    return; // section stays display:none via CSS
  }

  // Show section
  section.classList.add('perf-ready');
  section.removeAttribute('aria-hidden');

  // Stamp measured date
  const measuredEl = section.querySelector('.perf-measured');
  if (measuredEl) measuredEl.textContent = LIGHTHOUSE.measured;

  // Ring geometry
  const R = 36; // radius of the arc
  const CIRCUMFERENCE = 2 * Math.PI * R; // ≈ 226.2

  // Ring color by score band
  function ringColor(score) {
    if (score >= 90) return '#C9A227';          // Signal Gold
    if (score >= 50) return '#3a3a3a';          // Dark neutral
    return '#b94040';                           // Muted red
  }

  // Build a score card element
  function makeCard(score, label) {
    const pct = Math.min(100, Math.max(0, score)) / 100;
    const dash = pct * CIRCUMFERENCE;
    const gap  = CIRCUMFERENCE - dash;
    const color = ringColor(score);

    const card = document.createElement('div');
    card.className = 'perf-card';
    card.setAttribute('role', 'img');
    card.setAttribute('aria-label', `${label} ${score} out of 100`);

    card.innerHTML = `
      <svg class="perf-ring" viewBox="0 0 88 88" aria-hidden="true" focusable="false">
        <circle class="perf-ring-track" cx="44" cy="44" r="${R}"/>
        <circle class="perf-ring-fill"
          cx="44" cy="44" r="${R}"
          stroke="${color}"
          stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
        />
        <text class="perf-ring-label" x="44" y="44">${score}</text>
      </svg>
      <span class="perf-score-label">${label}</span>`;

    return card;
  }

  const container = section.querySelector('#perf-cards');
  if (!container) return;

  const labels = ['Performance', 'Accessibility', 'Best Practices', 'SEO'];
  scores.forEach((score, i) => {
    container.appendChild(makeCard(score, labels[i]));
  });

  // Scroll-reveal the individual cards
  const cards = container.querySelectorAll('.perf-card');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    cards.forEach((c) => c.classList.add('is-visible'));
  } else {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    cards.forEach((c) => obs.observe(c));
  }
})();
