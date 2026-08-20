// ============================================
// MONO v2 — interactions
// ============================================

document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Preloader ---------- */
const preloader = document.getElementById('preloader');
const preloaderFill = document.getElementById('preloaderFill');
requestAnimationFrame(() => { preloaderFill.style.width = '100%'; });
window.addEventListener('load', () => {
  setTimeout(() => {
    preloader.classList.add('is-done');
    document.body.classList.remove('is-loading');
  }, 700);
});
/* safety fallback in case 'load' is slow/blocked */
setTimeout(() => {
  preloader.classList.add('is-done');
  document.body.classList.remove('is-loading');
}, 2200);

/* ---------- Mobile menu ---------- */
const burger = document.getElementById('navBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('is-open');
  burger.setAttribute('aria-expanded', String(isOpen));
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

/* ---------- Custom cursor (desktop) ---------- */
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if (isFinePointer) {
  let mx = 0, my = 0, rx = 0, ry = 0;
  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top = my + 'px';
  });
  document.querySelectorAll('a, button, .work-tile').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('is-active'));
  });
  function ringLoop(){
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(ringLoop);
  }
  ringLoop();
}

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

const revealClipEls = document.querySelectorAll('.work-tile');
revealClipEls.forEach(el => el.classList.add('reveal-clip'));
const clipObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('is-visible'), i * 90);
      clipObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
revealClipEls.forEach(el => clipObserver.observe(el));

/* ---------- Animated stat counters ---------- */
const statNums = document.querySelectorAll('.stat-num[data-count-to]');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.countTo, 10);
    const pad = parseInt(el.dataset.pad || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = Math.round(eased * target);
      el.textContent = String(val).padStart(pad, '0') + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    countObserver.unobserve(el);
  });
}, { threshold: 0.6 });
statNums.forEach(el => countObserver.observe(el));

/* ---------- Process progress line ---------- */
const processList = document.getElementById('processList');
const processLine = document.getElementById('processLine');
if (processList && processLine) {
  const lineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        processLine.style.height = processList.offsetHeight + 'px';
        lineObserver.unobserve(processList);
      }
    });
  }, { threshold: 0.25 });
  lineObserver.observe(processList);
}

/* ---------- Blob follows cursor slightly (parallax) ---------- */
const blobA = document.getElementById('blobA');
const blobB = document.getElementById('blobB');
if (isFinePointer && blobA && blobB) {
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('mousemove', (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 40;
    ty = (e.clientY / window.innerHeight - 0.5) * 40;
  });
  function loop() {
    cx += (tx - cx) * 0.05;
    cy += (ty - cy) * 0.05;
    blobA.style.marginLeft = cx + 'px';
    blobA.style.marginTop = cy + 'px';
    blobB.style.marginLeft = (-cx * 0.7) + 'px';
    blobB.style.marginTop = (-cy * 0.7) + 'px';
    requestAnimationFrame(loop);
  }
  loop();
}

/* ---------- Magnetic buttons ---------- */
if (isFinePointer) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* 3D tilt on service cards and work tiles */
  document.querySelectorAll('.stack-card-inner, .work-tile').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${py * -5}deg) rotateY(${px * 6}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
  });
}

/* ---------- Scroll parallax on hero blobs ---------- */
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.2) {
      blobA && (blobA.style.transform = `translateY(${y * 0.18}px)`);
      blobB && (blobB.style.transform = `translateY(${y * -0.12}px)`);
    }
  }, { passive: true });
}

/* ---------- Contact form (front-end only demo) ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('.submit-btn span');
  const original = btn.textContent;
  btn.textContent = 'Enviando…';
  setTimeout(() => {
    status.textContent = '¡Gracias! Recibimos tu mensaje y te responderemos pronto.';
    status.classList.add('is-success');
    btn.textContent = original;
    form.reset();
  }, 900);
});
