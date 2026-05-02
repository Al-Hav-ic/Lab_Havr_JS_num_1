document.addEventListener("DOMContentLoaded", () => {
    const mainContent = document.getElementById("main-content");
    const navCatalog = document.getElementById("nav-catalog");
    const btnHomeCatalog = document.getElementById("btn-home-catalog");

    // Обробники подій для навігації
    navCatalog.addEventListener("click", (e) => {
        e.preventDefault();
        loadCatalog();
    });

    if (btnHomeCatalog) {
        btnHomeCatalog.addEventListener("click", () => loadCatalog());
    }

    // --- Функції рендерингу ---

    // 1. Завантаження та відображення списку категорій
    async function loadCatalog() {
        showSpinner();
        try {
            const response = await fetch('data/categories.json');
            const categories = await response.json();
            
            let html = `<h2 class="mb-4 text-center">Каталог товарів</h2><div class="row g-4">`;
            
            categories.forEach(category => {
                html += `
                    <div class="col-md-4">
                        <div class="card h-100 shadow-sm card-hover" onclick="loadCategoryItems('${category.shortname}')">
                            <div class="card-body text-center">
                                <h5 class="card-title fw-bold">${category.name}</h5>
                                <p class="card-text text-muted">${category.notes || 'Lorem ipsum dolor sit amet.'}</p>
                            </div>
                        </div>
                    </div>
                `;
            });

            // Кнопка Specials (Випадкова категорія)
            html += `</div>
                <div class="text-center mt-5">
                    <button class="btn btn-warning btn-lg shadow" onclick="loadSpecials()">
                        🎁 Specials (Випадкова категорія)
                    </button>
                </div>`;
            
            mainContent.innerHTML = html;
        } catch (error) {
            showError("Не вдалося завантажити каталог. Перевірте з'єднання.");
        }
    }

    // 2. Завантаження конкретної категорії
    window.loadCategoryItems = async function(shortname) {
        showSpinner();
        try {
            const response = await fetch(`data/${shortname}.json`);
            const data = await response.json();
            
            let html = `
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h2>${data.categoryName}</h2>
                    <button class="btn btn-outline-secondary" onclick="document.getElementById('nav-catalog').click()">
                        &larr; Назад до каталогу
                    </button>
                </div>
                <div class="row g-4">
            `;

            data.items.forEach(item => {
                // Використовуємо placehold.co для зображень, як вимагалося
                const imgUrl = `https://placehold.co/200x200/e9ecef/495057?text=${encodeURIComponent(item.shortname)}`;
                
                html += `
                    <div class="col-md-6 col-lg-3">
                        <div class="card h-100 shadow-sm">
                            <img src="${imgUrl}" class="card-img-top product-img" alt="${item.name}" width="200" height="200">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${item.name}</h5>
                                <p class="card-text small text-muted flex-grow-1">${item.description}</p>
                                <div class="d-flex justify-content-between align-items-center mt-3">
                                    <span class="fs-5 fw-bold text-success">${item.price}</span>
                                    <button class="btn btn-sm btn-primary">Купити</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div>`;
            mainContent.innerHTML = html;
        } catch (error) {
            showError(`Не вдалося завантажити товари для категорії ${shortname}.`);
        }
    }

    // 3. Завантаження випадкової категорії
    window.loadSpecials = async function() {
        try {
            const response = await fetch('data/categories.json');
            const categories = await response.json();
            
            // Випадковий вибір за допомогою Math.random()
            const randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];
            
            loadCategoryItems(randomCategory.shortname);
        } catch (error) {
            showError("Помилка при виборі спеціальної пропозиції.");
        }
    }

    // --- Допоміжні функції ---
    function showSpinner() {
        mainContent.innerHTML = `
            <div class="d-flex justify-content-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Завантаження...</span>
                </div>
            </div>
        `;
    }

    function showError(message) {
        mainContent.innerHTML = `
            <div class="alert alert-danger mt-4" role="alert">
                ${message}
            </div>
        `;
    }
});