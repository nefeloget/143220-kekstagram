'use strict';

window.picture = (function () {
  var template = document.querySelector('#picture-template').content;
  var container = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();

  // Создаем картинки по шаблону
  var addPicturesContent = function (element) {
    var pictureEl = template.cloneNode(true);
    window.gallery.pictureContent(pictureEl, element, '.picture-comments', '.picture-likes', 'img');

    // Добавляем событие для открытия галереи
    pictureEl.querySelector('.picture').addEventListener('click', function (evt) {
      evt.preventDefault();
      window.preview.openGallery(element);
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
