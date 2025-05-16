// Модуль для работы со слайдером товаров дня

// Функция для создания слайдов с товарами дня
const createDayProductsSlides = async () => {
  try {
    // Получаем данные из JSON файла
    const response = await fetch('./data/data.json');
    const products = await response.json();

    // Фильтруем только товары дня (goodsOfDay: true)
    const dayProducts = products.filter(product => product.goodsOfDay === true);

    // Получаем контейнер для слайдов
    const sliderList = document.querySelector('.day-products__list');
    if (!sliderList) return;

    // Очищаем контейнер перед добавлением новых слайдов
    sliderList.innerHTML = '';

    // Создаем слайды для каждого товара дня
    dayProducts.forEach(item => {
      // Исправляем путь к изображению, убирая '../' из пути
      const imagePath = item.image.replace('../', '');

      // Создаем HTML-разметку для слайда
      const slideHTML = `
        <li class="day-products__item swiper-slide">
          <div class="product-card product-card--small">
            <div class="product-card__visual">
              <img class="product-card__img" src="${imagePath}" height="344" width="290" alt="${item.name}">
              <div class="product-card__more">
                <button data-id="${item.id}" class="product-card__link btn btn--icon add-to-cart-btn">
                  <span class="btn__text">В корзину</span>
                  <svg width="24" height="24" aria-hidden="true">
                    <use xlink:href="images/sprite.svg#icon-basket"></use>
                  </svg>
                </button>
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

      // Добавляем слайд в контейнер
      sliderList.insertAdjacentHTML('beforeend', slideHTML);
    });

    // После создания всех слайдов инициализируем слайдер
    initDayProductsSlider();

    // Добавляем обработчики для кнопок добавления в корзину
    document.querySelectorAll('.day-products__item .add-to-cart-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = button.dataset.id;
        // Предполагаем, что функция addToCart уже определена в main.js
        if (typeof addToCart === 'function') {
          addToCart(productId);
        }
      });
    });

  } catch (error) {
    console.error('Ошибка при загрузке данных для слайдера товаров дня:', error);
  }
};

// Функция для инициализации слайдера Swiper
const initDayProductsSlider = () => {
  // Проверяем, что Swiper доступен
  if (typeof Swiper === 'undefined') {
    console.error('Библиотека Swiper не найдена');
    return;
  }

  // Инициализируем слайдер
  const dayProductsSlider = new Swiper('.day-products__slider', {
    // Количество видимых слайдов
    slidesPerView: 4,
    // Отступы между слайдами
    spaceBetween: 20,
    // Навигационные стрелки
    navigation: {
      nextEl: '.day-products__navigation-btn--next',
      prevEl: '.day-products__navigation-btn--prev',
    },
  });
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, есть ли на странице блок товаров дня
  const dayProductsSection = document.querySelector('.day-products');
  if (dayProductsSection) {
    createDayProductsSlides();
  }
});