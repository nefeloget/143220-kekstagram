'use strict';

window.errors = (function () {
  var errorOverlay = document.querySelector('.error-overlay');
  var errorClose = document.getElementById('error-close');
  var errorText = errorOverlay.querySelector('.error-text');

  var onCloseError = function () {
    window.util.offKeyDown(document, onErrorCloseESC);
    window.util.offKeyDown(errorClose, onErrorCloseENTER);
    window.util.offClick(errorClose, onErrorCloseClick);
    window.util.hideElement(errorOverlay);
  };

  var onErrorCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, onCloseError);
  var onErrorCloseENTER = window.util.onKeyPress(window.util.KEY_CODE_ENTER, onCloseError);
  var onErrorCloseClick = window.util.onPrevent(onCloseError);

  var onError = function (errorMessage) {
    errorText.textContent = errorMessage;
    window.util.showElement(errorOverlay);
    window.util.onKeyDown(document, onErrorCloseESC);
    window.util.onKeyDown(errorClose, onErrorCloseENTER);
    window.util.onClick(errorClose, onErrorCloseClick);
  };

  var ERROR_CODES = {
    400: 'Неверный запрос',
    401: 'Пользователь не авторизован',
    403: 'Доступ запрещён',
    404: 'Ничего не найдено',
    500: 'Внутренняя ошибка сервера',
    502: 'Ошибочный шлюз',
    503: 'Сервис недоступен',
    504: 'Сервер не отвечает'
  };

  var onStatus = function (status, statusText) {
    onError(ERROR_CODES[status] || ('Неизвестный статус: ' + status + ' ' + statusText));
  };

  return {
    onError: onError,
    onStatus: onStatus
  };

})();
