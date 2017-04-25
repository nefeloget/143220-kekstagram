'use strict';

window.gallery = (function () {

  // Добавляем данные для картинки в контейнер
  var pictureContent = function (container, element, commentsSelector, likesSelector, imgSelector) {
    container.querySelector(imgSelector).setAttribute('src', element.url);
    container.querySelector(commentsSelector).textContent = element.commentsCount;
    container.querySelector(likesSelector).textContent = element.likes;
  };

  return {
    pictureContent: pictureContent
  };

})();
