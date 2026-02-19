// ─── Notebook — Journal Entry List Style ───
import { posts } from '../data/posts.js';

function formatDate(s) {
  return new Date(s).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function makeJournalItem(post, index) {
  const el = document.createElement('a');
  el.className = 'journal-item';
  // Link to the generic blog-post page with query param
  el.href = `/blog-post.html?id=${post.id}`;
  
  el.innerHTML = `
    <div class="journal-item__left">
      <div class="journal-item__emoji">${post.emoji}</div>
      <div class="journal-item__date">${formatDate(post.date)}</div>
      <span class="journal-item__lang">${post.lang}</span>
    </div>
    <div class="journal-item__content">
      <div class="journal-item__title">${post.title}</div>
      <div class="journal-item__preview">${post.preview}</div>
      <span class="journal-item__read">Read &rarr; ${post.readTime}</span>
    </div>
  `;

  return el;
}

export function initNotebook() {
  const list = document.getElementById('journal-list');
  if (!list) return;

  const items = posts.map((p, i) => makeJournalItem(p, i));
  items.forEach(el => list.appendChild(el));

  // Reveal on scroll
  const obs = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.05 }
  );
  items.forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.06}s`;
    obs.observe(el);
  });
}
