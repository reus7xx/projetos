/* ============================================================
   MAIN.JS — GSAP Animations, Cursor, Nav, Interactions
   ============================================================ */

'use strict';

/* ============================================================
   BOOTSTRAP
   ============================================================ */
function boot() {
    gsap.registerPlugin(ScrollTrigger);

    initCursor();
    initNav();
    initHero();
    initSplitTitles();
    initOrigem();
    initKickboxing();
    initGlory();
    initUFC();
    initCampeao();
    initFooter();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
} else {
    boot();
}

/* ============================================================
   CUSTOM CURSOR — red circle with lerp delay
   ============================================================ */
function initCursor() {
    const dot      = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (!dot || !follower) return;

    let mx = 0, my = 0;
    let fx = 0, fy = 0;  // follower position
    let dx = 0, dy = 0;  // dot position

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    (function tick() {
        dx = lerp(dx, mx, 0.88);
        dy = lerp(dy, my, 0.88);
        dot.style.left = dx + 'px';
        dot.style.top  = dy + 'px';

        fx = lerp(fx, mx, 0.1);
        fy = lerp(fy, my, 0.1);
        follower.style.left = fx + 'px';
        follower.style.top  = fy + 'px';

        requestAnimationFrame(tick);
    })();

    // Hover state
    document.querySelectorAll('a, button').forEach(el => {
        el.addEventListener('mouseenter', () => {
            dot.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            dot.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });
}

/* ============================================================
   NAVIGATION — scroll style + hamburger
   ============================================================ */
function initNav() {
    const nav       = document.getElementById('nav');
    const burger    = document.getElementById('hamburger');
    const navLinks  = document.getElementById('nav-links');
    if (!nav) return;

    // Scroll-based style
    const onScroll = () => {
        nav.classList.toggle('scrolled', window.scrollY > 70);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Hamburger
    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            const open = burger.classList.toggle('active');
            navLinks.classList.toggle('open', open);
            burger.setAttribute('aria-expanded', String(open));
        });

        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                burger.classList.remove('active');
                navLinks.classList.remove('open');
                burger.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // Smooth anchor scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const y = target.getBoundingClientRect().top + window.scrollY - 68;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });
    });
}

/* ============================================================
   HERO — entrance animation
   ============================================================ */
function initHero() {
    const tl = gsap.timeline({ delay: 0.4 });

    tl.to('#hero-name', {
        y: 0, opacity: 1,
        duration: 1.3,
        ease: 'power4.out',
    })
    .to('#hero-subtitle', {
        y: 0, opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
    }, '-=0.7')
    .to('#hero-tagline', {
        y: 0, opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
    }, '-=0.5')
    .from('.scroll-indicator', {
        opacity: 0, y: 18,
        duration: 0.8,
        ease: 'power2.out',
    }, '-=0.3');
}

/* ============================================================
   SPLIT TITLES — letter-by-letter reveal on scroll
   ============================================================ */
function splitIntoChars(el) {
    const text = el.textContent;
    el.innerHTML = [...text].map(ch =>
        ch === ' '
            ? `<span style="display:inline-block;width:0.28em" aria-hidden="true"> </span>`
            : `<span class="char" style="display:inline-block;transform:translateY(110%);opacity:0" aria-hidden="true">${ch}</span>`
    ).join('');
    // Keep text accessible
    el.setAttribute('aria-label', text);
    return el.querySelectorAll('.char');
}

function initSplitTitles() {
    document.querySelectorAll('.split-title').forEach(el => {
        const chars = splitIntoChars(el);

        ScrollTrigger.create({
            trigger: el,
            start: 'top 82%',
            once: true,
            onEnter() {
                gsap.to(chars, {
                    y: 0, opacity: 1,
                    duration: 0.75,
                    stagger: 0.028,
                    ease: 'power3.out',
                });
            },
        });
    });
}

/* ============================================================
   COUNTER — eased count-up
   ============================================================ */
function countUp(el, target, duration = 1400) {
    // Guard against double-animation (animations.js may also register counters)
    if (el.dataset.counted) return;
    el.dataset.counted = '1';

    const start = performance.now();
    const from  = parseInt(el.textContent) || 0;

    (function tick(now) {
        const t = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - t, 3); // cubic ease-out
        el.textContent = Math.floor(from + (target - from) * e);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
    })(start);
}

function hookCounters(root) {
    (root || document).querySelectorAll('[data-target]').forEach(el => {
        ScrollTrigger.create({
            trigger: el,
            start: 'top 88%',
            once: true,
            onEnter() {
                countUp(el, parseInt(el.dataset.target));
            },
        });
    });
}

/* ============================================================
   SECTION 1 — ORIGEM
   ============================================================ */
function initOrigem() {
    const sec = document.getElementById('origem');

    // Subtle background tint on enter
    ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%', end: 'bottom 40%',
        onEnter:     () => gsap.to(sec, { backgroundColor: '#0e0b0a', duration: 1.2 }),
        onLeaveBack: () => gsap.to(sec, { backgroundColor: '#0a0a0a', duration: 1.2 }),
    });

    // Text side — excludes .word-reveal (handled by animations.js)
    gsap.from('#origem .origem-text > *:not(.word-reveal)', {
        scrollTrigger: { trigger: '#origem .origem-text', start: 'top 80%', once: true },
        opacity: 0, x: -36,
        duration: 0.85, stagger: 0.12,
        ease: 'power3.out',
    });

    // Detail items
    gsap.from('.detail-item', {
        scrollTrigger: { trigger: '.origin-detail', start: 'top 85%', once: true },
        opacity: 0, x: -18,
        duration: 0.6, stagger: 0.1,
        ease: 'power2.out',
    });

    // Image reveal + parallax (parallax also handled by animations.js via scrub, skip y here)
    gsap.from('.image-placeholder', {
        scrollTrigger: { trigger: '.image-placeholder', start: 'top 80%', once: true },
        opacity: 0, x: 36,
        duration: 1, ease: 'power3.out',
    });

    // Parallax gerenciado por animations.js (initParallax)

    hookCounters(sec);
}

