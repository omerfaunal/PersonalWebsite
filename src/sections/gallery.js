// ─── Active Life Gallery ───
// Horizontal-scroll photo lanes with parallax and lightbox.

const CAMERA_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`;

const lanes = [
  {
    label: '🏃 Running',
    cards: [
      { caption: 'Race day finish line — placeholder', placeholder: true },
      { caption: 'Training run along the Cam — placeholder', placeholder: true },
      { caption: 'Medal collection — placeholder', placeholder: true },
      { caption: 'Sunrise tempo run — placeholder', placeholder: true },
    ],
  },
  {
    label: '🚴 Cycling',
    cards: [
      { caption: 'Weekend century ride — placeholder', placeholder: true },
      { caption: 'Cambridge countryside route — placeholder', placeholder: true },
      { caption: 'Bike setup — placeholder', placeholder: true },
      { caption: 'Strava heatmap — placeholder', placeholder: true },
    ],
  },
  // {
  //   label: '✨ Life',
  //   cards: [
  //     { caption: 'Exploring Cambridge — placeholder', placeholder: true },
  //     { caption: 'LEGO Technic build session — placeholder', placeholder: true },
  //     { caption: 'Tea ritual (no milk) — placeholder', placeholder: true },
  //     { caption: 'Travel adventures — placeholder', placeholder: true },
  //   ],
  // },
];

function createCard(data) {
  const card = document.createElement('div');
  card.className = 'gallery-card';

  if (data.placeholder) {
    card.innerHTML = `
      <div class="gallery-card__placeholder">
        ${CAMERA_SVG}
        <span>Photo placeholder</span>
      </div>
      <div class="gallery-card__caption">${data.caption}</div>
    `;
  } else {
    card.innerHTML = `
      <img class="gallery-card__image" src="${data.src}" alt="${data.caption}" loading="lazy" />
      <div class="gallery-card__caption">${data.caption}</div>
    `;
  }

  // Lightbox click
  card.addEventListener('click', () => {
    openLightbox(data);
  });

  return card;
}

function openLightbox(data) {
  const lightbox = document.getElementById('lightbox');
  const imageEl = document.getElementById('lightbox-image');
  const captionEl = document.getElementById('lightbox-caption');

  if (data.placeholder) {
    imageEl.innerHTML = `<div class="gallery-card__placeholder" style="width:600px;height:400px;">${CAMERA_SVG}<span>Photo placeholder</span></div>`;
  } else {
    imageEl.innerHTML = `<img src="${data.src}" alt="${data.caption}" />`;
  }
  captionEl.textContent = data.caption;
  lightbox.classList.add('active');
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('active');
}

export function initGallery() {
  const container = document.getElementById('gallery-lanes');
  if (!container) return;

  lanes.forEach((lane) => {
    const laneEl = document.createElement('div');
    laneEl.className = 'gallery-lane';

    // Label
    const label = document.createElement('div');
    label.className = 'gallery-lane__label';
    label.textContent = lane.label;
    laneEl.appendChild(label);

    // Cards
    lane.cards.forEach((card) => {
      laneEl.appendChild(createCard(card));
    });

    container.appendChild(laneEl);
  });

  // Lightbox close
  const closeBtn = document.getElementById('lightbox-close');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // Parallax effect on scroll — lanes scroll at different speeds
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const laneEls = container.querySelectorAll('.gallery-lane');
        const rect = container.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = -rect.top / window.innerHeight;
          laneEls.forEach((el, i) => {
            const speed = (i % 2 === 0) ? 30 : -20;
            el.scrollLeft = Math.max(0, progress * speed * 10);
          });
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
