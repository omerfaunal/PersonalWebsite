// ─── Experience, Projects, Education sections ───
// Separate data arrays, separate render targets

const ARROW = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>`;
const CAMERA = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`;

// ─── EXPERIENCE DATA ───
const workData = [
  {
    date: 'June 2024 – Sep 2025',
    location: 'New York (Remote)',
    badge: 'Work',
    title: 'Software Engineer',
    org: { name: 'WorkmateLabs', url: '#' },
    logo: '/assets/workmate.svg',
    body: `Founding engineer at a VC-backed startup backed by <strong>Kleiner Perkins, OpenAI Startup Fund, and Greylock Partners</strong>. Owned the full pipeline from prototype to production launch.`,
    bullets: [
      'Designed and deployed LLM-based services with production APIs, monitoring, logging, and CI/CD',
      'Architected backend systems on GCloud using Python, TypeScript, Next.js, LangChain, and Braintrust',
    ],
    tags: ['LLM', 'TypeScript', 'Python', 'GCloud', 'CI/CD', 'BrainTrust', 'PostgreSQL', 'Next.js'],
  },
  {
    date: 'June 2022 – May 2024',
    location: 'Istanbul, Türkiye',
    badge: 'Work',
    title: 'Software Engineer',
    org: { name: 'Invent Analytics', url: 'https://www.inventanalytics.com' },
    logo: '/assets/invent.svg',
    body: `Built cost-efficient, scalable data pipelines for ML workflows on large-scale retail time-series data. Translated business requirements into statistical models with data scientists.`,
    bullets: [
      'Engineered statistical features (seasonality, promotions, outliers) — ~98% forecast accuracy',
      'Productionised models behind REST APIs with Docker, PostgreSQL, Node.js, and AWS',
    ],
    tags: ['PySpark', 'Databricks', 'Python', 'AWS', 'Docker', 'Backend'],
  },
  {
    date: 'Ongoing',
    location: 'Cambridge, UK',
    badge: 'Teaching',
    title: 'Teaching Assistant',
    org: { name: 'University of Cambridge', url: 'https://www.cam.ac.uk' },
    logo: '/assets/uni_cam.jpg',
    body: `TA for several university courses including computational physics. Teaching, marking, grading, and running help sessions for complex problem sets.`,
    tags: ['Computational Physics', 'Statistical Physics', 'Statistics'],
  },
];

// ─── PROJECTS DATA ───
const projectData = [
  {
    label: 'Fintech · AI Platform',
    title: 'BuffQuant',
    body: `I wanted to invest. Didn't have time, so I followed YouTube finance channels. Then I realised I was analysing the analysers more than they analysed companies. Classic engineer move: when in doubt, <strong>overengineer the problem until it becomes a thesis</strong>.
    <br/><br/>It started as rage-coding. Three months, a massive database, mild insomnia, and unexpected expertise in YouTube API rate limits later, it ended as a fintech platform.`,
    tags: ['Python', 'TypeScript', 'LLM', 'NLP', 'AI/ML', 'AI Pipeline', 'Full-Stack'],
    link: { url: 'https://buffquant.com', text: 'Visit buffquant.com' },
    visual: '/assets/buffquant.png', // replace with actual screenshot
    visualLabel: 'buffquant.com',
  },
  {
    label: 'C++ · HPC · Research',
    title: 'High-Performance Computing',
    body: `Research-driven projects in numerical methods and parallel computing, pushing simulation performance to its limits.`,
    bullets: [
      'GPU-accelerated Euler equation solvers (CUDA) - benchmarking compute vs. memory transfer overhead',
      'Distributed algorithms with MPI - strong/weak scaling analysis on multi-core clusters',
      'SLIC method low-latency optimisation via compiler intrinsics and memory layout restructuring',
    ],
    tags: ['C++', 'CUDA', 'MPI', 'Parallel Computing'],
    visual: '/assets/animation.gif',
    visualLabel: 'HPC Simulation',
  },
  {
    label: 'Registration System',
    title: 'BuRegist',
    body: `A comprehensive course registration system designed for university scale. Handles complex prerequisites, quota management, and conflict detection with a modern, user-friendly interface.`,
    tags: ['Flutter', 'Dart', 'Firebase'],
    link: { url: 'https://github.com/omerfaunal/BuRegistApp', text: 'View Repo' },
    visual: '/assets/buregist.png',
    visualLabel: 'BuRegist Interface',
  },
  {
    label: 'Physics Simulation',
    title: 'Particle Based Simulations',
    body: `A collection of interactive particle-based simulations exploring fluid dynamics, gravity, and emergent behavior. Built to visualise complex physical phenomena in real-time.`,
    tags: ['C++', 'OpenGL', 'Physics', 'Simulation'],
    link: { url: 'https://github.com/omerfaunal/Particle-Based-Simulations', text: 'View Code' },
    visual: '/assets/pbs.png',
    visualLabel: 'Particle Sim',
  },
  {
    label: 'Blockchain Consensus',
    title: 'Bitcoin Consensus Proof',
    body: `An implementation and formal verification of the Bitcoin consensus algorithm. Demonstrates the cryptographic underpinnings and distributed consensus mechanism of the Bitcoin protocol.`,
    tags: ['Distributed Systems', 'Cryptography', 'Consensus'],
    link: { url: 'https://github.com/ozankaymak/bitcoin-consensus-proof', text: 'View Code' },
    visual: '/assets/btc.png',
    visualLabel: 'Consensus Proof',
  },
];

