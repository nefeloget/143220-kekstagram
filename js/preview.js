'use strict';

window.preview = (function () {
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');

  // Открытие галереи
  var openGallery = function (element, callback) {

    // Заполняем окно галереи картинкой
    callback();

    // Показываем окно
    window.util.showElement(galleryOverlay);
    // Ставим фокус на крестик
    galleryOverlayClose.focus();
    // Добавляем событие для закрытия галереи по нажатию ESC
    window.util.onKeyDown(document, galleryCloseESC);
    // Закрываем галерею по нажатию ENTER на крестике
    window.util.onKeyDown(galleryOverlayClose, galleryCloseENTER);
    // Добавляем событие для закрытия галереи по крестику
    window.util.onClick(galleryOverlayClose, galleryCloseClick);
  };

  // Закрытие галереи
  var closeGallery = function () {
    // Удаляем события нажатия кнопок
    window.util.offKeyDown(document, galleryCloseESC);
    window.util.offKeyDown(galleryOverlay, galleryCloseENTER);
    window.util.offClick(galleryOverlayClose, galleryCloseClick);
    // Закрываем окно
    window.util.hideElement(galleryOverlay);
  };

  var galleryCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, closeGallery);
  var galleryCloseENTER = window.util.onKeyPress(window.util.KEY_CODE_ENTER, closeGallery);
  var galleryCloseClick = window.util.onPrevent(closeGallery);

  return openGallery;
})();
