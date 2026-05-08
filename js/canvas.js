/* ============================================================
   CANVAS.JS — Particle Systems
   HeroParticleSystem | GloryParticleSystem | FooterDissolve
   ============================================================ */

'use strict';

/* ============================================================
   HERO CANVAS — Golden particles forming a sphere
   ============================================================ */
class HeroParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.mouse  = { x: -9999, y: -9999 };
        this.time   = 0;
        this.count  = 160;
        this.particles = [];

        this.resize();
        this.build();
        this.bindEvents();
        this.loop();
    }

    resize() {
        this.canvas.width  = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.cx = this.canvas.width  / 2;
        this.cy = this.canvas.height / 2;
        this.r  = Math.min(this.canvas.width, this.canvas.height) * 0.27;
    }

    build() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            this.particles.push(this._make(i));
        }
    }

    _make(i) {
        // Fibonacci sphere — even distribution over a disc
        const phi   = Math.acos(1 - 2 * (i + 0.5) / this.count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const flatY = 0.38;

        return {
            tx:    this.cx + this.r * Math.sin(phi) * Math.cos(theta),
            ty:    this.cy + this.r * Math.sin(phi) * Math.sin(theta) * flatY,
            x:     Math.random() * this.canvas.width,
            y:     Math.random() * this.canvas.height,
            vx:    0,
            vy:    0,
            sz:    Math.random() * 2.2 + 0.4,
            alpha: 0,
            aMax:  Math.random() * 0.65 + 0.25,
            spd:   0.025 + Math.random() * 0.02,
            off:   Math.random() * Math.PI * 2,
            hue:   38 + Math.random() * 24,
            sat:   65 + Math.random() * 25,
            lit:   52 + Math.random() * 18,
        };
    }

    bindEvents() {
        window.addEventListener('resize', () => { this.resize(); this.build(); });
        document.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        document.addEventListener('mouseleave', () => {
            this.mouse.x = -9999;
            this.mouse.y = -9999;
        });
    }

    update() {
        this.time += 0.016;
        const repelR = 110;

        for (const p of this.particles) {
            // Gentle bobbing around target position
            const bx = Math.cos(this.time * 0.55 + p.off) * 3.5;
            const by = Math.sin(this.time * 0.7  + p.off) * 3.5;
            const dx = p.x - this.mouse.x;
            const dy = p.y - this.mouse.y;
            const d  = Math.sqrt(dx * dx + dy * dy) || 1;

            // Mouse repulsion
            if (d < repelR) {
                const force = (1 - d / repelR) * 5;
                p.vx += (dx / d) * force;
                p.vy += (dy / d) * force;
            }

            // Spring toward target
            p.vx += (p.tx + bx - p.x) * p.spd;
            p.vy += (p.ty + by - p.y) * p.spd;

            // Damping
            p.vx *= 0.86;
            p.vy *= 0.86;

            p.x += p.vx;
            p.y += p.vy;

            // Fade in
            if (p.alpha < p.aMax) p.alpha = Math.min(p.alpha + 0.008, p.aMax);
        }
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Connection lines between nearby particles
        for (let i = 0; i < this.particles.length; i++) {
            const a = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const b  = this.particles[j];
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 44) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(212,175,55,${(1 - d / 44) * 0.25 * Math.min(a.alpha, b.alpha)})`;
                    ctx.lineWidth   = 0.5;
                    ctx.stroke();
                }
            }
        }

        // Particles
        for (const p of this.particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue},${p.sat}%,${p.lit}%,${p.alpha})`;
            ctx.fill();
        }

        // Subtle centre glow
        const grad = ctx.createRadialGradient(this.cx, this.cy, 0, this.cx, this.cy, this.r * 1.1);
        grad.addColorStop(0,   'rgba(212,175,55,0.04)');
        grad.addColorStop(0.5, 'rgba(212,175,55,0.01)');
        grad.addColorStop(1,   'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

/* ============================================================
   GLORY CANVAS — Floating red particles background
   ============================================================ */
class GloryParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.count  = 70;
        this.time   = 0;
        this.particles = [];

        this.resize();
        this.build();
        this.loop();

        window.addEventListener('resize', () => { this.resize(); this.build(); });
    }

    resize() {
        const p = this.canvas.parentElement;
        this.canvas.width  = p.offsetWidth;
        this.canvas.height = p.offsetHeight;
    }

    _make(initY) {
        return {
            x:    Math.random() * this.canvas.width,
            y:    initY !== undefined ? initY : this.canvas.height + 10,
            vx:   (Math.random() - 0.5) * 0.7,
            vy:   -(Math.random() * 0.45 + 0.15),
            sz:   Math.random() * 3 + 0.8,
            aMax: Math.random() * 0.55 + 0.1,
            life: 0,
            maxL: Math.random() * 280 + 100,
            idx:  Math.random() * 100,
        };
    }

    build() {
        this.particles = [];
        for (let i = 0; i < this.count; i++) {
            const p = this._make(Math.random() * this.canvas.height);
            p.life = Math.random() * p.maxL;
            this.particles.push(p);
        }
    }

    update() {
        this.time += 0.01;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.x += p.vx + Math.sin(this.time + p.idx * 0.3) * 0.35;
            p.y += p.vy;
            p.life++;
            if (p.life >= p.maxL || p.y < -12) {
                this.particles[i] = this._make();
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const p of this.particles) {
            const ratio = p.life / p.maxL;
            const alpha = p.aMax * Math.sin(ratio * Math.PI);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(200,16,46,${alpha})`;
            this.ctx.fill();
        }
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

/* ============================================================
   FOOTER DISSOLVE — Text bursts into gold particles
   ============================================================ */
class FooterDissolve {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx    = canvas.getContext('2d');
        this.particles = [];
        this.active = false;
        this.animId = null;

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const p = this.canvas.parentElement;
        this.canvas.width  = p.offsetWidth  || 400;
        this.canvas.height = p.offsetHeight || 120;
    }

    trigger() {
        if (this.active) return;
        this.active = true;
        this._spawn();
        this._loop();
    }

    _spawn() {
        const el   = document.getElementById('footer-poatan');
        if (!el) return;
        const elR  = el.getBoundingClientRect();
        const parR = this.canvas.parentElement.getBoundingClientRect();
        const ox   = elR.left - parR.left;
        const oy   = elR.top  - parR.top;

        for (let i = 0; i < 180; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3.5 + 0.5;
            this.particles.push({
                x:     ox + Math.random() * elR.width,
                y:     oy + Math.random() * elR.height,
                vx:    Math.cos(angle) * speed,
                vy:    Math.sin(angle) * speed - 1.2,
                sz:    Math.random() * 3.5 + 0.8,
                alpha: Math.random() * 0.9 + 0.1,
                hue:   36 + Math.random() * 28,
                life:  0,
                maxL:  Math.random() * 100 + 60,
            });
        }
    }

    _update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x  += p.vx;
            p.y  += p.vy;
            p.vy += 0.04;
            p.vx *= 0.98;
            p.life++;
            if (p.life >= p.maxL) this.particles.splice(i, 1);
        }
    }

    _draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const p of this.particles) {
            const t     = p.life / p.maxL;
            const alpha = p.alpha * (1 - t);
            const sz    = p.sz * (1 - t * 0.5);
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, sz, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${p.hue},72%,58%,${alpha})`;
            this.ctx.fill();
        }
    }

    _loop() {
        this._update();
        this._draw();
        if (this.particles.length > 0) {
            this.animId = requestAnimationFrame(() => this._loop());
        }
    }
}

/* ============================================================
   INIT — called after DOMContentLoaded
   ============================================================ */
function initCanvases() {
    const heroEl = document.getElementById('hero-canvas');
    if (heroEl) window.heroPS = new HeroParticleSystem(heroEl);

    const gloryEl = document.getElementById('glory-canvas');
    if (gloryEl) window.gloryPS = new GloryParticleSystem(gloryEl);

    const footerEl = document.getElementById('footer-canvas');
    if (footerEl) window.footerDis = new FooterDissolve(footerEl);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCanvases);
} else {
    initCanvases();
}
