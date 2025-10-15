const viewport = document.querySelector('.viewport');
const cards = document.querySelector('.cards');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');

let currentX = 0; // valor de deslocamento atual (px)
const cardGap = 20; // deve bater com o gap do CSS
const cardWidth = (() => {
  const first = cards.querySelector('.card');
  return first ? first.getBoundingClientRect().width : 250;
})();
const step = Math.round(cardWidth + cardGap); // quanto deslocar por clique

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

// calcula o máximo deslocável (cards total width - viewport width)
function maxScroll() {
  const totalWidth = cards.scrollWidth; // largura real do conteúdo
  const visible = viewport.clientWidth;
  return Math.max(0, totalWidth - visible);
}

function updateTransform() {
  // negativo porque movemos o conteúdo pra esquerda para "rolar" pra direita
  const max = maxScroll();
  currentX = clamp(currentX, 0, max);
  cards.style.transform = `translateX(${-currentX}px)`;
}

next.addEventListener('click', () => {
  currentX += step;
  updateTransform();
});

prev.addEventListener('click', () => {
  currentX -= step;
  updateTransform();
});

// permitir arrastar com mouse (opcional, útil e natural)
let isDown = false;
let startX = 0;
let startScroll = 0;

viewport.addEventListener('mousedown', (e) => {
  isDown = true;
  viewport.classList.add('dragging');
  startX = e.clientX;
  startScroll = currentX;
  e.preventDefault();
});
window.addEventListener('mouseup', () => {
  if (!isDown) return;
  isDown = false;
  viewport.classList.remove('dragging');
});
window.addEventListener('mousemove', (e) => {
  if (!isDown) return;
  const dx = e.clientX - startX;
  currentX = clamp(startScroll - dx, 0, maxScroll());
  updateTransform();
});

// toque (mobile)
let touchStartX = 0;
let touchStartScroll = 0;
viewport.addEventListener('touchstart', (e) => {
  touchStartX = e.touches[0].clientX;
  touchStartScroll = currentX;
});
viewport.addEventListener('touchmove', (e) => {
  const dx = e.touches[0].clientX - touchStartX;
  currentX = clamp(touchStartScroll - dx, 0, maxScroll());
  updateTransform();
});
