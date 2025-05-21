// Файл для реализации пагинации и всплывающих подсказок в каталоге

// Данные для примера (в реальном проекте данные могут приходить с сервера)
const mockProducts = [
  {
    id: 1,
    title: 'Потолочная люстра Ornella A4059PL-4AB (Artelamp)',
    oldPrice: '15 300',
    price: '11 540',
    image: 'images/item-1.png',
    availability: {
      'Москва': 454,
      'Оренбург': 381,
      'Санкт-Петербург': 15
    }
  },
  {
    id: 2,
    title: 'Подвесной светильник Maytoni Broni T437-PL-01-GR',
    oldPrice: '12 800',
    price: '9 600',
    image: 'images/item-2.png',
    availability: {
      'Москва': 120,
      'Оренбург': 85,
      'Санкт-Петербург': 32
    }
  },
  {
    id: 3,
    title: 'Настенный светильник Citilux Идальго CL434321',
    oldPrice: '7 200',
    price: '5 690',
    image: 'images/item-3.png',
    availability: {
      'Москва': 75,
      'Оренбург': 42,
      'Санкт-Петербург': 18
    }
  },
  {
    id: 4,
    title: 'Потолочный светильник Favourite Pannikin 2375-5C',
    oldPrice: '18 500',
    price: '14 800',
    image: 'images/item-4.png',
    availability: {
      'Москва': 95,
      'Оренбург': 62,
      'Санкт-Петербург': 28
    }
  },
  {
    id: 5,
    title: 'Подвесной светильник Maytoni Broni T437-PL-01-W',
    oldPrice: '13 200',
    price: '10 560',
    image: 'images/item-5.png',
    availability: {
      'Москва': 110,
      'Оренбург': 78,
      'Санкт-Петербург': 25
    }
  },
  {
    id: 6,
    title: 'Настенный светильник Citilux Идальго CL434322',
    oldPrice: '7 500',
    price: '5 990',
    image: 'images/item-6.png',
    availability: {
      'Москва': 65,
      'Оренбург': 38,
      'Санкт-Петербург': 12
    }
  },
  {
    id: 7,
    title: 'Потолочный светильник Favourite Pannikin 2375-3C',
    oldPrice: '16 800',
    price: '13 440',
    image: 'images/item-7.png',
    availability: {
      'Москва': 85,
      'Оренбург': 52,
      'Санкт-Петербург': 20
    }
  },
  {
    id: 8,
    title: 'Подвесной светильник Maytoni Broni T437-PL-01-B',
    oldPrice: '12 500',
    price: '9 990',
    image: 'images/item-8.png',
    availability: {
      'Москва': 100,
      'Оренбург': 65,
      'Санкт-Петербург': 22
    }
  }
];

// Константы
const ITEMS_PER_PAGE = 6;

// DOM-элементы
const catalogList = document.querySelector('.catalog__list');
const paginationContainer = document.querySelector('.catalog__pagination');

// Текущая страница
let currentPage = 1;

// Функция для создания карточки товара
function createProductCard(product) {
  const productCard = document.createElement('li');
  productCard.className = 'catalog__item';

  // Формируем HTML для карточки товара
  productCard.innerHTML = `
    <div class="product-card">
      <div class="product-card__visual">
        <img class="product-card__img" src="${product.image}" height="436" width="290" alt="Изображение товара">
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
        <h2 class="product-card__title">${product.title}</h2>
        <span class="product-card__old">
          <span class="product-card__old-number">${product.oldPrice}</span>
          <span class="product-card__old-add">₽</span>
        </span>
        <span class="product-card__price">
          <span class="product-card__price-number">${product.price}</span>
          <span class="product-card__price-add">₽</span>
        </span>
        <div class="product-card__tooltip tooltip">
          <button class="tooltip__btn" aria-label="Показать подсказку">
            <svg class="tooltip__icon" width="5" height="10" aria-hidden="true">
              <use xlink:href="images/sprite.svg#icon-i"></use>
            </svg>
          </button>
          <div class="tooltip__content">
            <span class="tooltip__text">Наличие товара по городам:</span>
            <ul class="tooltip__list">
              ${Object.entries(product.availability).map(([city, count]) => `
                <li class="tooltip__item">
                  <span class="tooltip__text">${city}: <span class="tooltip__count">${count}</span></span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </div>
    </div>
  `;

  return productCard;
}

// Функция для отображения товаров на текущей странице
function displayProducts() {
  // Очищаем список товаров
  catalogList.innerHTML = '';

  // Вычисляем индексы начала и конца для текущей страницы
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, mockProducts.length);

  // Получаем товары для текущей страницы
  const currentProducts = mockProducts.slice(startIndex, endIndex);

  // Добавляем карточки товаров на страницу
  currentProducts.forEach(product => {
    const productCard = createProductCard(product);
    catalogList.appendChild(productCard);
  });

  // Инициализируем всплывающие подсказки для новых карточек
  initTooltips();
}

// Функция для создания пагинации
function createPagination() {
  // Очищаем контейнер пагинации
  paginationContainer.innerHTML = '';

  // Вычисляем общее количество страниц
  const totalPages = Math.ceil(mockProducts.length / ITEMS_PER_PAGE);

  // Если страниц меньше или равно 1, не отображаем пагинацию
  if (totalPages <= 1) {
    paginationContainer.style.display = 'none';
    return;
  }

  // Отображаем пагинацию
  paginationContainer.style.display = 'flex';

  // Создаем элементы пагинации
  for (let i = 1; i <= totalPages; i++) {
    const paginationItem = document.createElement('li');
    paginationItem.className = 'catalog__pagination-item';

    const paginationButton = document.createElement('button');
    paginationButton.className = 'catalog__pagination-link';
    if (i === currentPage) {
      paginationButton.classList.add('catalog__pagination-link--active');
    }
    paginationButton.textContent = i;

    // Добавляем обработчик клика
    paginationButton.addEventListener('click', () => {
      currentPage = i;
      displayProducts();
      createPagination();
    });

    paginationItem.appendChild(paginationButton);
    paginationContainer.appendChild(paginationItem);
  }
}

// Функция для инициализации всплывающих подсказок с помощью Tippy.js
function initTooltips() {
  const tooltipButtons = document.querySelectorAll('.tooltip__btn');

  tooltipButtons.forEach(button => {
    const tooltipContent = button.nextElementSibling;

    // Если для этой кнопки уже создан tippy, пропускаем
    if (button._tippy) {
      return;
    }

    // Создаем tippy для кнопки
    tippy(button, {
      content: tooltipContent.innerHTML,
      allowHTML: true,
      placement: 'bottom',
      arrow: true,
      theme: 'light',
      interactive: true,
      trigger: 'mouseenter focus',
      hideOnClick: false
    });
  });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем наличие необходимых элементов на странице
  if (!catalogList || !paginationContainer) {
    console.error('Не найдены необходимые элементы для инициализации каталога');
    return;
  }

  // Отображаем товары и создаем пагинацию
  displayProducts();
  createPagination();
});