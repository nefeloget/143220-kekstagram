'use strict';

window.load = (function (url, onLoad) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'json';
  xhr.timeout = 10000;

  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      onLoad(xhr.response);
    } else {
      window.errors.onStatus(xhr.status);
    }
  });

  xhr.addEventListener('error', function () {
    window.errors.onError('Произошла ошибка соединения');
  });

  xhr.addEventListener('timeout', function () {
    window.errors.onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });

  xhr.open('GET', url);
  xhr.send();

});
