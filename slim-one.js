document.addEventListener('DOMContentLoaded', () => {

    // Reveal Animations
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // only once
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // Mobile Drawer Menu
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const closeDrawer = document.querySelector('.close-drawer');

    if(menuToggle && mobileDrawer && closeDrawer) {
        menuToggle.addEventListener('click', () => {
            mobileDrawer.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeDrawer.addEventListener('click', () => {
            mobileDrawer.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        if(question && answer) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // close all
                faqItems.forEach(el => {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = null;
                });

                if (!isActive) {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + "px";
                }
            });
        }
    });

    // Carousel Logic Setup
    function setupCarousel(containerId, trackId, slideSelector, isDepoimentos = false) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const track = document.getElementById(trackId);
        const prevBtn = container.querySelector('.prev');
        const nextBtn = container.querySelector('.next');
        const indicatorsContainer = container.querySelector('.carousel-indicators');
        const slides = track.querySelectorAll(slideSelector);
        
        if(slides.length === 0) return;

        // Build indicators
        let visibleSlides = 1;
        if(isDepoimentos && window.innerWidth >= 768) {
            visibleSlides = 2;
        }
        
        const totalSteps = Math.max(1, slides.length - visibleSlides + 1);

        // Update indicators on scroll/resize
        function updateIndicators() {
            indicatorsContainer.innerHTML = '';
            const scrollLeft = track.scrollLeft;
            const slideWidth = slides[0].offsetWidth;
            const gap = isDepoimentos ? (window.innerWidth >= 768 ? 24 : 16) : 0;
            const currentIndex = Math.round(scrollLeft / (slideWidth + gap));
            
            for (let i = 0; i < totalSteps; i++) {
                const dot = document.createElement('div');
                dot.classList.add('carousel-indicator');
                if (i === Math.min(currentIndex, totalSteps - 1)) dot.classList.add('active');
                
                dot.addEventListener('click', () => {
                    track.scrollTo({
                        left: i * (slideWidth + gap),
                        behavior: 'smooth'
                    });
                });
                indicatorsContainer.appendChild(dot);
            }
        }

        updateIndicators();
        track.addEventListener('scroll', () => {
            // Debounce or directly update (smooth scrolling might trigger multiple)
            window.requestAnimationFrame(updateIndicators);
        });

        window.addEventListener('resize', () => {
            // Re-evaluate visible slides and total steps
            const newVisibleSlides = isDepoimentos && window.innerWidth >= 768 ? 2 : 1;
            if(newVisibleSlides !== visibleSlides) {
                // simple reload logic or re-init
                location.reload();
            } else {
                updateIndicators();
            }
        });

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const slideWidth = slides[0].offsetWidth;
                const gap = isDepoimentos ? (window.innerWidth >= 768 ? 24 : 16) : 0;
                track.scrollBy({ left: -(slideWidth + gap), behavior: 'smooth' });
            });

            nextBtn.addEventListener('click', () => {
                const slideWidth = slides[0].offsetWidth;
                const gap = isDepoimentos ? (window.innerWidth >= 768 ? 24 : 16) : 0;
                track.scrollBy({ left: (slideWidth + gap), behavior: 'smooth' });
            });
        }
    }

    // Initialize Carousels
    setupCarousel('resultadosCarouselContainer', 'resultadosTrack', '.carousel-slide', false);
    setupCarousel('depoimentosCarouselContainer', 'depoimentosTrack', '.depoimento-card', true);

});
