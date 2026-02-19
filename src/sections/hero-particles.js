// ─── Hero — Typographic Particle System ───
// Samples pixel data from rendered text and drives each pixel as a spring particle.
// Hover scatters; click explodes; particles always return home.

export function initNameParticles() {
  const canvas = document.getElementById('name-canvas');
  const sourceSpan = document.getElementById('hero-name-source');
  if (!canvas || !sourceSpan) return;

  const ctx = canvas.getContext('2d');
  const TEXT = 'Omer Faruk Unal.';

  // ── Colors from the design system ──
  const C_PRIMARY   = { r: 27,  g: 67,  b: 50  }; // forest-dk
  const C_SECONDARY = { r: 45,  g: 106, b: 79  }; // forest
  const C_ACCENT    = { r: 82,  g: 183, b: 136 }; // moss

  let particles = [];
  let W = 0, H = 0;
  let mouse = { x: -9999, y: -9999 };
  let exploding = false;
  let raf = null;
  let ready = false;

  // ── Particle class ──
  class Particle {
    constructor(homeX, homeY, color) {
      this.hx = homeX;  // target x
      this.hy = homeY;  // target y
      this.x  = Math.random() * W;
      this.y  = Math.random() * -50 - 10; // fall in from top
      this.vx = 0;
      this.vy = 0;
      this.color = color;
      this.size = 1.6;
      this.arrived = false;
    }

    update() {
      // Mouse interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const distSq = dx * dx + dy * dy;
      const HOVER_R = 90;

      if (distSq < HOVER_R * HOVER_R) {
        const dist = Math.sqrt(distSq);
        const force = (HOVER_R - dist) / HOVER_R;
        const repelStr = exploding ? 18 : 4;
        this.vx += (dx / dist) * force * repelStr;
        this.vy += (dy / dist) * force * repelStr;
      }

      // Spring back to home
      const STIFFNESS = exploding ? 0.012 : 0.06;
      const DAMPING   = exploding ? 0.90  : 0.80;
      this.vx += (this.hx - this.x) * STIFFNESS;
      this.vy += (this.hy - this.y) * STIFFNESS;
      this.vx *= DAMPING;
      this.vy *= DAMPING;
      this.x  += this.vx;
      this.y  += this.vy;
    }

    draw() {
      const { r, g, b, a } = this.color;
      ctx.fillStyle = `rgba(${r},${g},${b},${a})`;
      ctx.fillRect(this.x - this.size * 0.5, this.y - this.size * 0.5, this.size, this.size);
    }
  }

  // ── Sample text pixels ──
  function sampleParticles(width, height, fontSize) {
    const off = document.createElement('canvas');
    off.width  = width;
    off.height = height;
    const oc = off.getContext('2d');

    oc.clearRect(0, 0, width, height);
    oc.fillStyle = '#000';
    oc.font = `900 ${fontSize}px 'Playfair Display', serif`;
    oc.textBaseline = 'top';

    // Center text in offscreen canvas
    const textW = oc.measureText(TEXT).width;
    const startX = (width - textW) / 2;
    oc.fillText(TEXT, startX, 4);

    const data = oc.getImageData(0, 0, width, height).data;
    const pts  = [];
    const STEP = 3; // sample every N px (lower = more particles)

    for (let y = 0; y < height; y += STEP) {
      for (let x = 0; x < width; x += STEP) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] > 80) { // alpha threshold
          pts.push({ x, y });
        }
      }
    }
    return pts;
  }

  function pickColor(i, total) {
    const t = i / total;
    if (t < 0.5)  return { r: C_PRIMARY.r,   g: C_PRIMARY.g,   b: C_PRIMARY.b,   a: 0.9 };
    if (t < 0.8)  return { r: C_SECONDARY.r, g: C_SECONDARY.g, b: C_SECONDARY.b, a: 0.85 };
    return             { r: C_ACCENT.r,    g: C_ACCENT.g,    b: C_ACCENT.b,    a: 0.8 };
  }

  // ── Setup ──
  function setup() {
    // Canvas matches the span's bounding box
    const rect = sourceSpan.getBoundingClientRect();
    const parentRect = canvas.parentElement.getBoundingClientRect();

    // Font size from computed style of the source span
    const fs = parseFloat(getComputedStyle(sourceSpan).fontSize);
    const padding = 6;
    W = canvas.width  = Math.max(1, Math.round(rect.width  + padding * 2));
    H = canvas.height = Math.max(1, Math.round(fs * 1.5));

    // Position canvas exactly over the span
    canvas.style.width  = W + 'px';
    canvas.style.height = H + 'px';

    const pts = sampleParticles(W, H, fs);

    particles = pts.map((p, i) => new Particle(p.x, p.y, pickColor(i, pts.length)));
    ready = true;
  }

  // ── Animate ──
  function animate() {
    raf = requestAnimationFrame(animate);
    if (!ready) return;
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.update();
      p.draw();
    }
  }

  // ── Mouse ──
  function updateMouse(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = clientX - rect.left;
    mouse.y = clientY - rect.top;
  }

  document.addEventListener('mousemove', e => updateMouse(e.clientX, e.clientY));

  // Touch support
  document.addEventListener('touchmove', e => {
    const t = e.touches[0];
    updateMouse(t.clientX, t.clientY);
  }, { passive: true });

  canvas.addEventListener('click', () => {
    exploding = true;
    setTimeout(() => { exploding = false; }, 900);
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.x = -9999; mouse.y = -9999;
  });

  // ── Font loading guard ──
  // Use FontFace API to ensure Playfair Display is loaded before sampling
  function init() {
    // Check if font is already loaded
    if (document.fonts && document.fonts.check("900 16px 'Playfair Display'")) {
      setup();
    } else if (document.fonts) {
      document.fonts.ready.then(setup);
    } else {
      // Fallback: small delay if FontFace API unavailable
      setTimeout(setup, 300);
    }
    animate();
  }

  // Resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { ready = false; setup(); }, 200);
  });

  init();
}
