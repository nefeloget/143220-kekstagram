'use strict';

(function () {
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
  // Ползунок для настройки насышенности фильтра
  var uploadFilterLevel = uploadFilterControls.querySelector('.upload-filter-level');
  var uploadFilterLevelLine = uploadFilterControls.querySelector('.upload-filter-level-line');
  var uploadFilterLevelPin = uploadFilterControls.querySelector('.upload-filter-level-pin');
  var uploadFilterLevelVal = uploadFilterControls.querySelector('.upload-filter-level-val');
  // Текущий фильтр
  var currentFilter;
  var movePin;
  var shiftMoveX;
  var rightEdge;

  var setScale = function (size) {
    uploadScaleControl.setAttribute('value', size + '%');
    uploadImagePreview.style.transform = 'scale(' + size / 100 + ')';
  };

  var setDefaultSeturation = function () {
    uploadFilterLevelVal.style.width = '100%';
    uploadFilterLevelPin.style.left = '100%';
  };

  // Устанавливаем значения по умолчанию
  var setDefaultUpload = function (defaultValue) {
    uploadOverlayForm.reset();
    // Сброс масштаба
    uploadScaleControl.setAttribute('value', defaultValue + '%');
    window.util.clearStyleField(uploadImagePreview);
    // Сброс поля комментария
    uploadComment.value = '';
    window.util.clearStyleField(uploadComment);
    // Сброс фильтров
    uploadImagePreview.className = 'filter-image-preview';
    setDefaultSeturation();
  };

  // Переключаем фильтр
  var setFilter = function (filter) {
    uploadImagePreview.style.filter = '';
    // Сброс насыщенности фильтра
    setDefaultSeturation();
    // Применение фильтра
    currentFilter = filter;
    uploadImagePreview.className = 'filter-image-preview filter-' + currentFilter;
    // Скрываем ползунок насыщенности, когда нет примененного фильтра
    if (filter === 'none') {
      window.util.hideElement(uploadFilterLevel);
    } else {
      window.util.showElement(uploadFilterLevel);
    }
  };

  // Изменение насыщенности в зависимости от фильтра
  var setFilterSaturation = function (percent) {
    // Коэффициент для фильтра
    var ratio;
    var styleFilter = '';
    switch (currentFilter) {
      case 'chrome':
        // Значение от 0 до 1
        styleFilter = 'grayscale(' + (percent / 100) + ')';
        break;
      case 'sepia':
        // Значение от 0 до 1
        styleFilter = 'sepia(' + (percent / 100) + ')';
        break;
      case 'marvin':
        // Значение от 0 до 100%
        styleFilter = 'invert(' + percent + '%)';
        break;
      case 'phobos':
        ratio = 3;
        // Значение от 0 до 3px
        styleFilter = 'blur(' + (percent * ratio / 100) + 'px)';
        break;
      case 'heat':
        ratio = 2;
        // Минимально возможное значение для фильтра
        var minValueFilter = 1;
        // Значение от 1 до 3
        styleFilter = 'brightness(' + (percent * ratio / 100 + minValueFilter) + ')';
        break;
    }
    uploadImagePreview.style.filter = styleFilter;
  };

  var onUploadSubmit = function () {
    if (uploadOverlayForm.checkValidity()) {
      onCloseUpload();
    } else {
      window.util.addFormInvalid(uploadOverlayForm);
    }
  };

  /* События перемещения ползунка */
  var onFilterPinMouseDown = function (evt) {
    evt.preventDefault();
    movePin = evt.clientX;
    rightEdge = uploadFilterLevelLine.offsetWidth;

    window.util.onMouseMove(document, onMouseMovePin);
    window.util.onMouseUp(document, onMouseUpPin);
  };

  var onMouseMovePin = function (moveEvt) {
    moveEvt.preventDefault();

    shiftMoveX = movePin - moveEvt.clientX;
    movePin = moveEvt.clientX;
    var handle = uploadFilterLevelPin.offsetLeft - shiftMoveX;
    var level = Math.floor(handle * 100 / rightEdge);

    uploadFilterLevelPin.style.left = handle + 'px';
    uploadFilterLevelVal.style.width = level + '%';

    if (handle < 0) {
      uploadFilterLevelPin.style.left = '0px';
      uploadFilterLevelVal.style.width = '0%';
    }

    if (handle > rightEdge) {
      uploadFilterLevelPin.style.left = rightEdge + 'px';
      uploadFilterLevelVal.style.width = '100%';
    }

    setFilterSaturation(level);
  };

  var onMouseUpPin = function (upEvt) {
    upEvt.preventDefault();
    window.util.offMouseUp(document, onMouseUpPin);
    window.util.offMouseMove(document, onMouseMovePin);
  };

  var scaleSetting = {
    elMin: uploadScaleMinus,
    elPlus: uploadScalePlus,
    elValue: uploadScaleControl,
    min: SCALE_MIN,
    max: SCALE_MAX,
    step: SCALE_STEP
  };

  var scaleModul = window.initializeScale(scaleSetting, setScale);

  var filterModul = window.initializeFilters(uploadFilterControls, setFilter);

  // Открытие окна добавления и редактирования фото
  var onOpenUpload = function () {
    // Скрываем форму загрузки фото
    window.util.hideElement(uploadForm);
    // Скрываем ползунок по умолчанию
    window.util.hideElement(uploadFilterLevel);
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
    scaleModul.onClickElem();
    // Переключаем фильтры
    filterModul.onClickElem();
    // Событие при изменении насыщенности фильтра
    window.util.onMouseDown(uploadFilterLevelPin, onFilterPinMouseDown);
  };

  // Закрытие окна добавления фото
  var onCloseUpload = function () {
    // Удаляем события
    window.util.offKeyDown(document, uploadCloseESC);
    window.util.offKeyDown(uploadOverlay, uploadCloseENTER);
    window.util.offKeyDown(uploadComment, uploadCommentCloseESC);
    window.util.offClick(uploadCancel, uploadCloseWindow);
    window.util.offSubmit(uploadOverlayForm, uploadCloseWindow);
    window.util.offClick(uploadSubmit, uploadCloseSubmit);
    scaleModul.offClickElem();
    filterModul.offClickElem();
    window.util.offMouseDown(uploadFilterLevelPin, onFilterPinMouseDown);
    // Закрываем окно
    window.util.hideElement(uploadOverlay);
    // Сбрасываем форму загрузки и показываем её
    uploadForm.reset();
    window.util.showElement(uploadForm);
    // Устанавливаем значения по умолчанию
    setDefaultUpload(SCALE_DEFAULT_VALUE);
    window.util.removeFormInvalid(uploadOverlayForm);
  };

  var uploadCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, onCloseUpload);
  var uploadCloseENTER = window.util.onKeyPress(window.util.KEY_CODE_ENTER, onCloseUpload);
  var uploadCommentCloseESC = window.util.onKeyPress(window.util.KEY_CODE_ESC, function (evt) {
    evt.stopPropagation();
  });
  var uploadCloseWindow = window.util.onPrevent(onCloseUpload);
  var uploadCloseSubmit = window.util.onPrevent(onUploadSubmit);

  // Когда фотка загружена открываем окно редактирования фото
  inputUploadFile.addEventListener('change', onOpenUpload);

})();
