/* ═══════════════════════════════════════
   CYBERSAFE — script.js
═══════════════════════════════════════ */

// ── AOS Init ──
AOS.init({
  duration: 700,
  easing: 'ease-out-cubic',
  once: true,
  offset: 60
});

// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Hamburger ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── Counter animation ──
function animateCount(el, end, duration = 1800) {
  const start = 0;
  const range = end - start;
  const startTime = performance.now();

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = start + range * ease;

    // Format number
    if (end >= 1000) {
      el.textContent = Math.floor(current).toLocaleString();
    } else if (end % 1 !== 0) {
      el.textContent = current.toFixed(1);
    } else {
      el.textContent = Math.floor(current);
    }

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = end % 1 !== 0 ? end : end.toLocaleString();
  }
  requestAnimationFrame(update);
}

// Trigger counters on scroll into view
const counters = document.querySelectorAll('.stat-num');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = '1';
      const val = parseFloat(entry.target.dataset.count);
      animateCount(entry.target, val);
    }
  });
}, { threshold: 0.4 });
counters.forEach(c => counterObserver.observe(c));

// ── Pricing toggle ──
const toggle = document.getElementById('billingToggle');
const amountEls = document.querySelectorAll('.plan-price .amount');

toggle.addEventListener('change', () => {
  const isAnnual = toggle.checked;
  amountEls.forEach(el => {
    const target = parseFloat(isAnnual ? el.dataset.annual : el.dataset.monthly);
    animateCount(el, target, 400);
  });
  document.getElementById('lblMonthly').style.color = isAnnual ? 'var(--text-muted)' : 'var(--white)';
  document.getElementById('lblAnnual').style.color = isAnnual ? 'var(--white)' : 'var(--text-muted)';
});

// ── Contact form ──
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const txt = document.getElementById('submitText');
  const success = document.getElementById('formSuccess');

  txt.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    txt.textContent = 'Send Message';
    btn.disabled = false;
    success.classList.remove('hidden');
    e.target.reset();
    setTimeout(() => success.classList.add('hidden'), 5000);
  }, 1200);
}

// ── Feature bar animation ──
const bars = document.querySelectorAll('.feat-bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.style.width; // trigger repaint
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
bars.forEach(b => {
  const orig = b.style.width;
  b.style.width = '0';
  setTimeout(() => {
    barObserver.observe(b);
    b.style.width = orig;
  }, 300);
});

// ── Smooth close mobile on resize ──
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) mobileMenu.classList.remove('open');
});