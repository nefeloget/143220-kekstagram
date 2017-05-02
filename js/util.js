'use strict';

window.util = (function () {

  return {

    /* Числовой код клавиши ENTER */
    KEY_CODE_ENTER: 13,

    /* Числовой код клавиши ESC */
    KEY_CODE_ESC: 27,
    /* Интервал повторного запуска функции */
    DEBOUNCE_INTERVAL: 500,

    /* Показать блок */
    showElement: function (block) {
      block.classList.remove('invisible');
    },

    showElementHidden: function (block) {
      block.classList.remove('hidden');
    },

    /* Скрыть блок */
    hideElement: function (block) {
      block.classList.add('invisible');
    },

    /* Нажатие клавиш */
    onKeyPress: function (keyCode, callback) {
      return function (evt) {
        if (evt.keyCode === keyCode) {
          callback(evt);
        }
      };
    },

    /* Класс невалидной формы */
    addFormInvalid: function (form) {
      form.classList.add('form-invalid');
    },
    removeFormInvalid: function (form) {
      form.classList.remove('form-invalid');
    },

    /* Сброс действия по умолчанию */
    onPrevent: function (callback) {
      return function (evt) {
        evt.preventDefault();
        callback(evt);
      };
    },

    /* Сброс внешнего вида блока */
    clearStyleField: function (el) {
      el.setAttribute('style', '');
    },

    /* Добавляем событие нажатия клавиши */
    onKeyDown: function (el, handler) {
      el.addEventListener('keydown', handler);
    },

    /* Удаляем событие нажатия клавиши */
    offKeyDown: function (el, handler) {
      el.removeEventListener('keydown', handler);
    },

    /* Добавляем событие click */
    onClick: function (el, handler) {
      el.addEventListener('click', handler);
    },
    offClick: function (el, handler) {
      el.removeEventListener('click', handler);
    },

    /* Добавляем событие Submit */
    onSubmit: function (el, handler) {
      el.addEventListener('submit', handler);
    },
    offSubmit: function (el, handler) {
      el.removeEventListener('submit', handler);
    },

    /* Кнопка мыши нажата над элементом */
    onMouseDown: function (el, handler) {
      el.addEventListener('mousedown', handler);
    },
    offMouseDown: function (el, handler) {
      el.removeEventListener('mousedown', handler);
    },

    /* Кнопка мыши отпущена над элементом */
    onMouseUp: function (el, handler) {
      el.addEventListener('mouseup', handler);
    },
    offMouseUp: function (el, handler) {
      el.removeEventListener('mouseup', handler);
    },

    /* Мышь появилась над элементом */
    onMouseMove: function (el, handler) {
      el.addEventListener('mousemove', handler);
    },
    offMouseMove: function (el, handler) {
      el.removeEventListener('mousemove', handler);
    },

    /* Устранить «дребегз» функции */
    debounce: function () {
      var lastTimeout = null;
      return function (cb, interval) {
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(cb, interval);
      };
    }

  };

})();
