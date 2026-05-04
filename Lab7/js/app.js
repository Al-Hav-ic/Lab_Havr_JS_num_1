/* =====================================================
   TechStore — app.js
   Чистий JavaScript (без фреймворків)
   Реалізує:
     1. Адаптивне меню (гамбургер для Mobile)
     2. Карусель (автозміна, стрілки, індикатори, анімація ковзання)
     3. SPA-навігація між секціями
     4. Завантаження каталогу через fetch (Ajax / JSON)
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────────
     1. ГАМБУРГЕР (Mobile меню)
  ────────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mainNav   = document.getElementById('main-nav');

  hamburger.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Закрити меню при кліці за його межами
  document.addEventListener('click', (e) => {
    if (!mainNav.contains(e.target) && !hamburger.contains(e.target)) {
      mainNav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    }
  });


  /* ──────────────────────────────────────────────
     2. SPA НАВІГАЦІЯ
  ────────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');

  function showSection(name) {
    sections.forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(`section-${name}`);
    if (target) target.classList.remove('hidden');

    navLinks.forEach(l => l.classList.toggle('active', l.dataset.section === name));

    // Закриваємо мобільне меню після вибору
    mainNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);

    // Lazy-load catalog / specials
    if (name === 'catalog') loadCatalog();
    if (name === 'specials') loadSpecials();
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showSection(link.dataset.section);
    });
  });

  // Починаємо з головної секції
  showSection('home');


  /* ──────────────────────────────────────────────
     3. КАРУСЕЛЬ
  ────────────────────────────────────────────── */
  const track     = document.getElementById('carousel-track');
  const slides    = track ? track.querySelectorAll('.carousel-slide') : [];
  const dotsWrap  = document.getElementById('carousel-dots');
  const btnPrev   = document.getElementById('carousel-prev');
  const btnNext   = document.getElementById('carousel-next');
  const TOTAL     = slides.length;
  let   current   = 0;
  let   autoTimer = null;

  // Створюємо індикатори-крапки
  const dots = [];
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Слайд ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function goTo(index) {
    current = (index + TOTAL) % TOTAL;
    // Анімація ковзання — просто переміщаємо track (CSS transition вже задано)
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
    resetTimer();
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    autoTimer = setInterval(next, 4500);
  }
  function resetTimer() {
    clearInterval(autoTimer);
    startTimer();
  }

  if (TOTAL > 0) {
    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);

    // Пауза при наведенні
    track.closest('.carousel').addEventListener('mouseenter', () => clearInterval(autoTimer));
    track.closest('.carousel').addEventListener('mouseleave', startTimer);

    // Swipe на мобільному
    let touchStartX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    });

    startTimer();
  }


  /* ──────────────────────────────────────────────
     4. AJAX — Завантаження каталогу
  ────────────────────────────────────────────── */
  let catalogLoaded = false;

  async function loadCatalog() {
    if (catalogLoaded) return;
    const container = document.getElementById('catalog-content');
    try {
      const res  = await fetch('data/categories.json');
      if (!res.ok) throw new Error('Network error');
      const cats = await res.json();
      catalogLoaded = true;
      renderCategories(cats);
    } catch {
      container.innerHTML = '<p style="color:var(--clr-muted)">Не вдалось завантажити каталог. Перевірте з\'єднання або запустіть через локальний сервер.</p>';
    }
  }

  function renderCategories(cats) {
    const container = document.getElementById('catalog-content');
    let html = '<div class="category-grid">';
    cats.forEach(c => {
      html += `
        <div class="category-card" data-shortname="${c.shortname}">
          <h3>${c.name}</h3>
          <p>${c.notes || ''}</p>
        </div>`;
    });
    html += '</div>';
    html += `<div class="text-center" style="margin-top:2rem;text-align:center">
      <button class="btn-buy" style="padding:0.6rem 1.6rem;font-size:0.9rem" onclick="window.loadSpecialDirect()">
        🎁 Спеціальна пропозиція
      </button>
    </div>`;
    container.innerHTML = html;

    // Прив'язуємо кліки
    container.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', () => loadCategory(card.dataset.shortname));
    });
  }

  async function loadCategory(shortname) {
    const container = document.getElementById('catalog-content');
    container.innerHTML = '<div class="spinner"></div>';
    try {
      const res  = await fetch(`data/${shortname}.json`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      renderProducts(data);
    } catch {
      container.innerHTML = '<p style="color:var(--clr-muted)">Не вдалось завантажити товари.</p>';
    }
  }

  function renderProducts(data) {
    const container = document.getElementById('catalog-content');
    let html = `
      <button class="btn-back" id="btn-back">&#8592; Назад до каталогу</button>
      <h3 style="font-family:var(--font-head);margin-bottom:1.25rem">${data.categoryName}</h3>
      <div class="product-grid">`;
    data.items.forEach(item => {
      const img = `https://placehold.co/300x300/1a1a2e/e94560?text=${encodeURIComponent(item.shortname)}&font=montserrat`;
      html += `
        <div class="product-card">
          <img src="${img}" alt="${item.name}" />
          <div class="product-info">
            <h4>${item.name}</h4>
            <p>${item.description}</p>
            <div class="product-footer">
              <span class="price">${item.price}</span>
              <button class="btn-buy">Купити</button>
            </div>
          </div>
        </div>`;
    });
    html += '</div>';
    container.innerHTML = html;
    document.getElementById('btn-back').addEventListener('click', () => {
      catalogLoaded = false;
      loadCatalog();
    });
  }


  /* ──────────────────────────────────────────────
     5. AJAX — Спеціальна пропозиція (випадкова категорія)
  ────────────────────────────────────────────── */
  async function loadSpecials() {
    const container = document.getElementById('specials-content');
    container.innerHTML = '<div class="spinner"></div>';
    try {
      const res  = await fetch('data/categories.json');
      const cats = await res.json();
      const pick = cats[Math.floor(Math.random() * cats.length)];

      const res2 = await fetch(`data/${pick.shortname}.json`);
      const data = await res2.json();

      let html = `<p class="specials-tag">🎲 Випадково обрано: ${data.categoryName}</p>`;
      html += '<div class="product-grid">';
      data.items.forEach(item => {
        const img = `https://placehold.co/300x300/7b2d00/ffddd2?text=${encodeURIComponent(item.shortname)}&font=montserrat`;
        html += `
          <div class="product-card">
            <img src="${img}" alt="${item.name}" />
            <div class="product-info">
              <h4>${item.name}</h4>
              <p>${item.description}</p>
              <div class="product-footer">
                <span class="price">${item.price}</span>
                <button class="btn-buy">Купити</button>
              </div>
            </div>
          </div>`;
      });
      html += '</div>';
      container.innerHTML = html;
    } catch {
      container.innerHTML = '<p style="color:var(--clr-muted)">Помилка завантаження.</p>';
    }
  }

  // Доступ із каталогу
  window.loadSpecialDirect = function () {
    showSection('specials');
    loadSpecials();
  };

});
