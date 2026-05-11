document.addEventListener('DOMContentLoaded', () => {
  /* ── HAMBURGER ── */
  const ham = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');

  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('active', open);
  });

  // Закриття меню при кліку на посилання
  document.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('active');
    });
  });

  /* ── CAROUSEL ── */
  const track = document.getElementById('track');
  const slides = track.children;
  const total = slides.length;
  const dotsWrap = document.getElementById('dots');
  let current = 0;
  let timer;

  // Створення крапок (індикаторів)
  for (let i = 0; i < total; i++) {
    const btn = document.createElement('button');
    btn.className = 'dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Слайд ${i + 1}`);
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === current)
    );
  }

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
    resetTimer();
  }

  document.getElementById('prev').addEventListener('click', () => goTo(current - 1));
  document.getElementById('next').addEventListener('click', () => goTo(current + 1));

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4000);
  }

  resetTimer();

  // Підтримка клавіатури
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Підтримка свайпів для мобільних
  let startX = null;
  track.addEventListener('touchstart', e => { 
    startX = e.touches[0].clientX; 
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) goTo(current + (dx < 0 ? 1 : -1));
    startX = null;
  });
});