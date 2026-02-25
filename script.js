/**
 * Shapoorji Vyomora – Hinjawadi Phase 1
 * script.js — Interactions, Animations, Validation
 */

'use strict';

/* =============================================
   1. NAVBAR — scroll shrink + active links
   ============================================= */
const mainNav = document.getElementById('mainNav');
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  mainNav.classList.toggle('scrolled', scrollY > 60);
  backToTopBtn.classList.toggle('show', scrollY > 400);
}, { passive: true });

/* Animate hero background subtle zoom-in */
const heroBg = document.querySelector('.hero-bg');
if (heroBg) {
  setTimeout(() => { heroBg.style.transform = 'scale(1)'; }, 100);
}

/* =============================================
   2. BACK TO TOP
   ============================================= */
backToTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =============================================
   3. SMOOTH SCROLL — anchor links
   ============================================= */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    const target = document.querySelector(href);
    if (!target || href === '#') return;

    e.preventDefault();

    // Close mobile menu if open
    const navCollapse = document.getElementById('navMenu');
    const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
    if (bsCollapse && navCollapse.classList.contains('show')) {
      bsCollapse.hide();
    }

    const navH = mainNav?.offsetHeight ?? 70;
    const y = target.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top: y, behavior: 'smooth' });
  });
});

/* =============================================
   4. INTERSECTION OBSERVER — fade-in animations
   ============================================= */
const animTargets = document.querySelectorAll(
  '.hl-card, .pc-card, .g-item, .about-mini, .about-collage, ' +
  '.contact-form-card, .contact-info-side, .eoi-img-wrap, .eoi-amounts, ' +
  '.pricing-banner, .footer-mini-img, .loc-adv-card, .loc-info-card, .map-wrap'
);

animTargets.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 55);
      obs.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -55px 0px', threshold: 0.08 });

animTargets.forEach(el => observer.observe(el));

/* =============================================
   5. ACTIVE NAV HIGHLIGHT on scroll
   ============================================= */
const navLinks  = document.querySelectorAll('#navMenu .nav-link');
const sections  = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navLinks.forEach(lnk => {
        lnk.classList.toggle('active', lnk.getAttribute('href') === `#${id}`);
      });
    }
  });
}, { rootMargin: '-38% 0px -57% 0px' });

sections.forEach(s => navObserver.observe(s));

/* =============================================
   6. FORM VALIDATION & SUBMIT
   ============================================= */
const enquiryForm = document.getElementById('enquiryForm');
const formSuccess  = document.getElementById('formSuccess');
const submitBtn    = document.getElementById('submitBtn');

enquiryForm?.addEventListener('submit', function (e) {
  e.preventDefault();
  e.stopPropagation();

  if (!enquiryForm.checkValidity()) {
    enquiryForm.classList.add('was-validated');
    const firstInvalid = enquiryForm.querySelector(':invalid');
    if (firstInvalid) { firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstInvalid.focus(); }
    return;
  }

  // Phone validation
  const phone = document.getElementById('phone');
  if (!/^[6-9]\d{9}$/.test(phone.value.trim())) {
    phone.setCustomValidity('Invalid');
    enquiryForm.classList.add('was-validated');
    phone.focus(); return;
  } else {
    phone.setCustomValidity('');
  }

  // Show loading
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').textContent = 'Sending…';

  setTimeout(() => {
    formSuccess.classList.add('show');
    enquiryForm.reset();
    enquiryForm.classList.remove('was-validated');
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').textContent = 'Send Enquiry';
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => formSuccess.classList.remove('show'), 6500);
  }, 1400);
});

document.getElementById('phone')?.addEventListener('input', function () { this.setCustomValidity(''); });

/* =============================================
   7. GALLERY LIGHTBOX
   ============================================= */
