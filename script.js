// ═══════════════════════════════════
// SCRIPT.JS – Rw_9 Bio-Link
// ═══════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. INTRO SCREEN ─────────────────────
  const intro   = document.getElementById('intro');
  const card    = document.getElementById('mainCard');
  const links   = document.querySelectorAll('.link-btn');

  // After the bar fills (~1.8s total), fade out intro and show content
  setTimeout(() => {
    intro.classList.add('out');

    setTimeout(() => {
      intro.style.display = 'none';

      // Show card
      card.classList.add('show');

      // Stagger link buttons
      links.forEach((btn, i) => {
        setTimeout(() => btn.classList.add('visible'), 120 + i * 110);
      });

      // Start music
      if (typeof window.initMusic === 'function') {
        window.initMusic();
      }

    }, 700);
  }, 1900);


  // ── 2. PARTICLE BACKGROUND ─────────────
  (function () {
    const canvas = document.getElementById('bgCanvas');
    const ctx    = canvas.getContext('2d');
    let W, H, particles = [];
    const mouse  = { x: -9999, y: -9999 };
    const COLORS = ['#00fff0', '#7b2fff', '#ffffff'];
    const COUNT  = 70;

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function rand(a, b) { return a + Math.random() * (b - a); }

    function mkParticle() {
      return {
        x:  rand(0, W), y: rand(0, H),
        r:  rand(0.5, 2.1),
        vx: rand(-0.28, 0.28), vy: rand(-0.35, 0.1),
        alpha: rand(0.1, 0.55),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        ts: rand(0.005, 0.018),
        td: Math.random() > 0.5 ? 1 : -1,
      };
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d  = Math.hypot(dx, dy);
          if (d < 110) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,255,240,${0.055 * (1 - d / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      drawLines();
      particles.forEach(p => {
        p.alpha += p.ts * p.td;
        if (p.alpha > 0.6 || p.alpha < 0.05) p.td *= -1;

        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d  = Math.hypot(dx, dy);
        if (d < 90) { p.x += dx / d * 0.7; p.y += dy / d * 0.7; }

        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      requestAnimationFrame(loop);
    }

    resize();
    for (let i = 0; i < COUNT; i++) particles.push(mkParticle());
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    loop();
  })();


  // ── 3. CARD TILT ────────────────────────
  (function () {
    const card = document.getElementById('mainCard');
    if (!card || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    let frame;
    document.addEventListener('mousemove', e => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = (e.clientX - cx) / (rect.width  / 2);
        const dy   = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(900px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg)`;
      });
    });
    document.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.5s ease';
      card.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  })();


  // ── 4. MODAL ───────────────────────────
  (function () {
    const overlay = document.getElementById('modalOverlay');
    const openBtn = document.getElementById('datenschutzBtn');
    const closeBtn = document.getElementById('modalClose');
    const okBtn   = document.getElementById('modalOk');

    const open  = () => { overlay.classList.add('open');  document.body.style.overflow = 'hidden'; };
    const close = () => { overlay.classList.remove('open'); document.body.style.overflow = ''; };

    openBtn.addEventListener('click', open);
    closeBtn.addEventListener('click', close);
    okBtn.addEventListener('click', close);
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  })();

});
