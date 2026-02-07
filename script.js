// Navbar scroll effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Active nav link based on scroll position
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .feature-item, .about-content');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Placeholder for profile image - Generate a placeholder if image doesn't exist
const profileImage = document.getElementById('profileImage');
if (profileImage) {
    profileImage.onerror = function () {
        // Create a placeholder gradient background
        this.style.display = 'none';
        const placeholder = document.createElement('div');
        placeholder.style.cssText = `
            width: 100%;
            padding-top: 120%;
            background: linear-gradient(135deg, #4d6944, #5d7954);
            border-radius: 20px;
            position: relative;
        `;

        const text = document.createElement('div');
        text.innerHTML = '<span style="font-size: 3rem; color: white;">TG</span>';
        text.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-family: 'Cormorant Garamond', serif;
            font-weight: 700;
        `;

        placeholder.appendChild(text);
        this.parentElement.appendChild(placeholder);
    };
}

// Form validation for contact and appointment pages (will be used in other pages)
function validateForm(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#e74c3c';
            } else {
                input.style.borderColor = '#4d6944';
            }
        });

        if (isValid) {
            // Show success message
            alert('Formulário enviado com sucesso! Entraremos em contato em breve.');
            form.reset();
        } else {
            alert('Por favor, preencha todos os campos obrigatórios.');
        }
    });
}

// Initialize form validation on page load
document.addEventListener('DOMContentLoaded', () => {
    validateForm('contactForm');
    validateForm('appointmentForm');
});
// Carousel Implementation
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('carouselTrack');
    // Only run if carousel exists on the page
    if (!track) return;

    const slides = Array.from(track.children);
    const nextButton = document.getElementById('nextBtn');
    const prevButton = document.getElementById('prevBtn');
    const dotsContainer = document.getElementById('carouselDots');

    let currentSlideIndex = 0;

    // Create dots
    dotsContainer.innerHTML = ''; // Clear existing dots if any
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
            goToSlide(index);
            resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.children);

    function updateDots(index) {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[index]) dots[index].classList.add('active');
    }

    function goToSlide(index) {
        // Calculate max index based on visible area? 
        // For simple sliding, we just slide one by one.
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Use pixel width for accurate sliding
        // slideWidth includes padding because we used box-sizing: border-box
        const slideWidth = slides[0].getBoundingClientRect().width;

        track.style.transform = `translateX(-${index * slideWidth}px)`;
        currentSlideIndex = index;
        updateDots(index);
    }

    // Handle window resize to keep alignment
    window.addEventListener('resize', () => {
        // Re-apply current slide position
        if (slides[0]) {
            const slideWidth = slides[0].getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`;
        }
    });

    // Button listeners
    nextButton.addEventListener('click', () => {
        goToSlide(currentSlideIndex + 1);
        resetAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        goToSlide(currentSlideIndex - 1);
        resetAutoPlay();
    });

    // Auto Play
    let autoPlayInterval = setInterval(() => {
        goToSlide(currentSlideIndex + 1);
    }, 5000); // 5 seconds

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            goToSlide(currentSlideIndex + 1);
        }, 5000);
    }

    // Touch events for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe Left -> Next
            goToSlide(currentSlideIndex + 1);
            resetAutoPlay();
        }
        if (touchEndX > touchStartX + 50) {
            // Swipe Right -> Prev
            goToSlide(currentSlideIndex - 1);
            resetAutoPlay();
        }
    }
});

// Submenu funcionando no celular
document.querySelectorAll('.dropdown > .nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            link.parentElement.classList.toggle('active');
        }
    });
});

// Menu toggle for index.html
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');

if (menuToggle && menuOverlay) {
    menuToggle.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
    });

    menuOverlay.addEventListener('click', () => {
        menuOverlay.classList.remove('active');
    });
}
