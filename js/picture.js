'use strict';

window.picture = (function () {

  // Добавляем данные для картинки в контейнер
  var pictureContent = function (container, element, commentsSelector, likesSelector) {
    container.querySelector('img').setAttribute('src', element.url);
    container.querySelector(commentsSelector).textContent = element.comments.length;
    container.querySelector(likesSelector).textContent = element.likes;
  };

  return pictureContent;

})();
