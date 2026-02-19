// ─── Hero — Advanced Fluid Mesh Simulation ───

export function initHero() {
  initFluidMesh();
  initScrollFade();
}

function initScrollFade() {
  const cue = document.getElementById('scroll-cue');
  if (!cue) return;
  window.addEventListener('scroll', () => {
    cue.style.opacity = Math.max(0, 1 - window.scrollY / 250);
  }, { passive: true });
}

function initFluidMesh() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H;
  let mouse = { x: -1000, y: -1000, active: false };
  
  // Configuration
  const PARTICLE_COUNT = 140; // Increased density
  const CONNECT_DIST = 160;
  const MOUSE_Radius = 220;
  const FORCE_FACTOR = 0.6; // Stronger interaction
  
  // Forest/Nature Palette
  const COLORS = [
    { r: 45,  g: 106, b: 79 },  // Forest
    { r: 82,  g: 183, b: 136 }, // Moss
    { r: 192, g: 108, b: 62 },  // Terracotta accent
    { r: 28,  g: 67,  b: 50 },  // Dark green
  ];

  class Particle {
    constructor() {
      this.reset();
      // Start at random positions
      this.x = Math.random() * W;
      this.y = Math.random() * H;
    }

    reset() {
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.r = Math.random() * 2 + 1;
      this.c = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.a = Math.random() * 0.5 + 0.2;
      // Fluid drift properties
      this.angle = Math.random() * Math.PI * 2;
      this.spin = (Math.random() - 0.5) * 0.02;
    }

    update() {
      // Fluid underlying motion
      this.angle += this.spin;
      this.vx += Math.cos(this.angle) * 0.005;
      this.vy += Math.sin(this.angle) * 0.005;

      // Mouse interaction
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);

      if (d < MOUSE_Radius && mouse.active) {
        // Repulsion + Swirl
        const force = (MOUSE_Radius - d) / MOUSE_Radius;
        const pushX = (dx / d) * force * FORCE_FACTOR;
        const pushY = (dy / d) * force * FORCE_FACTOR;
        
        this.vx += pushX;
        this.vy += pushY;
      }

      // Friction / Speed Limit
      this.vx *= 0.96;
      this.vy *= 0.96;
      
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around with buffer
      if (this.x < -20) this.x = W + 20;
      if (this.x > W + 20) this.x = -20;
      if (this.y < -20) this.y = H + 20;
      if (this.y > H + 20) this.y = -20;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c.r}, ${this.c.g}, ${this.c.b}, ${this.a})`;
      ctx.fill();
    }
  }

  let particles = [];

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    // Re-init particles to cover new area if needed, or just keep them
    if (particles.length === 0) {
      for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(45, 106, 79, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  
  const handleMove = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = x - rect.left;
    mouse.y = y - rect.top;
    mouse.active = true;
  };

  canvas.addEventListener('mousemove', e => handleMove(e.clientX, e.clientY));
  
  // Track mouse even outside to keep 'active' state correct or for entering effect
  document.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
          handleMove(e.clientX, e.clientY);
      } else {
          mouse.active = false;
      }
  });
  
  canvas.addEventListener('mouseleave', () => { mouse.active = false; });

  resize();
  animate();
}
