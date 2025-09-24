const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const nav = $('.nav');
const indicator = $('.nav__indicator');
const links = $$('.nav__link');

function updateShrink() {
  nav.classList.toggle('nav--shrink', window.scrollY > 50);
}
window.addEventListener('scroll', updateShrink);
updateShrink();

links.forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.startsWith('#')) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = `#${entry.target.id}`;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === id));

      // move underline under active link
      const active = links.find(a => a.classList.contains('is-active'));
      if (active) {
        const r = active.getBoundingClientRect();
        const navR = nav.getBoundingClientRect();
        indicator.style.left = `${r.left - navR.left}px`;
        indicator.style.width = `${r.width}px`;
      }
    }
  });
}, { rootMargin: '-45% 0px -45% 0px', threshold: [0, 1] });

sections.forEach(s => s && io.observe(s));

const track = $('.carousel__track');
const slides = $$('.carousel__slide', track);
const prevBtn = $('.carousel__control--prev');
const nextBtn = $('.carousel__control--next');
const dotsWrap = $('.carousel__dots');
let index = 0;
let autoTimer;

function makeDots() {
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'carousel__dot' + (i === index ? ' is-active' : '');
    b.setAttribute('aria-label', `Go to slide ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(b);
  });
}
function updateDots() {
  $$('.carousel__dot', dotsWrap).forEach((d, i) => d.classList.toggle('is-active', i === index));
}
function goTo(i) {
  index = (i + slides.length) % slides.length;
  track.style.transform = `translateX(${-index * 100}%)`;
  updateDots();
  restartAuto();
}
function next() { goTo(index + 1); }
function prev() { goTo(index - 1); }

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);
function autoAdvance() { autoTimer = setInterval(next, 10000); }
function restartAuto() { clearInterval(autoTimer); autoAdvance(); }

makeDots(); goTo(0); autoAdvance();

const modal = $('#modal');
const modalImg = $('#modal-img');
const modalText = $('#modal-text');
const modalTitle = $('#modal-title');

function openModal({ src, alt, title, id }) {
  modalImg.src = src;
  modalImg.alt = alt || '';
  modalTitle.textContent = title || 'Project';
  modalText.textContent = getDescriptionForIndex(id);
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function getDescriptionForIndex(index) {
  const descriptions = [
    "Students of Pandemonium Society from Gehenna Academy are about to attend a session",
    "Students of Game Development Club, Millennium Science School. They just survived from a gun fight",
    "Students of Hyakkaryouran Dispute Mediation Committee in Hyakkiyako Academy, they are going to attend the festival"
  ];
  return descriptions[index];
}
function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
$$('.Gallery .tile').forEach(btn => {
  btn.addEventListener('click', () => {
    const img = $('img', btn);
    const id = btn.dataset.index;
    openModal({ src: img.src, alt: img.alt, title: img.alt, id});
  });
});
modal.addEventListener('click', (e) => {
  if (e.target.hasAttribute('data-close') || e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

const toggle = $('.nav__toggle');
const list = $('.nav__links');
toggle.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  list.classList.toggle('open');
});

$('#year').textContent = new Date().getFullYear();