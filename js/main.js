// Открытие/Закрытие бургера и выбор города
window.addEventListener('DOMContentLoaded', () => {
  const catalogBtn = document.querySelector('.header__catalog-btn');
  const mainMenu = document.querySelector('.main-menu');
  const mainMenuClose = document.querySelector('.main-menu__close');

  if (catalogBtn && mainMenu) {
    catalogBtn.addEventListener('click', () => {
      mainMenu.classList.toggle('main-menu--active');
    });
  }

  if (mainMenuClose && mainMenu) {
    mainMenuClose.addEventListener('click', () => {
      mainMenu.classList.remove('main-menu--active');
    });
  }

  // Функционал выбора города
  const cityBtn = document.querySelector('.location__city');
  const cityName = document.querySelector('.location__city-name');
  const cityList = document.querySelector('.location__sublist');
  const cityOptions = document.querySelectorAll('.location__sublink');

  if (cityBtn && cityList) {
    cityBtn.addEventListener('click', () => {
      cityBtn.classList.toggle('location__city--active');
    });

    cityOptions.forEach(option => {
      option.addEventListener('click', () => {
        cityName.textContent = option.textContent;
        cityBtn.classList.remove('location__city--active');
      });
    });
  }
});

// Отрисовка карточек
document.addEventListener('DOMContentLoaded', () => {
  let productsData = [];

  // Функция фильтрации товаров
  const filterProducts = (products) => {
    const typeFilters = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(checkbox => checkbox.value);
    const statusFilter = document.querySelector('input[name="status"]:checked')?.value;
    const sortSelect = document.querySelector('.catalog__sort-select');

    let filteredProducts = [...products];

    // Фильтрация по типу
    if (typeFilters.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.type.some(type => typeFilters.includes(type))
      );
    }

    // Фильтрация по наличию
    if (statusFilter === 'instock') {
      filteredProducts = filteredProducts.filter(product =>
        Object.values(product.availability).some(quantity => quantity > 0)
      );
    }

    // Сортировка
    if (sortSelect) {
      switch (sortSelect.value) {
        case 'price-min':
          filteredProducts.sort((a, b) => a.price.new - b.price.new);
          break;
        case 'price-max':
          filteredProducts.sort((a, b) => b.price.new - a.price.new);
          break;
        case 'rating-max':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
      }
    }

    return filteredProducts;
  };

  // Функция отрисовки товаров
  const renderProducts = (products) => {
    const list = document.querySelector('.catalog__list');
    if (!list) return;

    list.innerHTML = '';

    products.forEach(item => {
      const cardHTML = `
        <li class="catalog__item">
          <div class="product-card">
            <div class="product-card__visual">
              <img class="product-card__img" src="${item.image}" height="436" width="290" alt="${item.name}">
              <div class="product-card__more">
                <a href="#" class="product-card__link btn btn--icon">
                  <span class="btn__text">В корзину</span>
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="images/sprite.svg#icon-basket"></use>
                  </svg>
                </a>
                <a href="#" class="product-card__link btn btn--secondary">
                  <span class="btn__text">Подробнее</span>
                </a>
              </div>
            </div>
            <div class="product-card__info">
              <h2 class="product-card__title">${item.name}</h2>
              ${item.price.old ? `
              <span class="product-card__old">
                <span class="product-card__old-number">${item.price.old}</span>
                <span class="product-card__old-add">₽</span>
              </span>` : ''}
              <span class="product-card__price">
                <span class="product-card__price-number">${item.price.new}</span>
                <span class="product-card__price-add">₽</span>
              </span>
              ${item.tooltip ? `
              <div class="product-card__tooltip tooltip">
                ${item.tooltip}
              </div>` : ''}
            </div>
          </div>
        </li>
      `;
      list.insertAdjacentHTML('beforeend', cardHTML);
    });
  };

  // Загрузка и инициализация данных
  const initializeProducts = async () => {
    try {
      const response = await fetch('./data/data.json');
      productsData = await response.json();
      renderProducts(filterProducts(productsData));

      // Обработчики событий для фильтров
      document.querySelectorAll('input[name="type"]').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          renderProducts(filterProducts(productsData));
        });
      });

      document.querySelectorAll('input[name="status"]').forEach(radio => {
        radio.addEventListener('change', () => {
          renderProducts(filterProducts(productsData));
        });
      });

      const sortSelect = document.querySelector('.catalog__sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', () => {
          renderProducts(filterProducts(productsData));
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  initializeProducts();
});

// Динамический подсчёт товаров по категориям
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data/data.json');
    const products = await response.json();

    const typeCounts = {};
    products.forEach(product => {
      product.type.forEach(t => {
        typeCounts[t] = (typeCounts[t] || 0) + 1;
      });
    });

    document.querySelectorAll('input[name="type"]').forEach(checkbox => {
      const countElement = checkbox.closest('.custom-checkbox').querySelector('.custom-checkbox__count');
      countElement.textContent = typeCounts[checkbox.value] || 0;
    });
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
});
