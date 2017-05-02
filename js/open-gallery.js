'use strict';

window.openGallery = (function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  // Закрытие галереи
  var onCloseGallery = function () {
    // Удаляем события нажатия кнопок
    window.util.offKeyDown(document, onGalleryCloseESC);
    window.util.offKeyDown(galleryOverlay, onGalleryCloseENTER);
    window.util.offClick(galleryOverlayClose, onGalleryCloseClick);
    // Закрываем окно
    window.util.hideElement(galleryOverlay);
  };

  var onGalleryCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, onCloseGallery);
  var onGalleryCloseENTER = window.util.onKeyPress(window.util.KEY_CODE_ENTER, onCloseGallery);
  var onGalleryCloseClick = window.util.onPrevent(onCloseGallery);

  return function (element, callback) {
    // Заполняем окно галереи картинкой
    callback();
    // Показываем окно
    window.util.showElement(galleryOverlay);
    // Ставим фокус на крестик
    galleryOverlayClose.focus();
    // Добавляем событие для закрытия галереи по нажатию ESC
    window.util.onKeyDown(document, onGalleryCloseESC);
    // Закрываем галерею по нажатию ENTER на крестике
    window.util.onKeyDown(galleryOverlayClose, onGalleryCloseENTER);
    // Добавляем событие для закрытия галереи по крестику
    window.util.onClick(galleryOverlayClose, onGalleryCloseClick);
  };
})();