/* ============================================================
   SECTION 2 — KICKBOXING
   ============================================================ */
function initKickboxing() {
    const sec = document.getElementById('kickboxing');

    // Lead text
    // .word-reveal paragraphs handled by animations.js — skip them here

    // Stat cards burst in
    gsap.from('.stat-card', {
        scrollTrigger: { trigger: '.stats-grid', start: 'top 80%', once: true },
        opacity: 0, y: 36, scale: 0.94,
        duration: 0.7, stagger: 0.12,
        ease: 'back.out(1.4)',
    });

    hookCounters(sec);

    // Horizontal timeline line + items
    ScrollTrigger.create({
        trigger: '#kb-timeline',
        start: 'top 82%',
        once: true,
        onEnter() {
            document.getElementById('kb-timeline').classList.add('animated');

            document.querySelectorAll('.timeline-item-h').forEach((el, i) => {
                setTimeout(() => el.classList.add('visible'), 350 + i * 200);
            });
        },
    });
}

/* ============================================================
   SECTION 3 — GLORY
   ============================================================ */
function initGlory() {
    const sec    = document.getElementById('glory');
    const gTitle = sec.querySelector('.glitch-title');

    // Glitch title appears
    ScrollTrigger.create({
        trigger: gTitle,
        start: 'top 80%',
        once: true,
        onEnter() {
            gsap.from(gTitle, {
                opacity: 0, scale: 1.08,
                duration: 0.7, ease: 'power3.out',
            });
        },
    });

    // .word-reveal handled by animations.js

    // "2x" big number scales in
    gsap.from('.glory-big-text', {
        scrollTrigger: { trigger: '.glory-highlight', start: 'top 80%', once: true },
        opacity: 0, scale: 0.45,
        duration: 1.1, ease: 'back.out(1.6)',
    });

    gsap.from('.glory-title-text', {
        scrollTrigger: { trigger: '.glory-highlight', start: 'top 80%', once: true },
        opacity: 0, y: 28,
        duration: 0.8, delay: 0.35, ease: 'power3.out',
    });

    gsap.from('.glory-stat', {
        scrollTrigger: { trigger: '.glory-stats', start: 'top 85%', once: true },
        opacity: 0, y: 28,
        duration: 0.7, stagger: 0.18, ease: 'power3.out',
    });

    hookCounters(sec);
}

/* ============================================================
   SECTION 4 — UFC
   ============================================================ */
function initUFC() {
    const sec = document.getElementById('ufc');
    const rip = document.getElementById('ufc-rip');

    // Clip-path "rip" — red covers section, then rips away upward
    ScrollTrigger.create({
        trigger: sec,
        start: 'top 55%',
        once: true,
        onEnter() {
            gsap.fromTo(rip,
                { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
                {
                    clipPath: 'polygon(0 0, 100% 0, 100% 0%, 0 0%)',
                    duration: 1.4,
                    ease: 'power4.inOut',
                }
            );
        },
    });

    // .word-reveal handled by animations.js

    // Timeline items appear one by one as they scroll in
    document.querySelectorAll('.timeline-item-v').forEach((item, i) => {
        ScrollTrigger.create({
            trigger: item,
            start: 'top 84%',
            once: true,
            onEnter() {
                gsap.to(item, {
                    opacity: 1, x: 0,
                    duration: 0.75,
                    ease: 'power3.out',
                });
            },
        });
    });
}

/* ============================================================
   SECTION 5 — CAMPEÃO
   ============================================================ */
function initCampeao() {
    const sec = document.getElementById('campeao');

    // Big POATAN title reveals from bottom
    ScrollTrigger.create({
        trigger: sec,
        start: 'top 65%',
        once: true,
        onEnter() {
            gsap.to('#campeao-title', {
                y: 0,
                duration: 1.3,
                ease: 'power4.out',
            });
            gsap.to('#campeao-subtitle', {
                opacity: 1, y: 0,
                duration: 0.9, delay: 0.45,
                ease: 'power3.out',
            });
        },
    });

    // Stats count up with staggered entrance
    document.querySelectorAll('.campeao-num').forEach((num, i) => {
        const target = parseInt(num.dataset.target);
        ScrollTrigger.create({
            trigger: num,
            start: 'top 88%',
            once: true,
            onEnter() {
                gsap.to(num, {
                    opacity: 1, y: 0,
                    duration: 0.65,
                    delay: i * 0.09,
                    ease: 'power3.out',
                    onComplete() { countUp(num, target); },
                });
            },
        });
    });

    gsap.to('#campeao-phrase', {
        scrollTrigger: { trigger: '#campeao-phrase', start: 'top 90%', once: true },
        opacity: 1, y: 0,
        duration: 1.1, ease: 'power3.out',
    });
}

/* ============================================================
   FOOTER — dissolve effect
   ============================================================ */
function initFooter() {
    ScrollTrigger.create({
        trigger: '#footer',
        start: 'top 72%',
        once: true,
        onEnter() {
            gsap.from('.footer-credits, .footer-inspired', {
                opacity: 0, y: 16,
                duration: 0.85, stagger: 0.18,
                ease: 'power2.out',
            });

            // Trigger particle dissolve after short pause
            setTimeout(() => {
                if (window.footerDis) window.footerDis.trigger();
            }, 900);
        },
    });
}
