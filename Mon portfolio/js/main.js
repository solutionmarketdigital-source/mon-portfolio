/**
 * PORTFOLIO DANIEL BENGUE — JAVASCRIPT PRINCIPAL
 * Interactions modernes, lightbox, horloges en direct, filtres et responsive
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClocks();
  initMobileNav();
  initHeaderScroll();
  initGalleryFilters();
  initImageLightbox();
  initVideoInteractions();
  initContactForm();
  initCopyEmail();
});

/* ==========================================================================
   1. HORLOGES EN DIRECT (GMT+1 COTONOU & EUROPE/PARIS)
   ========================================================================== */
function initLiveClocks() {
  const cotonouClockEl = document.getElementById('cotonou-live-clock');
  const parisClockEl = document.getElementById('paris-live-clock');

  function updateClocks() {
    const now = new Date();

    // Heure Cotonou / Bénin (West Africa Time, UTC+1 fixe toute l'année)
    const optionsCotonou = {
      timeZone: 'Africa/Porto-Novo',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    // Heure Paris / Europe
    const optionsParis = {
      timeZone: 'Europe/Paris',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    };

    try {
      const cotonouTime = new Intl.DateTimeFormat('fr-FR', optionsCotonou).format(now);
      const parisTime = new Intl.DateTimeFormat('fr-FR', optionsParis).format(now);

      if (cotonouClockEl) cotonouClockEl.textContent = cotonouTime;
      if (parisClockEl) parisClockEl.textContent = parisTime;
    } catch (e) {
      // Fallback si timezone non supporté
      const fallbackTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      if (cotonouClockEl) cotonouClockEl.textContent = fallbackTime;
      if (parisClockEl) parisClockEl.textContent = fallbackTime;
    }
  }

  updateClocks();
  setInterval(updateClocks, 1000);
}

/* ==========================================================================
   2. MENU MOBILE & BACKDROP
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const backdrop = document.querySelector('.nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!toggleBtn || !navMenu) return;

  function toggleMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    navMenu.classList.add('open');
    toggleBtn.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    toggleBtn.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', toggleMenu);
  if (backdrop) backdrop.addEventListener('click', closeMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ==========================================================================
   3. EFFET HEADER AU SCROLL & ACTIVE LINK
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   4. FILTRES GALERIE IMAGES
   ========================================================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-tabs .tab-btn');
  const imageCards = document.querySelectorAll('.images-grid .image-card');

  if (!filterBtns.length || !imageCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      imageCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (filterValue === 'all' || cardCategory === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. LIGHTBOX MODALE IMAGES
   ========================================================================== */
function initImageLightbox() {
  const lightbox = document.getElementById('lightbox-modal');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxTitle = lightbox.querySelector('.lightbox-caption-title');
  const lightboxDesc = lightbox.querySelector('.lightbox-caption-desc');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  const cards = Array.from(document.querySelectorAll('.image-card'));
  let currentIndex = 0;

  function getVisibleCards() {
    return cards.filter(c => c.style.display !== 'none');
  }

  function openLightbox(index) {
    const visibleCards = getVisibleCards();
    if (index < 0 || index >= visibleCards.length) return;

    currentIndex = index;
    const currentCard = visibleCards[currentIndex];
    const imgEl = currentCard.querySelector('img');
    const titleEl = currentCard.querySelector('.image-item-title') || currentCard.querySelector('.card-project-name');
    const descEl = currentCard.querySelector('.image-client-tag') || currentCard.querySelector('.card-project-type');

    if (lightboxImg && imgEl) {
      lightboxImg.src = imgEl.src;
      lightboxImg.alt = imgEl.alt || 'Aperçu du visuel';
    }

    if (lightboxTitle && titleEl) {
      lightboxTitle.textContent = titleEl.textContent;
    }

    if (lightboxDesc && descEl) {
      lightboxDesc.textContent = descEl.textContent;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNext() {
    const visibleCards = getVisibleCards();
    currentIndex = (currentIndex + 1) % visibleCards.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    const visibleCards = getVisibleCards();
    currentIndex = (currentIndex - 1 + visibleCards.length) % visibleCards.length;
    openLightbox(currentIndex);
  }

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const visibleCards = getVisibleCards();
      const idx = visibleCards.indexOf(card);
      if (idx !== -1) openLightbox(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', showNext);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });
}

/* ==========================================================================
   6. INTERACTION VIDÉO & SIMULATION LECTEUR
   ========================================================================== */
function initVideoInteractions() {
  // Gestion de la lecture interactive sur les cartes dédiées
  const playButtons = document.querySelectorAll('.center-play-button');
  
  playButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentMockup = btn.closest('.video-player-mockup');
      if (!parentMockup) return;

      const videoEl = parentMockup.querySelector('video');
      if (videoEl) {
        if (videoEl.paused) {
          videoEl.play();
          btn.style.opacity = '0';
          btn.style.pointerEvents = 'none';
        } else {
          videoEl.pause();
          btn.style.opacity = '1';
          btn.style.pointerEvents = 'auto';
        }
      } else {
        // Animation feedback si média de remplacement
        btn.classList.add('pulse-anim');
        setTimeout(() => {
          btn.classList.remove('pulse-anim');
          alert('Lecture de démonstration : Le player est prêt à diffuser vos vidéos MP4 ou liens Instagram/TikTok !');
        }, 200);
      }
    });
  });
}

/* ==========================================================================
   7. FORMULAIRE DE CONTACT
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('[name="name"]')?.value.trim() || 'Client';
    const email = form.querySelector('[name="email"]')?.value.trim() || '';
    const projectType = form.querySelector('[name="service"]')?.value || 'Community Management';
    const message = form.querySelector('[name="message"]')?.value.trim() || '';

    // Message préformaté pour WhatsApp ou email
    const prefilledText = `Bonjour Daniel, je suis ${name} (${email}). J'aimerais échanger au sujet d'un projet de "${projectType}" : ${message}`;

    // Ouverture WhatsApp avec encodage
    const whatsappNumber = '22997000000'; // Numéro modifiable par Daniel
    const encodedUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledText)}`;

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = `✓ Redirection WhatsApp...`;
    submitBtn.style.backgroundColor = '#10B981';

    setTimeout(() => {
      window.open(encodedUrl, '_blank', 'noopener,noreferrer');
      submitBtn.innerHTML = originalText;
      submitBtn.style.backgroundColor = '';
      form.reset();
    }, 800);
  });
}

/* ==========================================================================
   8. COPIE DE L'EMAIL EN UN CLIC
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('btn-copy-email');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const emailToCopy = copyBtn.getAttribute('data-email') || 'daniel.bengue.cm@gmail.com';

    navigator.clipboard.writeText(emailToCopy).then(() => {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copié dans le presse-papier ! ✓';
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2500);
    }).catch(() => {
      window.location.href = `mailto:${emailToCopy}`;
    });
  });
}
