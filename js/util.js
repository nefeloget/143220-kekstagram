'use strict';

window.util = (function () {
  // Константы
  var KEY_CODE_ENTER = 13;// Числовой код клавиши ENTER
  var KEY_CODE_ESC = 27;  // Числовой код клавиши ESC

  // Получение случайного значения из диапазона
  var getRandomValue = function (maxValue, minValue) {
    if (!minValue) {
      minValue = 0;
    }
    return Math.round(Math.random() * (maxValue - minValue) + minValue);
  };

  // Проверка на cуществование значения в массиве
  var findValue = function (array, value) {
    if (array.length > 0) {
      for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === value) {
          return true;
        }
      }
    }
    return false;
  };

  // Показать блок
  var showElement = function (block) {
    block.classList.remove('invisible');
  };

  // Скрыть блок
  var hideElement = function (block) {
    block.classList.add('invisible');
  };

  // Нажатие клавиш
  var onKeyPress = function (keyCode, callback) {
    return function (evt) {
      if (evt.keyCode === keyCode) {
        callback(evt);
      }
    };
  };

  var addFormInvalid = function (form) {
    form.classList.add('form-invalid');
  };

  var removeFormInvalid = function (form) {
    form.classList.remove('form-invalid');
  };

  // Сброс действия по умолчанию
  var onPrevent = function (callback) {
    return function (evt) {
      evt.preventDefault();
      callback(evt);
    };
  };

  // Сброс внешнего вида блока
  var clearStyleField = function (el) {
    el.setAttribute('style', '');
  };

  // Добавляем событие нажатия клавиши
  var onKeyDown = function (el, handler) {
    el.addEventListener('keydown', handler);
  };
  // Удаляем событие нажатия клавиши
  var offKeyDown = function (el, handler) {
    el.removeEventListener('keydown', handler);
  };

  // Добавляем событие click
  var onClick = function (el, handler) {
    el.addEventListener('click', handler);
  };
  // Удаляем событие click
  var offClick = function (el, handler) {
    el.removeEventListener('click', handler);
  };

  // Добавляем событие Submit
  var onSubmit = function (el, handler) {
    el.addEventListener('submit', handler);
  };
  // Удаляем событие Submit
  var offSubmit = function (el, handler) {
    el.removeEventListener('submit', handler);
  };

  return {
    getRandomValue: getRandomValue,
    findValue: findValue,
    showElement: showElement,
    hideElement: hideElement,
    onKeyPress: onKeyPress,
    KEY_CODE_ENTER: KEY_CODE_ENTER,
    KEY_CODE_ESC: KEY_CODE_ESC,
    addFormInvalid: addFormInvalid,
    removeFormInvalid: removeFormInvalid,
    onPrevent: onPrevent,
    clearStyleField: clearStyleField,
    onKeyDown: onKeyDown,
    offKeyDown: offKeyDown,
    onClick: onClick,
    offClick: offClick,
    onSubmit: onSubmit,
    offSubmit: offSubmit
  };

})();
