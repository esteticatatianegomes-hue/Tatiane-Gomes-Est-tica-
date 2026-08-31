/**
 * Tatiane Gomes Estética - Site Oficial Multi-Navegação
 * Features: Mobile Menu Toggle, Contextualized WhatsApp Links, Touch Carousel & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. WHATSAPP DIRECT LINK CONFIGURATION
  const PHONE_NUMBER = "5511957739880"; 

  const MESSAGES = {
    default: "Olá Tatiane, vi seu anúncio e gostaria de agendar um atendimento na Rua Bela Vista.",
    limpeza: "Olá Tatiane, vi seu anúncio no Google e gostaria de agendar uma Limpeza de Pele e Avaliação na Rua Bela Vista.",
    slimone: "Olá Tatiane, gostaria de agendar uma Avaliação do Protocolo Slim One na Rua Bela Vista.",
    tratamentos: "Olá Tatiane, gostaria de mais informações sobre os seus Tratamentos Estéticos na Rua Bela Vista."
  };

  // Attach contextualized WhatsApp URLs
  const ctaButtons = document.querySelectorAll('.js-whatsapp-cta');
  ctaButtons.forEach(btn => {
    const msgType = btn.getAttribute('data-msg-type') || 'limpeza';
    const messageText = MESSAGES[msgType] || MESSAGES.default;
    const encodedMsg = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodedMsg}`;
    
    btn.setAttribute('href', whatsappUrl);
    btn.setAttribute('target', '_blank');
    btn.setAttribute('rel', 'noopener noreferrer');
  });

  // 2. MOBILE MENU TOGGLE
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNavOverlay = document.getElementById('mobileNavOverlay');

  if (hamburgerBtn && mobileNavOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      mobileNavOverlay.classList.toggle('active');
      document.body.style.overflow = mobileNavOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile nav on link click
    const mobileLinks = mobileNavOverlay.querySelectorAll('.nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // 3. SCROLL FADE-IN ANIMATION (IntersectionObserver)
  const fadeElements = document.querySelectorAll('.fade-in-element');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // 4. RESULTS CAROUSEL IMPLEMENTATION (For Limpeza de Pele / Results)
  const carouselTrack = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const dotsContainer = document.getElementById('carouselDots');
  const slides = document.querySelectorAll('.carousel-slide');

  if (carouselTrack && slides.length > 0) {
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let autoPlayTimer = null;

    function getVisibleSlides() {
      if (window.innerWidth >= 992) return 3;
      if (window.innerWidth >= 640) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, slides.length - getVisibleSlides());
    }

    function createDots() {
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      const totalDots = getMaxIndex() + 1;

      for (let i = 0; i < totalDots; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Ir para slide ${i + 1}`);
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      if (!dotsContainer) return;
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    function updateTrackPosition() {
      const slideWidthPercent = 100 / getVisibleSlides();
      const movePercent = -(currentIndex * slideWidthPercent);
      carouselTrack.style.transform = `translateX(${movePercent}%)`;
      updateDots();
    }

    function goToSlide(index) {
      const maxIndex = getMaxIndex();
      if (index < 0) {
        currentIndex = maxIndex;
      } else if (index > maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex = index;
      }
      updateTrackPosition();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    carouselTrack.addEventListener('touchstart', touchStart, { passive: true });
    carouselTrack.addEventListener('touchend', touchEnd, { passive: true });
    carouselTrack.addEventListener('touchmove', touchMove, { passive: true });

    carouselTrack.addEventListener('mousedown', touchStart);
    carouselTrack.addEventListener('mouseup', touchEnd);
    carouselTrack.addEventListener('mouseleave', touchEnd);
    carouselTrack.addEventListener('mousemove', touchMove);

    function touchStart(e) {
      isDragging = true;
      startX = getPositionX(e);
      stopAutoPlay();
    }

    function touchMove(e) {
      if (!isDragging) return;
      const currentX = getPositionX(e);
      const diffX = currentX - startX;
      
      if (Math.abs(diffX) > 50) {
        if (diffX < 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
        isDragging = false;
      }
    }

    function touchEnd() {
      isDragging = false;
      startAutoPlay();
    }

    function getPositionX(e) {
      return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    function startAutoPlay() {
      stopAutoPlay();
      autoPlayTimer = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4500);
    }

    function stopAutoPlay() {
      if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    window.addEventListener('resize', () => {
      if (currentIndex > getMaxIndex()) {
        currentIndex = getMaxIndex();
      }
      createDots();
      updateTrackPosition();
    });

    createDots();
    updateTrackPosition();
    startAutoPlay();
  }

  // 5. LIGHTBOX PREVIEW
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const resultCards = document.querySelectorAll('.js-lightbox-trigger');

  if (lightboxModal && lightboxImage) {
    resultCards.forEach(card => {
      card.addEventListener('click', () => {
        const imgSrc = card.getAttribute('data-img-src') || card.querySelector('img')?.src;
        if (imgSrc) {
          lightboxImage.src = imgSrc;
          lightboxModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }
});
