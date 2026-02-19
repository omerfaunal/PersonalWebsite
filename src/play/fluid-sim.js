// ─── Stable Fluids Simulation (Jos Stam, 1999) ───
// Solves Navier-Stokes on a 2D grid in real-time.
// Each frame: add sources → diffuse → advect → project (divergence-free)

export function initFluid(canvas) {
  const ctx = canvas.getContext('2d');
  const N   = 128;          // Grid resolution (NxN)
  const SZ  = (N + 2) * (N + 2); // Include boundary cells
  const dt  = 0.15;
  const DIFF = 0.00002;     // Diffusion rate
  const VISC = 0.0000001;   // Viscosity

  // ── Flat array helpers ──
  const idx = (x, y) => x + (N + 2) * y;

  function mk()  { return new Float32Array(SZ); }

  let dens = mk(), dens_prev = mk();
  let u    = mk(), u_prev    = mk();
  let v    = mk(), v_prev    = mk();

  // ── Boundary conditions ──
  function set_bnd(b, x) {
    for (let i = 1; i <= N; i++) {
      x[idx(0,     i)] = b === 1 ? -x[idx(1, i)] : x[idx(1,     i)];
      x[idx(N + 1, i)] = b === 1 ? -x[idx(N, i)] : x[idx(N,     i)];
      x[idx(i,     0)] = b === 2 ? -x[idx(i, 1)] : x[idx(i,     1)];
      x[idx(i, N + 1)] = b === 2 ? -x[idx(i, N)] : x[idx(i,     N)];
    }
    x[idx(0,     0)]     = 0.5 * (x[idx(1, 0)]     + x[idx(0, 1)]);
    x[idx(0,     N + 1)] = 0.5 * (x[idx(1, N + 1)] + x[idx(0, N)]);
    x[idx(N + 1, 0)]     = 0.5 * (x[idx(N, 0)]     + x[idx(N + 1, 1)]);
    x[idx(N + 1, N + 1)] = 0.5 * (x[idx(N, N + 1)] + x[idx(N + 1, N)]);
  }

  // ── Gauss-Seidel linear solver ──
  function lin_solve(b, x, x0, a, c) {
    const inv_c = 1.0 / c;
    for (let k = 0; k < 20; k++) {
      for (let j = 1; j <= N; j++) {
        for (let i = 1; i <= N; i++) {
          x[idx(i, j)] = (x0[idx(i, j)] + a * (
            x[idx(i - 1, j)] + x[idx(i + 1, j)] +
            x[idx(i, j - 1)] + x[idx(i, j + 1)]
          )) * inv_c;
        }
      }
      set_bnd(b, x);
    }
  }

  function diffuse(b, x, x0) {
    const a = dt * DIFF * N * N;
    lin_solve(b, x, x0, a, 1 + 4 * a);
  }

  function diffuse_vel(b, x, x0) {
    const a = dt * VISC * N * N;
    lin_solve(b, x, x0, a, 1 + 4 * a);
  }

  // ── Advection (semi-Lagrangian) ──
  function advect(b, d, d0, u_field, v_field) {
    const dt0 = dt * N;
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        let x = i - dt0 * u_field[idx(i, j)];
        let y = j - dt0 * v_field[idx(i, j)];
        x = Math.max(0.5, Math.min(N + 0.5, x));
        y = Math.max(0.5, Math.min(N + 0.5, y));
        const i0 = Math.floor(x), i1 = i0 + 1;
        const j0 = Math.floor(y), j1 = j0 + 1;
        const s1 = x - i0, s0 = 1 - s1;
        const t1 = y - j0, t0 = 1 - t1;
        d[idx(i, j)] = s0 * (t0 * d0[idx(i0, j0)] + t1 * d0[idx(i0, j1)])
                     + s1 * (t0 * d0[idx(i1, j0)] + t1 * d0[idx(i1, j1)]);
      }
    }
    set_bnd(b, d);
  }

  // ── Projection (make divergence-free via pressure solve) ──
  function project(u_f, v_f, p, div) {
    const h = 1.0 / N;
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        div[idx(i, j)] = -0.5 * h * (
          u_f[idx(i + 1, j)] - u_f[idx(i - 1, j)] +
          v_f[idx(i, j + 1)] - v_f[idx(i, j - 1)]
        );
        p[idx(i, j)] = 0;
      }
    }
    set_bnd(0, div); set_bnd(0, p);
    lin_solve(0, p, div, 1, 4);
    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        u_f[idx(i, j)] -= 0.5 * (p[idx(i + 1, j)] - p[idx(i - 1, j)]) / h;
        v_f[idx(i, j)] -= 0.5 * (p[idx(i, j + 1)] - p[idx(i, j - 1)]) / h;
      }
    }
    set_bnd(1, u_f); set_bnd(2, v_f);
  }

  // ── Simulation steps ──
  function vel_step() {
    // Swap + diffuse
    [u, u_prev] = [u_prev, u];
    [v, v_prev] = [v_prev, v];
    diffuse_vel(1, u, u_prev);
    diffuse_vel(2, v, v_prev);
    project(u, v, u_prev, v_prev);
    // Swap + advect
    [u, u_prev] = [u_prev, u];
    [v, v_prev] = [v_prev, v];
    advect(1, u, u_prev, u_prev, v_prev);
    advect(2, v, v_prev, u_prev, v_prev);
    project(u, v, u_prev, v_prev);
  }

  function dens_step() {
    [dens, dens_prev] = [dens_prev, dens];
    diffuse(0, dens, dens_prev);
    [dens, dens_prev] = [dens_prev, dens];
    advect(0, dens, dens_prev, u, v);
  }

  // ── Rendering ──
  // Use a hue palette: forest green (120°) → moss → warm amber on high density
  function render() {
    const W = canvas.width, H = canvas.height;
    const cellW = W / N, cellH = H / N;
    const imgData = ctx.createImageData(W, H);
    const pix = imgData.data;

    for (let j = 1; j <= N; j++) {
      for (let i = 1; i <= N; i++) {
        const d = Math.min(1, dens[idx(i, j)]);

        // Color ramp: deep forest → moss→ warm amber
        let r, g, b;
        if (d < 0.4) {
          const t = d / 0.4;
          r = Math.round(27  + t * (45  - 27));
          g = Math.round(67  + t * (106 - 67));
          b = Math.round(50  + t * (79  - 50));
        } else if (d < 0.75) {
          const t = (d - 0.4) / 0.35;
          r = Math.round(45  + t * (82  - 45));
          g = Math.round(106 + t * (183 - 106));
          b = Math.round(79  + t * (136 - 79));
        } else {
          const t = (d - 0.75) / 0.25;
          r = Math.round(82  + t * (200 - 82));
          g = Math.round(183 + t * (140 - 183));
          b = Math.round(136 + t * (40  - 136));
        }

        // Fill pixel rectangle
        const px0 = Math.round((i - 1) * cellW);
        const py0 = Math.round((j - 1) * cellH);
        const px1 = Math.round(i * cellW);
        const py1 = Math.round(j * cellH);
        const a   = Math.round(d * 255);

        for (let py = py0; py < py1; py++) {
          for (let px = px0; px < px1; px++) {
            const off = (py * W + px) * 4;
            pix[off]     = r;
            pix[off + 1] = g;
            pix[off + 2] = b;
            pix[off + 3] = a;
          }
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  // ── Mouse interaction ──
  let prevMx = -1, prevMy = -1, dragging = false;

  function gridCoord(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const gx = Math.round(((clientX - rect.left) / rect.width)  * N);
    const gy = Math.round(((clientY - rect.top)  / rect.height) * N);
    return [
      Math.max(1, Math.min(N, gx)),
      Math.max(1, Math.min(N, gy)),
    ];
  }

  function addSource(clientX, clientY, prevX, prevY) {
    const [gx, gy] = gridCoord(clientX, clientY);
    dens_prev[idx(gx, gy)] += 80;   // Density splash

    if (prevX >= 0) {
      const [px, py] = gridCoord(prevX, prevY);
      u_prev[idx(gx, gy)] += (gx - px) * 8;  // Velocity from drag
      v_prev[idx(gx, gy)] += (gy - py) * 8;
    }
  }

  canvas.addEventListener('mousedown',  e => { dragging = true; prevMx = e.clientX; prevMy = e.clientY; });
  canvas.addEventListener('mouseup',    () => { dragging = false; prevMx = -1; prevMy = -1; });
  canvas.addEventListener('mouseleave', () => { dragging = false; });
  canvas.addEventListener('mousemove',  e => {
    if (!dragging) return;
    addSource(e.clientX, e.clientY, prevMx, prevMy);
    prevMx = e.clientX; prevMy = e.clientY;
  });

  // Touch
  canvas.addEventListener('touchstart',  e => { const t = e.touches[0]; prevMx = t.clientX; prevMy = t.clientY; }, { passive: true });
  canvas.addEventListener('touchend',    () => { prevMx = -1; prevMy = -1; });
  canvas.addEventListener('touchmove',   e => {
    e.preventDefault();
    const t = e.touches[0];
    addSource(t.clientX, t.clientY, prevMx, prevMy);
    prevMx = t.clientX; prevMy = t.clientY;
  }, { passive: false });

  // ── Adding a continuous ambient swirl so it's never empty ──
  let frame = 0;
  function addAmbient() {
    frame++;
    // Gentle swirl from centre every few frames
    if (frame % 8 === 0) {
      const cx = Math.round(N / 2), cy = Math.round(N / 2);
      const angle = frame * 0.04;
      const r = 16;
      const sx = cx + Math.round(Math.cos(angle) * r);
      const sy = cy + Math.round(Math.sin(angle) * r);
      dens_prev[idx(sx, sy)] += 2;
      u_prev[idx(sx, sy)] += Math.cos(angle + Math.PI / 2) * 3;
      v_prev[idx(sx, sy)] += Math.sin(angle + Math.PI / 2) * 3;
    }
  }

  // ── Loop ──
  function loop() {
    // Clear per-frame source arrays (they're added to each frame)
    u_prev.fill(0); v_prev.fill(0); dens_prev.fill(0);
    addAmbient();
    vel_step();
    dens_step();
    render();
    requestAnimationFrame(loop);
  }

  loop();
}
