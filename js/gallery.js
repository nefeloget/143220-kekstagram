'use strict';

window.gallery = (function () {
  var URL_DATA = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
  var template = document.querySelector('#picture-template').content;
  var container = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var filterPictures = document.querySelector('.filters');
  var pictures;

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

  var setFilterPictures = function (filter) {
    var photos = pictures.slice(0);
    removePictures(container);
    switch (filter) {
      case 'popular':
        addPicturesOnPage(photos);
        break;
      case 'new':
        photos = photos.sort(function (first, second) {
          return 0.5 - Math.random();
        }).slice(10);
        addPicturesOnPage(photos);
        break;
      case 'discussed':
        photos = photos.slice(0).sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        addPicturesOnPage(photos);
    }
  };

  var removePictures = function (containerPic) {
    while (containerPic.firstChild) {
      containerPic.removeChild(containerPic.firstChild);
    }
  };

  var filterModul = window.initializeFilters(filterPictures, setFilterPictures);

  var onLoad = function (data) {
    pictures = data;
    addPicturesOnPage(data);
    window.util.showElement(filterPictures, true);
    filterModul.onClickElem();
  };

  window.load(URL_DATA, onLoad);

})();