// ─── EDUCATION DATA ───
const educationData = [
  {
    date: 'Sept 2025 – 2026 (Expected)',
    location: 'Cambridge, UK',
    badge: 'MPhil',
    title: 'MPhil in Scientific Computing',
    org: { name: 'University of Cambridge', url: 'https://www.cam.ac.uk' },
    logo: '/assets/uni_cam.jpg',
    body: `Fully funded <strong>Cambridge Trust Scholar</strong>. Research in numerical methods, HPC, advanced simulation, and C++.`,
    tags: ['HPC', 'Numerical Methods', 'C++', 'Simulation'],
  },
  {
    date: 'Sep 2019 – June 2024',
    location: 'Istanbul, Türkiye',
    badge: 'BSc',
    title: 'Double Major — Physics & Computer Engineering',
    org: { name: 'Boğaziçi University', url: 'https://www.boun.edu.tr/en' },
    logo: '/assets/boun.svg',
    body: `BSc Computer Engineering <strong>(GPA 3.83/4.0)</strong> and BSc Physics <strong>(GPA 3.67/4.0)</strong>. One of Turkey's most selective and prestigious universities.`,
    tags: ['Physics', 'Computer Science', 'Computer Engineering', 'Mathematics'],
  },
  {
    date: 'Ongoing',
    badge: 'Skills',
    title: 'Core Competencies',
    body: '',
    skills: [
      'Systems & HPC', 'Low-Latency C++', 'Mathematical Modelling',
      'Numerical Methods', 'Data & ML Pipelines', 'Full-Stack Engineering',
      'Distributed Computing', 'Algorithm Design', 'GPU Computing (CUDA)',
      'Cloud Infrastructure (AWS, GCloud)',
    ],
  },
];

// ─── AWARDS DATA ───
const awardsData = [
  { icon: '🎓', strong: 'Cambridge Trust Scholar', text: 'Fully funded MPhil scholarship at Cambridge' },
  { icon: '🏆', strong: 'YKS — 16th / 2.5 million', text: 'National university entrance exam (2019)' },
  { icon: '💻', strong: 'Turkish Programming Contest', text: '5th place, team of 3, among 56 teams (2019)' },
  { icon: '🥈', strong: 'National Math Olympiad', text: 'Silver Medal, 2017 & 2018' },
];

// ─── RENDERERS ───

