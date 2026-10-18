'use strict';
const root = document.documentElement;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
      else if (entry.boundingClientRect.top >= window.innerHeight) entry.target.classList.remove('visible');
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.feature-card, .setup-reveal').forEach((element, index) => {
    element.style.setProperty('--reveal-delay', `${(index % (innerWidth < 760 ? 1 : 2)) * 140}ms`);
  });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
  root.classList.add('motion-ready');
}
const progress = document.querySelector('.progress');
let scrollQueued = false;
function updateProgress() {
  const range = root.scrollHeight - root.clientHeight;
  progress.style.width = `${range > 0 ? (window.scrollY / range) * 100 : 0}%`;
  scrollQueued = false;
}
window.addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateProgress); }
}, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
const input = document.querySelector('#demo-input');
const output = document.querySelector('#demo-output');
const start = document.querySelector('#demo-start');
const standardTypingDelay = 65;
const status = document.querySelector('#demo-status');
const count = document.querySelector('#character-count');
let timer;
let running = false;
let position = 0;
let characters = [];
function stop(message) {
  clearTimeout(timer);
  running = false;
  start.textContent = 'Try typing ↗';
  input.disabled = false;
  status.textContent = message;
}
function reset() {
  stop('Ready when you are.');
  output.replaceChildren();
  const placeholder = document.createElement('span');
  placeholder.className = 'output-placeholder';
  placeholder.textContent = 'Your words will appear here.';
  output.append(placeholder);
  position = 0;
  count.textContent = `0 / ${Array.from(input.value).length}`;
}
function tick() {
  position += 1;
  output.textContent = characters.slice(0, position).join('');
  count.textContent = `${position} / ${characters.length}`;
  if (position >= characters.length) { stop('Done. Try another line.'); return; }
  timer = setTimeout(tick, standardTypingDelay);
}
start.addEventListener('click', () => {
  if (running) { stop('Paused. Your words are right here.'); return; }
  characters = Array.from(input.value);
  if (!input.value.trim()) { status.textContent = 'Add a few words first.'; input.focus(); return; }
  position = 0;
  running = true;
  input.disabled = true;
  output.textContent = '';
  start.textContent = 'Stop preview ■';
  status.textContent = 'Typing…';
  if (reducedMotion.matches) {
    output.textContent = input.value;
    count.textContent = `${characters.length} / ${characters.length}`;
    stop('Preview complete. Motion reduced to match your preferences.');
  } else tick();
});
document.querySelector('#demo-reset').addEventListener('click', reset);
input.addEventListener('input', reset);
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && running) stop('Stopped. Ready when you are.');
});
reset();

