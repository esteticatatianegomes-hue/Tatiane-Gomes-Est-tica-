/* global.js — Script compartilhado entre todas as páginas — v2.1 */
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

        if (mobileMenu) {
            mobileMenu.addEventListener('click', function (e) {
                if (e.target === mobileMenu) closeMenu();
            });
        }

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
                document.querySelectorAll('.faq-item.active').forEach(function (el) {
                    el.classList.remove('active');
                    var a = el.querySelector('.faq-answer');
                    if (a) a.style.maxHeight = null;
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
            }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
            document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });
        } else {
            document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('active'); });
        }

        /* ---- Generic Carousel Init ---- */
        document.querySelectorAll('[data-carousel]').forEach(function (outer) {
            initCarousel(outer);
        });
    });

    /* ================================================================
       CAROUSEL ENGINE v2  —  baseado em pixels reais (sem % bugado)
       ================================================================ */
    function initCarousel(outer) {
        var track  = outer.querySelector('.carousel-track');
        var wrap   = outer.querySelector('.carousel-track-wrap');
        var slides = outer.querySelectorAll('.carousel-slide');
        var prev   = outer.querySelector('.carousel-btn.prev');
        var next   = outer.querySelector('.carousel-btn.next');
        var dotsEl = outer.querySelector('.carousel-dots');

        if (!track || !slides.length) return;

        var perDesktop = parseInt(outer.dataset.perDesktop || 1, 10);
        var perMobile  = parseInt(outer.dataset.perMobile  || 1, 10);
        var currentIdx = 0; /* índice do SLIDE (não da página) */

        /* ---- helpers ---- */
        function pp() {
            return window.innerWidth >= 768 ? perDesktop : perMobile;
        }

        function slideGap() {
            /* lê o gap real definido em CSS (ou fallback 0) */
            if (!wrap) return 0;
            var cs = window.getComputedStyle(track);
            return parseFloat(cs.columnGap || cs.gap || '0') || 0;
        }

        function slideW() {
            /* largura de um slide calculada a partir do wrap */
            var wrapW = (wrap || outer).getBoundingClientRect().width;
            var perPg = pp();
            var g     = slideGap();
            return (wrapW - g * (perPg - 1)) / perPg;
        }

        function maxIdx() {
            return Math.max(0, slides.length - pp());
        }

        function totalSteps() {
            return Math.ceil(slides.length / pp());
        }

        /* ---- layout ---- */
        function applyWidths() {
            var w = slideW();
            slides.forEach(function (s) {
                s.style.width    = w + 'px';
                s.style.flexShrink = '0';
            });
        }

        /* ---- navigate ---- */
        function goTo(slideIndex) {
            currentIdx = Math.max(0, Math.min(slideIndex, maxIdx()));
            var offset = currentIdx * (slideW() + slideGap());
            track.style.transform = 'translateX(-' + offset + 'px)';
            buildDots();
        }

        function stepFwd() { goTo(currentIdx + pp()); }
        function stepBwd() { goTo(currentIdx - pp()); }

        /* ---- dots ---- */
        function buildDots() {
            if (!dotsEl) return;
            dotsEl.innerHTML = '';
            var steps = totalSteps();
            var activePg = Math.min(Math.round(currentIdx / pp()), steps - 1);
            for (var i = 0; i < steps; i++) {
                var d = document.createElement('button');
                d.className = 'carousel-dot' + (i === activePg ? ' active' : '');
                d.setAttribute('aria-label', 'Slide ' + (i + 1));
                (function (pageIdx) {
                    d.addEventListener('click', function () { goTo(pageIdx * pp()); });
                })(i);
                dotsEl.appendChild(d);
            }
        }

        /* ---- events ---- */
        if (prev) prev.addEventListener('click', stepBwd);
        if (next) next.addEventListener('click', stepFwd);

        /* Touch / swipe */
        var touchStartX = 0;
        var touchStartY = 0;
        var isDragging  = false;

        track.addEventListener('touchstart', function (e) {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isDragging  = false;
        }, { passive: true });

        track.addEventListener('touchmove', function (e) {
            var dx = Math.abs(e.touches[0].clientX - touchStartX);
            var dy = Math.abs(e.touches[0].clientY - touchStartY);
            if (dx > dy && dx > 8) isDragging = true;
        }, { passive: true });

        track.addEventListener('touchend', function (e) {
            if (!isDragging) return;
            var dx = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 36) {
                dx > 0 ? stepFwd() : stepBwd();
            }
            isDragging = false;
        }, { passive: true });

        /* ---- resize ---- */
        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                applyWidths();
                goTo(0);
            }, 150);
        }, { passive: true });

        /* ---- init ---- */
        applyWidths();
        goTo(0);
    }

    window.initCarousel = initCarousel;
})();
