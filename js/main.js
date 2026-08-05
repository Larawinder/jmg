/* ══════════════════════════════════════════════
   JGM CONSTRUÇÕES — main.js
   [EDITAR: número real do WhatsApp]
══════════════════════════════════════════════ */

const WHATSAPP = '554185118232'; // [EDITAR: número real com DDI+DDD sem espaços]

/* ── URL do WhatsApp ─────────────────────────── */
function waURL(msg) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

/* ── Wire todos os botões WhatsApp ──────────── */
function initWhatsApp() {
  document.querySelectorAll('.js-whatsapp').forEach(el => {
    const msg = el.dataset.msg || 'Olá! Gostaria de um orçamento da JGM Construções.';
    el.href = waURL(msg);
    el.target = '_blank';
    el.rel = 'noopener noreferrer';
  });
}

/* ══════════════════════════════════════════════
   HEADER: scroll + hambúrguer
══════════════════════════════════════════════ */
function initHeader() {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('mainNav');

  let savedScrollY = 0;

  // Trava o scroll de verdade (funciona no Safari iOS,
  // onde body{overflow:hidden} não segura o toque)
  function lockScroll() {
    savedScrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    // desliga o smooth momentaneamente pra restaurar sem "pulo" animado
    const htmlEl = document.documentElement;
    const prevBehavior = htmlEl.style.scrollBehavior;
    htmlEl.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedScrollY);
    htmlEl.style.scrollBehavior = prevBehavior;
  }

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    if (open) lockScroll(); else unlockScroll();
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      unlockScroll();
      // deixa a âncora navegar depois que o scroll foi restaurado
    });
  });
}

/* ══════════════════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
}

/* ══════════════════════════════════════════════
   CONTADOR ANIMADO
══════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-item__number');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);
  const DURATION = 1800;

  function animateCounter(el) {
    const rawTarget = el.dataset.target;
    const target    = parseInt(rawTarget, 10);
    if (isNaN(target)) return; // [EDITAR] placeholder não animado

    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const start  = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const value    = Math.round(easeOut(progress) * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ══════════════════════════════════════════════
   GALERIA — CARROSSEL
══════════════════════════════════════════════ */
function initGaleriaCarrossel() {
  const track = document.getElementById('galeriaGrid');
  const prev  = document.getElementById('galeriaPrev');
  const next  = document.getElementById('galeriaNext');

  if (!track || !prev || !next) return;

  function passo() {
    const item = track.querySelector('.galeria__item');
    if (!item) return track.clientWidth;
    const estilo = getComputedStyle(track);
    const gap = parseFloat(estilo.columnGap || estilo.gap) || 16;
    return item.getBoundingClientRect().width + gap;
  }

  function atualizar() {
    const max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  }

  prev.addEventListener('click', () => track.scrollBy({ left: -passo(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left:  passo(), behavior: 'smooth' }));

  track.addEventListener('scroll', () => requestAnimationFrame(atualizar), { passive: true });
  window.addEventListener('resize', atualizar);
  window.addEventListener('load', atualizar);

  atualizar();
}

/* ══════════════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════════════ */
function initLightbox() {
  const lightbox  = document.getElementById('lightbox');
  const img       = document.getElementById('lightboxImg');
  const caption   = document.getElementById('lightboxCaption');
  const backdrop  = document.getElementById('lightboxBackdrop');
  const btnClose  = document.getElementById('lightboxClose');
  const btnPrev   = document.getElementById('lightboxPrev');
  const btnNext   = document.getElementById('lightboxNext');
  const items     = Array.from(document.querySelectorAll('.galeria__item'));

  if (!lightbox || !items.length) return;

  let current = 0;

  function open(index) {
    current = index;
    const item = items[current];
    img.src       = item.dataset.src;
    img.alt       = item.querySelector('img').alt;
    caption.textContent = item.dataset.caption || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    btnClose.focus();
  }

  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    img.src = '';
  }

  function prev() { open((current - 1 + items.length) % items.length); }
  function next() { open((current + 1) % items.length); }

  items.forEach((item, i) => {
    item.addEventListener('click', () => open(i));
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `Ampliar foto: ${item.dataset.caption || i + 1}`);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
    });
  });

  btnClose.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  btnPrev.addEventListener('click', prev);
  btnNext.addEventListener('click', next);

  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ══════════════════════════════════════════════
   BOTÃO FLUTUANTE WHATSAPP
══════════════════════════════════════════════ */
function initWaFloat() {
  const btn = document.getElementById('waFloat');
  if (!btn) return;

  let shown = false;
  window.addEventListener('scroll', () => {
    const shouldShow = window.scrollY > 300;
    if (shouldShow !== shown) {
      shown = shouldShow;
      btn.classList.toggle('visible', shown);
    }
  }, { passive: true });
}

