/* global.js — Script compartilhado entre todas as páginas */
(function () {
    'use strict';

    /* ---- Rastreamento WhatsApp ---- */
    window.trackWpp = function (url, eventName) {
        if (window.gtag && eventName) {
            gtag('event', eventName, { event_category: 'WhatsApp_CTA' });
        }
        var cb = function () { if (url) window.open(url, '_blank'); };
        if (window.gtag) {
            gtag('event', 'conversion', {
                send_to: 'AW-17947496680/hUBdCOX99oMcEOihhO5C',
                event_callback: cb
            });
        } else { cb(); }
        return false;
    };

    document.addEventListener('DOMContentLoaded', function () {

        /* ---- Navbar scroll shadow ---- */
        var navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', function () {
                navbar.classList.toggle('scrolled', window.scrollY > 40);
            }, { passive: true });
        }

        /* ---- Hamburger / Mobile Menu ---- */
        var hamburger = document.getElementById('hamburger');
        var mobileMenu = document.getElementById('mobile-menu');
        var closeBtn   = document.getElementById('close-menu');

        function openMenu() {
            if (!mobileMenu) return;
            mobileMenu.classList.add('active');
            if (hamburger) hamburger.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        function closeMenu() {
            if (!mobileMenu) return;
            mobileMenu.classList.remove('active');
            if (hamburger) hamburger.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (hamburger) hamburger.addEventListener('click', openMenu);
        if (closeBtn)  closeBtn.addEventListener('click', closeMenu);

        /* Close on overlay click */
        if (mobileMenu) {
            mobileMenu.addEventListener('click', function (e) {
                if (e.target === mobileMenu) closeMenu();
            });
        }

        /* Close on Escape */
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });

        /* ---- Active nav link ---- */
        var page = location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (a) {
            var href = a.getAttribute('href');
            if (href && (href === page || (page === '' && href === 'index.html'))) {
                a.classList.add('active');
            }
        });

        /* ---- FAQ Accordion ---- */
        document.querySelectorAll('.faq-item').forEach(function (item) {
            var btn = item.querySelector('.faq-question');
            var ans = item.querySelector('.faq-answer');
            if (!btn || !ans) return;
            btn.addEventListener('click', function () {
                var isOpen = item.classList.contains('active');
                /* Close all */
                document.querySelectorAll('.faq-item.active').forEach(function (el) {
                    el.classList.remove('active');
                    el.querySelector('.faq-answer').style.maxHeight = null;
                });
                if (!isOpen) {
                    item.classList.add('active');
                    ans.style.maxHeight = ans.scrollHeight + 'px';
                }
            });
        });

        /* ---- Scroll Reveal ---- */
        if ('IntersectionObserver' in window) {
            var io = new IntersectionObserver(function (entries) {
                entries.forEach(function (e) {
                    if (e.isIntersecting) {
                        e.target.classList.add('active');
                        io.unobserve(e.target);
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
            document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
        } else {
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('active'); });
        }

        /* ---- Generic Carousel Init ---- */
        document.querySelectorAll('[data-carousel]').forEach(function (outer) {
            initCarousel(outer);
        });
    });

    /* ========================================================
       Carousel Engine
       Usage: <div data-carousel data-per-desktop="2" data-per-mobile="1">
                <div class="carousel-track-wrap">
                  <div class="carousel-track">
                    <div class="carousel-slide">…</div>
                  </div>
                </div>
                <div class="carousel-controls">
                  <button class="carousel-btn prev">…</button>
                  <div class="carousel-dots"></div>
                  <button class="carousel-btn next">…</button>
                </div>
              </div>
    ======================================================== */
    function initCarousel(outer) {
        var track  = outer.querySelector('.carousel-track');
        var slides = outer.querySelectorAll('.carousel-slide');
        var prev   = outer.querySelector('.carousel-btn.prev');
        var next   = outer.querySelector('.carousel-btn.next');
        var dotsEl = outer.querySelector('.carousel-dots');
        if (!track || !slides.length) return;

        var perDesktop = parseInt(outer.dataset.perDesktop || 1, 10);
        var perMobile  = parseInt(outer.dataset.perMobile  || 1, 10);
        var current = 0;

        function perPage() {
            return window.innerWidth >= 768 ? perDesktop : perMobile;
        }

        function totalSteps() {
            return Math.ceil(slides.length / perPage());
        }

        function setSlideWidths() {
            var pp = perPage();
            slides.forEach(function (s) {
                s.style.flex = '0 0 calc(100% / ' + pp + ')';
                s.style.minWidth = 'calc(100% / ' + pp + ')';
            });
        }

        function goTo(idx) {
            var pp = perPage();
            var max = slides.length - pp;
            current = Math.max(0, Math.min(idx * pp, max));
            var pct = (current / slides.length) * 100;
            track.style.transform = 'translateX(-' + pct + '%)';
            buildDots();
        }

        function buildDots() {
            if (!dotsEl) return;
            dotsEl.innerHTML = '';
            var steps = totalSteps();
            var activePage = Math.round(current / perPage());
            for (var i = 0; i < steps; i++) {
                var d = document.createElement('button');
                d.className = 'carousel-dot' + (i === activePage ? ' active' : '');
                d.setAttribute('aria-label', 'Slide ' + (i + 1));
                (function (idx) {
                    d.addEventListener('click', function () { goTo(idx); });
                })(i);
                dotsEl.appendChild(d);
            }
        }

        function stepForward()  { goTo(Math.round(current / perPage()) + 1); }
        function stepBackward() { goTo(Math.round(current / perPage()) - 1); }

        if (prev) prev.addEventListener('click', stepBackward);
        if (next) next.addEventListener('click', stepForward);

        /* Touch swipe */
        var startX = 0;
        track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
        track.addEventListener('touchend', function (e) {
            var dx = startX - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 40) dx > 0 ? stepForward() : stepBackward();
        }, { passive: true });

        /* Init */
        setSlideWidths();
        goTo(0);

        window.addEventListener('resize', function () {
            setSlideWidths();
            goTo(0);
        }, { passive: true });
    }

    /* Expose for manual use */
    window.initCarousel = initCarousel;
})();
