// ─── Main Entry Point ───
import './styles/index.css';
import { initNav }           from './components/nav.js';
import { initHero }          from './sections/hero.js';
import { initNameParticles } from './sections/hero-particles.js';
import { initStory }         from './sections/bento.js';
import { initGallery }       from './sections/gallery.js';
import { initNotebook }      from './sections/notebook.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initHero();
  initNameParticles();
  initStory();
  initGallery();
  initNotebook();
});