/* ══════════════════════════════════════════════
   SCROLL SUAVE NAS ÂNCORAS
══════════════════════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const header = document.getElementById('header');
      const offset = header ? header.offsetHeight : 0;
      const top    = target.getBoundingClientRect().top + window.scrollY - offset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════════════════════════════
   ANO NO FOOTER
══════════════════════════════════════════════ */
function initYear() {
  const el = document.getElementById('footerYear');
  if (el) el.textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════
   POPUP TRABALHE CONOSCO
══════════════════════════════════════════════ */
function initTrabalheConosco() {
  const btnOpen        = document.getElementById('btnOpenTrabalhe');
  const linkFooter     = document.getElementById('footerTrabalheLink');
  const popup          = document.getElementById('trabalhePopup');
  const btnClose       = document.getElementById('btnCloseTrabalhe');
  const btnSuccessClose = document.getElementById('btnSuccessClose');
  const form           = document.getElementById('trabalheForm');
  const formWrapper    = document.getElementById('trabalheFormWrapper');
  const successWrapper = document.getElementById('trabalheSuccess');
  
  const btnSubmit      = document.getElementById('btnSubmitTrabalhe');
  const btnSubmitText    = document.getElementById('btnSubmitTrabalheText');
  const btnSubmitSpinner = document.getElementById('btnSubmitTrabalheSpinner');

  if (!popup) return;

  function openPopup(e) {
    if (e) e.preventDefault();
    
    // Reset form and view states
    if (form) form.reset();
    if (formWrapper) formWrapper.hidden = false;
    if (successWrapper) successWrapper.hidden = true;

    // Show popup
    popup.hidden = false;
    // Short delay to allow browser to register hidden=false before opacity transition
    setTimeout(() => {
      popup.classList.add('open');
      popup.setAttribute('aria-hidden', 'false');
      document.body.classList.add('trabalhe-open');
      
      // Focus back button for accessibility
      if (btnClose) btnClose.focus();
    }, 10);
  }

  function closePopup() {
    popup.classList.remove('open');
    popup.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('trabalhe-open');
    
    // Wait for transition before hiding the element entirely
    setTimeout(() => {
      popup.hidden = true;
      // Focus back on the button that opened it
      if (btnOpen) btnOpen.focus();
    }, 400);
  }

  // Event listeners for opening
  if (btnOpen) btnOpen.addEventListener('click', openPopup);
  if (linkFooter) linkFooter.addEventListener('click', openPopup);

  // Event listeners for closing
  if (btnClose) btnClose.addEventListener('click', closePopup);
  if (btnSuccessClose) btnSuccessClose.addEventListener('click', closePopup);

  // Close with ESC key
  document.addEventListener('keydown', (e) => {
    if (!popup.hidden && e.key === 'Escape') {
      closePopup();
    }
  });

  // Form submission via AJAX Formspree
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Set button to loading state
      if (btnSubmit) btnSubmit.disabled = true;
      if (btnSubmitSpinner) btnSubmitSpinner.hidden = false;
      if (btnSubmitText) btnSubmitText.textContent = 'Enviando...';

      const data = new FormData(form);
      
      fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          // Success
          if (formWrapper) formWrapper.hidden = true;
          if (successWrapper) successWrapper.hidden = false;
          form.reset();

          // Focus success card or success button for screen readers
          if (btnSuccessClose) btnSuccessClose.focus();
        } else {
          // Response error
          response.json().then(data => {
            if (data && Object.hasOwn(data, 'errors')) {
              alert(data.errors.map(error => error.message).join(", "));
            } else {
              alert("Ops! Ocorreu um erro ao enviar sua candidatura. Verifique os campos e tente novamente.");
            }
          }).catch(() => {
            alert("Ops! Ocorreu um erro ao processar o envio. Tente novamente mais tarde.");
          });
        }
      })
      .catch(error => {
        // Network error
        alert("Erro de rede! Verifique sua conexão com a internet e tente novamente.");
      })
      .finally(() => {
        // Restore button state
        if (btnSubmit) btnSubmit.disabled = false;
        if (btnSubmitSpinner) btnSubmitSpinner.hidden = true;
        if (btnSubmitText) btnSubmitText.textContent = 'Enviar Candidatura';
      });
    });
  }
}

/* ══════════════════════════════════════════════
   INIT
══════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initWhatsApp();
  initHeader();
  initScrollReveal();
  initCounters();
  initGaleriaCarrossel();
  initLightbox();
  initWaFloat();
  initSmoothScroll();
  initYear();
  initTrabalheConosco();
});