function makeTlItem(data, badgeClass) {
  const el = document.createElement('div');
  el.className = 'tl-item';

  let logoHtml = '';
  if (data.logo) {
    logoHtml = `<div class="tl-logo"><img src="${data.logo}" alt="${data.org?.name || ''} logo" /></div>`;
  }

  let bodyHtml = data.body ? `<div class="tl-body">${data.body}` : '<div class="tl-body">';
  if (data.bullets) {
    bodyHtml += `<ul class="tl-bullets">${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
  }
  bodyHtml += '</div>';

  let skillsHtml = '';
  if (data.skills) {
    skillsHtml = `<div class="tl-tags" style="margin-top:0.8rem">${data.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')}</div>`;
  }

  let tagsHtml = data.tags ? `<div class="tl-tags">${data.tags.map(t => `<span class="tl-tag">${t}</span>`).join('')}</div>` : '';

  el.innerHTML = `
    <div class="tl-left">
      <div class="tl-date-group">
        <span class="tl-date">${data.date || ''}</span>
        ${data.location ? `<span class="tl-location">${data.location}</span>` : ''}
      </div>
      <div class="tl-dot-container">
        ${logoHtml}
        <div class="tl-dot-line"></div>
      </div>
    </div>
    <div class="tl-content">
      <div class="tl-header">
        <span class="tl-badge ${badgeClass}">${data.badge || ''}</span>
      </div>
      <div class="tl-title">${data.title}</div>
      ${data.org ? `<div class="tl-org"><a href="${data.org.url}" target="_blank" rel="noopener">${data.org.name} ${ARROW}</a></div>` : ''}
      ${bodyHtml}
      ${skillsHtml}
      ${tagsHtml}
    </div>
  `;
  return el;
}

function makeProjectCard(data) {
  const el = document.createElement('div');
  el.className = 'project-card';

  let bulletsHtml = '';
  if (data.bullets) {
    bulletsHtml = `<ul class="tl-bullets" style="margin-bottom:0.8rem">${data.bullets.map(b => `<li>${b}</li>`).join('')}</ul>`;
  }

  let visualHtml = data.visual === 'placeholder'
    ? `<div class="project-card__visual">${CAMERA}<span>${data.visualLabel || 'Screenshot'}</span></div>`
    : `<div class="project-card__visual"><img src="${data.visual}" alt="${data.title}" /></div>`;

  el.innerHTML = `
    <div class="project-card__text">
      <div class="project-card__label">${data.label}</div>
      <div class="project-card__title">${data.title}</div>
      <div class="project-card__body">${data.body}</div>
      ${bulletsHtml}
      <div class="project-card__tags">${(data.tags || []).map(t => `<span class="tl-tag">${t}</span>`).join('')}</div>
      ${data.link ? `<a href="${data.link.url}" target="_blank" rel="noopener" class="project-card__link">${data.link.text} ${ARROW}</a>` : ''}
    </div>
    ${visualHtml}
  `;
  return el;
}

function makeAwardCard(data) {
  const el = document.createElement('div');
  el.className = 'award-card';
  el.innerHTML = `
    <div class="award-card__icon">${data.icon}</div>
    <div class="award-card__text"><strong>${data.strong}</strong>${data.text}</div>
  `;
  return el;
}

function observeReveal(elements) {
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1 }
  );
  elements.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.08}s`;
    obs.observe(el);
  });
}

export function initStory() {
  // Experience
  const expTl = document.getElementById('experience-timeline');
  if (expTl) {
    const items = workData.map(d => makeTlItem(d, 'tl-badge--forest'));
    items.forEach(el => expTl.appendChild(el));
    observeReveal(items);
  }

  // Projects
  const projList = document.getElementById('projects-list');
  if (projList) {
    const cards = projectData.map(d => makeProjectCard(d));
    cards.forEach(el => projList.appendChild(el));
    observeReveal(cards);
  }

  // Education
  const eduTl = document.getElementById('education-timeline');
  if (eduTl) {
    const items = educationData.map(d => makeTlItem(d, 'tl-badge--blue'));
    items.forEach(el => eduTl.appendChild(el));
    observeReveal(items);
  }

  // Awards
  const awardsGrid = document.getElementById('awards-grid');
  if (awardsGrid) {
    const cards = awardsData.map(d => makeAwardCard(d));
    cards.forEach(el => awardsGrid.appendChild(el));
    observeReveal(cards);
  }
}
