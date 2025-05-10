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
  fetch('./data/data.json')
    .then(response => response.json())
    .then(data => {
      const list = document.querySelector('.catalog__list');
      list.innerHTML = '';

      data.forEach(item => {
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
    })
    .catch(error => console.error('Ошибка загрузки данных:', error));
});