// Motion is decorative: content stays readable without it or with reduced motion.
const hero = document.querySelector('.hero');
const showcase = document.querySelector('.hero-visual');
const product = document.querySelector('.product-frame');
const words = [...document.querySelectorAll('.scroll-word')];
const manifesto = document.querySelector('.manifesto');
function updateCinematicScroll() {
  if (reducedMotion.matches) return;
  const heroRect = hero.getBoundingClientRect();
  showcase.style.setProperty('--hero-scroll', String(Math.min(1, Math.max(0, -heroRect.top / heroRect.height))));
  const rect = manifesto.getBoundingClientRect();
  const travel = Math.max(0, Math.min(1, (window.innerHeight * .7 - rect.top) / (rect.height - window.innerHeight * .3)));
  manifesto.style.setProperty('--chapter-progress', String(travel));
  words.forEach((word, index) => {
    const phase = Math.min(1, Math.max(0, (travel - index * .2) / .23));
    word.style.setProperty('--word-opacity', String(.2 + phase * .8));
    word.style.setProperty('--word-rise', `${(1 - phase) * 32}px`);
    word.style.setProperty('--word-blur', `${(1 - phase) * 3}px`);
    word.style.setProperty('--word-fill', `${phase * 100}%`);
  });
}
let cinematicQueued = false;
window.addEventListener('scroll', () => {
  if (cinematicQueued) return;
  cinematicQueued = true;
  requestAnimationFrame(() => { updateCinematicScroll(); cinematicQueued = false; });
}, {passive:true});
window.addEventListener('resize', updateCinematicScroll);
updateCinematicScroll();
const finePointer = window.matchMedia('(pointer: fine)');
showcase.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const rect = showcase.getBoundingClientRect();
  product.style.setProperty('--tilt-x', `${((event.clientX - rect.left) / rect.width - .5) * 18}deg`);
  product.style.setProperty('--tilt-y', `${-((event.clientY - rect.top) / rect.height - .5) * 14}deg`);
});
showcase.addEventListener('pointerleave', () => {
  product.style.setProperty('--tilt-x', '0deg'); product.style.setProperty('--tilt-y', '0deg');
});
document.querySelectorAll('.feature-card').forEach(card => card.addEventListener('pointermove', event => {
  if (reducedMotion.matches || !finePointer.matches) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
  card.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
}));
const canvas = document.querySelector('.hero-particles');
const context = canvas.getContext('2d');
let particleFrame;
let heroVisible = true;
let particles = [];
let lastFrame = 0;
function sizeParticles() {
  const rect = hero.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  particles = Array.from({length: rect.width < 760 ? 28 : 70}, () => ({x: Math.random() * rect.width, y: Math.random() * rect.height, speed: .2 + Math.random() * .6, length: 8 + Math.random() * 30, alpha:.08 + Math.random() * .3}));
}
function drawParticles(time) {
  if (!heroVisible || document.hidden || reducedMotion.matches) { particleFrame = undefined; return; }
  const delta = Math.min((time - lastFrame) / 16.67 || 1, 2); lastFrame = time;
  const width = hero.clientWidth; const height = hero.clientHeight;
  context.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.y -= p.speed * delta; p.x += p.speed * .15 * delta;
    if (p.y < -p.length) { p.y = height + p.length; p.x = Math.random() * width; }
    const gradient = context.createLinearGradient(p.x, p.y, p.x - 4, p.y + p.length);
    gradient.addColorStop(0, `rgba(231,200,136,${p.alpha})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.strokeStyle = gradient; context.lineWidth = .7;
    context.beginPath(); context.moveTo(p.x, p.y); context.lineTo(p.x - 4, p.y + p.length); context.stroke();
  });
  particleFrame = requestAnimationFrame(drawParticles);
}
function resumeParticles() { if (!particleFrame && heroVisible && !document.hidden && !reducedMotion.matches) particleFrame = requestAnimationFrame(drawParticles); }
if (context) {
  sizeParticles(); resumeParticles();
  window.addEventListener('resize', sizeParticles);
  document.addEventListener('visibilitychange', resumeParticles);
  reducedMotion.addEventListener('change', resumeParticles);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    heroVisible = entries[0].isIntersecting; resumeParticles();
  }).observe(hero);
}

// The setup animation plays only while the instructions are on screen.
const setupSteps = document.querySelector('.setup-steps');
if (setupSteps && 'IntersectionObserver' in window) {
  new IntersectionObserver(entries => {
    setupSteps.classList.toggle('is-playing', entries[0].isIntersecting && !reducedMotion.matches);
  }, {threshold: .12}).observe(setupSteps);
  reducedMotion.addEventListener('change', () => {
    const bounds = setupSteps.getBoundingClientRect();
    setupSteps.classList.toggle('is-playing', !reducedMotion.matches && bounds.top < innerHeight && bounds.bottom > 0);
  });
}

const copyClone = document.querySelector('#copy-clone');
copyClone.addEventListener('click', async () => {
  const command = document.querySelector('#clone-command');
  const message = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(command.textContent);
    copyClone.textContent = 'Copied ✓';
    message.textContent = 'Paste it into Terminal and press Return.';
  } catch {
    message.textContent = 'Clipboard access was blocked. Try the Copy button again in Chrome or Edge.';
  }
});

// Native dialogs keep keyboard focus inside and support Escape to close.
document.querySelectorAll('[data-legal]').forEach(button => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.legal);
    if (dialog && !dialog.open) dialog.showModal();
  });
});
document.querySelectorAll('.legal-dialog').forEach(dialog => {
  dialog.querySelector('.legal-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
});
