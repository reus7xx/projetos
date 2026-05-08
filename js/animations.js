/* ============================================================
   ANIMATIONS.JS — Cinematic Experience Layer
   Loader | Scroll Progress | Pin | Color Transitions
   Word Reveal | Parallax | Active Nav | Year Markers | Counters
   ============================================================ */

'use strict';

/* ============================================================
   1. PAGE LOADER
   "NASCIDO PARA DESTRUIR" revela + barra de progresso
   ============================================================ */
function initLoader() {
    const loader = document.getElementById('page-loader');
    const bar    = document.getElementById('loader-bar');
    const line1  = document.querySelector('.loader-line-1');
    const line2  = document.querySelector('.loader-line-2');
    const line3  = document.querySelector('.loader-line-3');

    if (!loader) return;

    // Freeze scroll
    document.body.style.overflow = 'hidden';

    // Safety: exit loader even if GSAP fails
    const safety = setTimeout(() => {
        loader.style.opacity  = '0';
        loader.style.display  = 'none';
        document.body.style.overflow = '';
        ScrollTrigger.refresh();
    }, 5000);

    const tl = gsap.timeline({
        onComplete: () => {
            clearTimeout(safety);
            exitLoader(loader);
        },
    });

    tl.to(line1, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.2)
      .to(line2, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.5)
      .to(line3, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' }, 0.65)
      .to(bar,   { width: '100%', duration: 1.0, ease: 'power2.inOut'  }, 0.8)
      .to({}, { duration: 0.35 });
}

function exitLoader(loader) {
    gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
            document.body.style.overflow = '';
            ScrollTrigger.refresh();
        },
    });
}

/* ============================================================
   2. GLOBAL SCROLL PROGRESS BAR (barra lateral direita)
   ============================================================ */
function initGlobalProgress() {
    const fill = document.getElementById('global-progress-fill');
    if (!fill) return;

    const update = () => {
        const max      = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        fill.style.height = (progress * 100) + '%';
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
}

/* ============================================================
   3. ACTIVE NAV LINK — destaca seção atual
   ============================================================ */
function initActiveNav() {
    const links    = document.querySelectorAll('.nav-link[data-section]');
    const sections = ['origem', 'kickboxing', 'glory', 'ufc', 'campeao'];

    sections.forEach(id => {
        const sec = document.getElementById(id);
        if (!sec) return;

        ScrollTrigger.create({
            trigger: sec,
            start: 'top 40%',
            end: 'bottom 40%',
            onEnter()     { setActiveLink(id); },
            onEnterBack() { setActiveLink(id); },
            onLeave()     { if (id === sections[sections.length - 1]) clearActiveLinks(); },
        });
    });

    ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom 40%',
        onEnter()     { clearActiveLinks(); },
        onEnterBack() { clearActiveLinks(); },
    });

    function setActiveLink(sectionId) {
        links.forEach(l => l.classList.toggle('is-active', l.dataset.section === sectionId));
    }
    function clearActiveLinks() {
        links.forEach(l => l.classList.remove('is-active'));
    }
}

/* ============================================================
   4. SECTION COLOR TRANSITIONS
   ============================================================ */
function initColorTransitions() {
    document.querySelectorAll('[data-bg]').forEach(sec => {
        const bg     = sec.dataset.bg;
        const accent = sec.dataset.accent;

        ScrollTrigger.create({
            trigger: sec,
            start: 'top 55%',
            end: 'bottom 55%',
            onEnter()     { applyColors(bg, accent); },
            onEnterBack() { applyColors(bg, accent); },
        });
    });

    function applyColors(bg, accent) {
        gsap.to(document.body, { backgroundColor: bg, duration: 0.8, ease: 'power2.inOut' });
        document.documentElement.style.setProperty('--accent-color', accent);
    }
}

/* ============================================================
   5. CAREER SECTION PINNING
   ============================================================ */
