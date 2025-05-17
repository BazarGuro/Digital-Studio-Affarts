// Подключение библиотеки Just-Validate
document.addEventListener('DOMContentLoaded', () => {
  // Создаем элемент script для подключения библиотеки Just-Validate
  const justValidateScript = document.createElement('script');
  justValidateScript.src = 'https://unpkg.com/just-validate@latest/dist/just-validate.production.min.js';
  justValidateScript.async = true;
  document.head.appendChild(justValidateScript);

  // Ждем загрузки библиотеки
  justValidateScript.onload = () => {
    initFormValidation();
  };

  // Инициализация валидации формы
  function initFormValidation() {
    const form = document.querySelector('.questions__form');
    if (!form) return;

    // Создаем экземпляр валидатора
    const validator = new JustValidate('.questions__form', {
      errorFieldCssClass: 'custom-input--error',
      errorLabelCssClass: 'custom-input__error',
      errorLabelStyle: {
        color: 'red',
        fontSize: '14px',
        marginTop: '5px',
      },
    });

    // Добавляем правила валидации
    validator
      .addField('#name', [
        {
          rule: 'required',
          errorMessage: 'Поле обязательно для заполнения',
        },
        {
          rule: 'minLength',
          value: 3,
          errorMessage: 'Минимальная длина имени - 3 символа',
        },
        {
          rule: 'maxLength',
          value: 20,
          errorMessage: 'Максимальная длина имени - 20 символов',
        },
      ])
      .addField('#email', [
        {
          rule: 'required',
          errorMessage: 'Поле обязательно для заполнения',
        },
        {
          rule: 'email',
          errorMessage: 'Введите корректный email',
        },
      ])
      .addField('#agree', [
        {
          rule: 'required',
          errorMessage: 'Необходимо согласие на обработку данных',
        },
      ])
      .onSuccess((event) => {
        event.preventDefault();
        submitForm(form);
      });
  }

  // Функция отправки формы
  function submitForm(form) {
    const formData = new FormData(form);

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: formData,
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Ошибка отправки формы');
        }
        return response.json();
      })
      .then(data => {
        showModal('success');
        form.reset();
      })
      .catch(error => {
        showModal('error');
        console.error('Ошибка:', error);
      });
  }

  // Создание и отображение модального окна
  function showModal(type) {
    // Удаляем существующее модальное окно, если оно есть
    const existingModal = document.querySelector('.modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Создаем новое модальное окно
    const modal = document.createElement('div');
    modal.className = 'modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal__content';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal__close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      modal.remove();
    });

    const title = document.createElement('h3');
    title.className = 'modal__title';

    const message = document.createElement('p');
    message.className = 'modal__message';

    if (type === 'success') {
      title.textContent = 'Успешно!';
      message.textContent = 'Ваша заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.';
      modalContent.classList.add('modal__content--success');
    } else {
      title.textContent = 'Ошибка!';
      message.textContent = 'К сожалению, произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз позже.';
      modalContent.classList.add('modal__content--error');
    }

    modalContent.appendChild(closeBtn);
    modalContent.appendChild(title);
    modalContent.appendChild(message);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);

    // Добавляем обработчик для закрытия модального окна при клике вне его содержимого
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        modal.remove();
      }
    });
  }

  // Добавляем стили для модального окна
  const modalStyles = document.createElement('style');
  modalStyles.textContent = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    
    .modal__content {
      background-color: #fff;
      padding: 30px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      position: relative;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    }
    
    .modal__content--success {
      border-top: 5px solid #4CAF50;
    }
    
    .modal__content--error {
      border-top: 5px solid #f44336;
    }
    
    .modal__close {
      position: absolute;
      top: 10px;
      right: 15px;
      font-size: 24px;
      cursor: pointer;
      background: none;
      border: none;
      color: #333;
    }
    
    .modal__title {
      margin-top: 0;
      color: #333;
      font-size: 22px;
    }
    
    .modal__message {
      color: #666;
      line-height: 1.5;
    }
    
    .custom-input--error .custom-input__field {
      border-color: red;
    }
    
    .custom-input__error {
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }
  `;
  document.head.appendChild(modalStyles);
});