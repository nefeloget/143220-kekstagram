'use strict';

window.form = (function () {
  // Константы для логики изменения размера изображения
  var SCALE_MIN = 25;           // Минимальный масштаб (%)
  var SCALE_MAX = 100;          // Макcимальный масштаб (%)
  var SCALE_STEP = 25;          // Шаг (%)
  var SCALE_DEFAULT_VALUE = 100;// Значение по умолчанию (%)

  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadForm = document.getElementById('upload-select-image');
  var uploadCancel = uploadOverlay.querySelector('#upload-cancel');
  var uploadSubmit = uploadOverlay.querySelector('#upload-submit');
  var uploadOverlayForm = uploadOverlay.querySelector('#upload-filter');
  var uploadComment = uploadOverlay.querySelector('.upload-form-description');
  var inputUploadFile = document.getElementById('upload-file');
  // Поле отображения масштаба
  var uploadScaleControl = uploadOverlay.querySelector('.upload-resize-controls-value');
  // Загруженная картинка в форму кадрирования (просмотр)
  var uploadImagePreview = uploadOverlay.querySelector('.filter-image-preview');
  // Кнопка изменения размера картинки в меньшую сторону
  var uploadScaleMinus = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  // Кнопка изменения размера картинки в большую сторону
  var uploadScalePlus = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
  // Поле с переключателями фильтров
  var uploadFilterControls = uploadOverlay.querySelector('.upload-filter-controls');


  // Обработчик клика на кнопку изменения размера картинки в меньшую сторону
  function onUploadScaleMinus() {
    setScale(getValueScale('minus'));
  }

  // Обработчик клика на кнопку изменения размера картинки в большую сторону
  function onUploadScalePlus() {
    setScale(getValueScale('plus'));
  }

  // Вычисление размера изображения в форме кадрирования
  function getValueScale(flag) {
    var size = parseInt(uploadScaleControl.value, 10);

    if (SCALE_MIN < size && flag === 'minus') {
      size -= SCALE_STEP;
    } else if (SCALE_MAX > size && flag === 'plus') {
      size += SCALE_STEP;
    }

    return size;
  }

  function setScale(size) {
    uploadScaleControl.setAttribute('value', size + '%');
    uploadImagePreview.style.transform = 'scale(' + size / 100 + ')';
  }

  // Устанавливаем значения по умолчанию
  var setDefaultUpload = function (defaultValue) {
    uploadOverlayForm.reset();
    // Сброс масштаба
    uploadScaleControl.value = defaultValue + '%';
    window.util.clearStyleField(uploadScaleControl);
    // Сброс поля комментария
    uploadComment.value = '';
    window.util.clearStyleField(uploadComment);
    // Сброс фильтров
    uploadImagePreview.className = 'filter-image-preview';
  };

  var setFilter = function (evt) {
    if (evt.target.checked) {
      uploadImagePreview.className = 'filter-image-preview filter-' + evt.target.value;
    }
  };

  var onUploadSubmit = function () {
    if (uploadOverlayForm.checkValidity() === false) {
      window.util.addFormInvalid(uploadOverlayForm);
    } else {
      closeUpload();
    }
  };

  // Открытие окна добавления и редактирования фото
  var openUpload = function () {
    // Скрываем форму загрузки фото
    window.util.hideElement(uploadForm);
    // Показываем окно добавления и редактирования фото
    window.util.showElement(uploadOverlay);

    // Добавляем событие для закрытия окна по нажатию ESC
    window.util.onKeyDown(document, uploadCloseESC);
    // Закрываем окно по нажатию ENTER на крестике
    window.util.onKeyDown(uploadCancel, uploadCloseENTER);
    // Пока идет ввод в коментариях, форму не закрыть
    window.util.onKeyDown(uploadComment, uploadCommentCloseESC);
    // Добавляем событие для закрытия окна по крестику
    window.util.onClick(uploadCancel, uploadCloseWindow);
    // Добавляем событие для отправки формы
    window.util.onSubmit(uploadOverlayForm, uploadCloseWindow);
    window.util.onClick(uploadSubmit, uploadCloseSubmit);
    // Добавляем события для кнопок изменения масштаба
    window.util.onClick(uploadScaleMinus, onUploadScaleMinus);
    window.util.onClick(uploadScalePlus, onUploadScalePlus);
    // Переключаем фильтры
    window.util.onClick(uploadFilterControls, setFilter);
  };

  // Закрытие окна добавления фото
  var closeUpload = function () {
    // Удаляем события
    window.util.offKeyDown(document, uploadCloseESC);
    window.util.offKeyDown(uploadOverlay, uploadCloseENTER);
    window.util.offKeyDown(uploadComment, uploadCommentCloseESC);
    window.util.offClick(uploadCancel, uploadCloseWindow);
    window.util.offSubmit(uploadOverlayForm, uploadCloseWindow);
    window.util.offClick(uploadSubmit, uploadCloseSubmit);
    window.util.offClick(uploadScaleMinus, onUploadScaleMinus);
    window.util.offClick(uploadScalePlus, onUploadScalePlus);
    window.util.offClick(uploadFilterControls, setFilter);
    // Закрываем окно
    window.util.hideElement(uploadOverlay);
    // Сбрасываем форму загрузки и показываем её
    uploadForm.reset();
    window.util.showElement(uploadForm);

    // Устанавливаем значения по умолчанию
    setDefaultUpload(SCALE_DEFAULT_VALUE);
    window.util.removeFormInvalid(uploadOverlayForm);
  };

  var uploadCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, closeUpload);
  var uploadCloseENTER = window.util.onKeyPress(window.util.KEY_CODE_ENTER, closeUpload);
  var uploadCommentCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, function (evt) {
    evt.stopPropagation();
  });
  var uploadCloseWindow = window.util.onPrevent(closeUpload);
  var uploadCloseSubmit = window.util.onPrevent(onUploadSubmit);

  // ----------------------------------------------------

  // Когда фотка загружена открываем окно редактирования фото
  inputUploadFile.addEventListener('change', openUpload);


})();
