'use strict';

window.gallery = (function () {
  var template = document.querySelector('#picture-template').content;
  var container = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var galleryOverlay = document.querySelector('.gallery-overlay');

  // Создаем картинки по шаблону
  var addPicturesContent = function (element) {
    var pictureEl = template.cloneNode(true);
    window.picture(pictureEl, element, '.picture-comments', '.picture-likes');

    // Добавляем событие для открытия галереи
    pictureEl.querySelector('.picture').addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview(element, function () {
        window.picture(galleryOverlay, element, '.comments-count', '.likes-count');
      });
    });

    return pictureEl;
  };

  // Помещаем картинки на страницу
  var addPicturesOnPage = function (picturesArray) {
    picturesArray.forEach(function (item) {
      fragment.appendChild(addPicturesContent(item));
    });
    container.appendChild(fragment);
  };

  addPicturesOnPage(window.data);

})();