// Inject lightbox markup & styles
const lbCSS = document.createElement('style');
lbCSS.textContent = `
  #lb-wrap { display:none; position:fixed; inset:0; z-index:9999; align-items:center; justify-content:center; }
  #lb-wrap.open { display:flex; }
  .lb-bg { position:absolute; inset:0; background:rgba(15,5,35,.92); cursor:pointer; }
  .lb-box { position:relative; z-index:1; max-width:92vw; text-align:center; }
  .lb-img { max-width:100%; max-height:85vh; border-radius:14px; box-shadow:0 20px 60px rgba(0,0,0,.55); display:block; margin:0 auto; }
  .lb-cap { color:rgba(255,255,255,.7); font-size:.82rem; margin-top:.7rem; letter-spacing:.1em; text-transform:uppercase; }
  .lb-close { position:absolute; top:-2.75rem; right:0; background:none; border:none; color:#fff; font-size:2.4rem; line-height:1; cursor:pointer; opacity:.75; }
  .lb-close:hover { opacity:1; }
  .lb-nav { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.12); border:none; color:#fff; font-size:1.5rem; width:44px; height:44px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:.2s; }
  .lb-nav:hover { background:rgba(255,255,255,.25); }
  .lb-prev { left:-56px; }
  .lb-next { right:-56px; }
  @media(max-width:600px) { .lb-prev,.lb-next { display:none; } }
`;
document.head.appendChild(lbCSS);

const lbWrap = document.createElement('div');
lbWrap.id = 'lb-wrap';
lbWrap.setAttribute('role', 'dialog');
lbWrap.setAttribute('aria-modal', 'true');
lbWrap.innerHTML = `
  <div class="lb-bg"></div>
  <div class="lb-box">
    <button class="lb-close" aria-label="Close">&times;</button>
    <button class="lb-nav lb-prev" aria-label="Previous">&#8249;</button>
    <img class="lb-img" src="" alt="" />
    <button class="lb-nav lb-next" aria-label="Next">&#8250;</button>
    <div class="lb-cap"></div>
  </div>
`;
document.body.appendChild(lbWrap);

const galleryItems = [...document.querySelectorAll('.g-item')];
let currentIdx = 0;

function openLB(idx) {
  currentIdx = idx;
  const item = galleryItems[idx];
  const img = item.querySelector('img');
  const cap = item.querySelector('.g-overlay span')?.textContent ?? '';
  lbWrap.querySelector('.lb-img').src = img.src.replace(/w=\d+/, 'w=1200');
  lbWrap.querySelector('.lb-img').alt = cap;
  lbWrap.querySelector('.lb-cap').textContent = cap;
  lbWrap.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB() { lbWrap.classList.remove('open'); document.body.style.overflow = ''; }
function nextLB(dir) { openLB((currentIdx + dir + galleryItems.length) % galleryItems.length); }

galleryItems.forEach((item, i) => { item.addEventListener('click', () => openLB(i)); });
lbWrap.querySelector('.lb-bg').addEventListener('click', closeLB);
lbWrap.querySelector('.lb-close').addEventListener('click', closeLB);
lbWrap.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); nextLB(-1); });
lbWrap.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); nextLB(1); });
document.addEventListener('keydown', e => {
  if (!lbWrap.classList.contains('open')) return;
  if (e.key === 'Escape') closeLB();
  if (e.key === 'ArrowRight') nextLB(1);
  if (e.key === 'ArrowLeft') nextLB(-1);
});

/* =============================================
   8. BROCHURE BUTTON — placeholder
   ============================================= */
document.querySelector('.btn-brochure')?.addEventListener('click', e => {
  e.preventDefault();
  alert('📄 Brochure will be sent directly to your registered contact.\nPlease fill the enquiry form or call us.');
});

/* =============================================
   9. LOG
   ============================================= */
console.log('%cShapoorji Vyomora 🏙️', 'font-size:1.4rem;color:#7450bc;font-weight:bold;');
console.log('%cHinjawadi Phase 1 · 2 & 3 BHK · Signature Duplex', 'font-size:.9rem;color:#8b68d4;');