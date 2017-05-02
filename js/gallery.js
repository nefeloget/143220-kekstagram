'use strict';

(function () {
  var URL_DATA = 'https://intensive-javascript-server-kjgvxfepjl.now.sh/kekstagram/data';
  var template = document.querySelector('#picture-template').content;
  var container = document.querySelector('.pictures');
  var fragment = document.createDocumentFragment();
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayImg = galleryOverlay.querySelector('img');
  var galleryOverlayComments = galleryOverlay.querySelector('.comments-count');
  var galleryOverlayLikes = galleryOverlay.querySelector('.likes-count');
  var filterPictures = document.querySelector('.filters');
  var pictures;

  // Создаем картинки по шаблону
  var addPicturesContent = function (element) {
    var pictureEl = template.cloneNode(true);
    window.pictureContent(pictureEl, element, '.picture-comments', '.picture-likes');

    // Добавляем событие для открытия галереи
    pictureEl.querySelector('.picture').addEventListener('click', function (evt) {
      evt.preventDefault();
      window.openGallery(element, function () {
        galleryOverlayImg.setAttribute('src', element.url);
        galleryOverlayComments.textContent = element.comments.length;
        galleryOverlayLikes.textContent = element.likes;
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
        }).slice(0, 10);
        addPicturesOnPage(photos);
        break;
      case 'discussed':
        photos = photos.sort(function (first, second) {
          return second.comments.length - first.comments.length;
        });
        addPicturesOnPage(photos);
    }

  };

  var removePictures = function (containerPic) {
    containerPic.innerHTML = '';
  };

  var filterModul = window.initializeFilters(filterPictures, setFilterPictures);

  var onLoad = function (data) {
    pictures = data;
    addPicturesOnPage(data);
    window.util.showElementHidden(filterPictures);
    filterModul.onClickElem();
  };

  window.load(URL_DATA, onLoad);

})();
