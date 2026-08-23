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