function initCareerPins() {
    const careers = [
        { sectionId: 'kickboxing', pinId: 'kb-pin',    leftId: 'kb-left',    rightId: 'kb-right',    progressId: 'kb-progress',    accent: '#e67e22' },
        { sectionId: 'glory',      pinId: 'glory-pin',  leftId: 'glory-left',  rightId: 'glory-right',  progressId: 'glory-progress',  accent: '#c0392b' },
        { sectionId: 'ufc',        pinId: 'ufc-pin',    leftId: 'ufc-left',    rightId: 'ufc-right',    progressId: 'ufc-progress',    accent: '#D4AF37' },
    ];

    careers.forEach(cfg => {
        const section  = document.getElementById(cfg.sectionId);
        const pin      = document.getElementById(cfg.pinId);
        const leftEl   = document.getElementById(cfg.leftId);
        const rightEl  = document.getElementById(cfg.rightId);
        const progress = document.getElementById(cfg.progressId);

        if (!section || !pin) return;

        if (progress) progress.style.background = cfg.accent;

        if (leftEl && rightEl) {
            gsap.set(leftEl,  { x: -180, opacity: 0 });
            gsap.set(rightEl, { x:  180, opacity: 0 });

            ScrollTrigger.create({
                trigger: section,
                start: 'top 70%',
                once: true,
                onEnter() {
                    gsap.to(leftEl,  { x: 0, opacity: 1, duration: 1.4, ease: 'power4.out' });
                    gsap.to(rightEl, { x: 0, opacity: 1, duration: 1.4, ease: 'power4.out' });
                },
            });
        }

        ScrollTrigger.create({
            trigger: section,
            start: 'top top',
            end: 'bottom bottom',
            pin: pin,
            pinSpacing: false,
            onUpdate(self) {
                if (progress) progress.style.width = (self.progress * 100) + '%';
            },
        });
    });
}

/* ============================================================
   6. WORD-BY-WORD TEXT REVEAL
   ============================================================ */
function initWordReveal() {
    document.querySelectorAll('.word-reveal').forEach(para => {
        const originalText = para.textContent;
        const words = originalText.trim().split(/\s+/);

        para.setAttribute('aria-label', originalText);
        para.innerHTML = words
            .map(w => `<span class="word-wrap"><span class="word-inner">${w}</span></span>`)
            .join(' ');

        const inners = para.querySelectorAll('.word-inner');

        ScrollTrigger.create({
            trigger: para,
            start: 'top 82%',
            once: true,
            onEnter() {
                gsap.to(inners, { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: 'power2.out' });
            },
        });
    });
}

/* ============================================================
   7. PARALLAX NAS IMAGENS SECUNDÁRIAS
   ============================================================ */
function initParallax() {
    document.querySelectorAll('.parallax-image').forEach(img => {
        gsap.fromTo(img,
            { yPercent: -8 },
            {
                yPercent: 8,
                ease: 'none',
                scrollTrigger: {
                    trigger: img,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.5,
                },
            }
        );
    });
}

/* ============================================================
   8. YEAR MARKERS — PARALLAX DE PROFUNDIDADE
   ============================================================ */
function initYearMarkers() {
    document.querySelectorAll('.year-marker').forEach(marker => {
        const text = marker.querySelector('.year-marker-text');
        if (!text) return;

        gsap.set(text, { opacity: 0 });

        gsap.fromTo(text,
            { yPercent: -30 },
            {
                yPercent: 30,
                ease: 'none',
                scrollTrigger: {
                    trigger: marker,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 2,
                },
            }
        );

        ScrollTrigger.create({
            trigger: marker,
            start: 'top 90%',
            end: 'bottom 10%',
            onEnter()     { gsap.to(text, { opacity: 1, duration: 0.5 }); },
            onLeave()     { gsap.to(text, { opacity: 0, duration: 0.4 }); },
            onEnterBack() { gsap.to(text, { opacity: 1, duration: 0.5 }); },
            onLeaveBack() { gsap.to(text, { opacity: 0, duration: 0.4 }); },
        });
    });
}

/* ============================================================
   9. CONTADORES — animados ao entrar no viewport
   ============================================================ */
function initCounters() {
    function countUp(el, target, duration) {
        if (el.dataset.counted) return;
        el.dataset.counted = '1';

        const start = performance.now();
        const from  = parseInt(el.textContent) || 0;

        (function tick(now) {
            const t = Math.min((now - start) / duration, 1);
            const e = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.floor(from + (target - from) * e);
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target;
        })(start);
    }

    document.querySelectorAll('[data-target]').forEach(el => {
        const target = parseInt(el.dataset.target);
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter() { countUp(el, target, 1400); },
        });
    });
}

/* ============================================================
   10. NAV SMOOTH SCROLL
   ============================================================ */
function initNavScroll() {
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        const fresh = link.cloneNode(true);
        link.parentNode.replaceChild(fresh, link);

        fresh.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(fresh.getAttribute('href'));
            if (!target) return;

            document.getElementById('hamburger')?.classList.remove('active');
            document.getElementById('nav-links')?.classList.remove('open');

            const y = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: y, behavior: 'smooth' });
        });
    });
}

/* ============================================================
   BOOT
   ============================================================ */
function bootAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    initLoader();
    initGlobalProgress();
    initActiveNav();
    initColorTransitions();
    initCareerPins();
    initWordReveal();
    initParallax();
    initYearMarkers();
    initCounters();
    initNavScroll();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootAnimations);
} else {
    bootAnimations();
}
