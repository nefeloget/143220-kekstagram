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
  // Ползунок для настройки насышенности фильтра
  var uploadFilterLevel = uploadFilterControls.querySelector('.upload-filter-level');
  var uploadFilterLevelLine = uploadFilterControls.querySelector('.upload-filter-level-line');
  var uploadFilterLevelPin = uploadFilterControls.querySelector('.upload-filter-level-pin');
  var uploadFilterLevelVal = uploadFilterControls.querySelector('.upload-filter-level-val');
  // Текущий фильтр
  var currentFilter;


  function setScale(size) {
    uploadScaleControl.setAttribute('value', size + '%');
    uploadImagePreview.style.transform = 'scale(' + size / 100 + ')';
  }

  var setDefaultSeturation = function () {
    uploadFilterLevelVal.style.width = '100%';
    uploadFilterLevelPin.style.left = '100%';
  };

  // Устанавливаем значения по умолчанию
  var setDefaultUpload = function (defaultValue) {
    uploadOverlayForm.reset();
    // Сброс масштаба
    uploadScaleControl.value = defaultValue + '%';
    window.util.clearStyleField(uploadImagePreview);
    // Сброс поля комментария
    uploadComment.value = '';
    window.util.clearStyleField(uploadComment);
    // Сброс фильтров
    uploadImagePreview.className = 'filter-image-preview';
    setDefaultSeturation();
  };

  // Переключаем фильтр
  var setFilter = function (evt) {
    // Применение фильтра
    if (evt.target.checked) {
      uploadImagePreview.className = 'filter-image-preview filter-' + evt.target.value;
      currentFilter = evt.target.value;
      if (uploadImagePreview.classList.contains('filter-none')) {
        window.util.hideElement(uploadFilterLevel);
      } else {
        // Сброс насыщенности фильтра
        window.util.clearStyleField(uploadImagePreview);
        setDefaultSeturation();
        window.util.showElement(uploadFilterLevel);
      }
    }
  };

  // Изменение насыщенности в зависимости от фильтра
  var setFilterSaturation = function (percent) {
    var styleFilter = '';
    switch (currentFilter) {
      case 'chrome':
        styleFilter = 'grayscale(' + (percent / 100) + ')';
        break;
      case 'sepia':
        styleFilter = 'sepia(' + (percent / 100) + ')';
        break;
      case 'marvin':
        styleFilter = 'invert(' + percent + '%)';
        break;
      case 'phobos':
        styleFilter = 'blur(' + (percent * 3 / 100) + 'px)';
        break;
      case 'heat':
        styleFilter = 'brightness(' + (percent * 2 / 100 + 1) + ')';
        break;
    }
    uploadImagePreview.style.filter = styleFilter;
  };

  var onUploadSubmit = function () {
    if (uploadOverlayForm.checkValidity() === false) {
      window.util.addFormInvalid(uploadOverlayForm);
    } else {
      closeUpload();
    }
  };

  var onFilterPinMouseDown = function (evt) {
    evt.preventDefault();
    var movePin = evt.clientX;

    var MouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shiftMoveX = movePin - moveEvt.clientX;
      movePin = moveEvt.clientX;

      var leftEdge = 0;
      var rightEdge = uploadFilterLevelLine.offsetWidth;
      var handle = evt.target.offsetLeft - shiftMoveX;

      var level = Math.floor(handle * 100 / rightEdge);
      evt.target.style.left = handle + 'px';
      uploadFilterLevelVal.style.width = level + '%';

      if (handle < leftEdge) {
        evt.target.style.left = '0px';
        uploadFilterLevelVal.style.width = '0%';
      }

      if (handle > rightEdge) {
        evt.target.style.left = rightEdge + 'px';
        uploadFilterLevelVal.style.width = '100%';
      }

      setFilterSaturation(level);
    };

    var MouseUp = function (upEvt) {
      upEvt.preventDefault();
      window.util.offMouseUp(document, MouseUp);
      window.util.offMouseMove(document, MouseMove);
    };

    window.util.onMouseMove(document, MouseMove);
    window.util.onMouseUp(document, MouseUp);
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

  // Открытие окна добавления и редактирования фото
  var openUpload = function () {
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
    window.util.onClick(uploadFilterControls, setFilter);
    // Событие при изменении насыщенности фильтра
    window.util.onMouseDown(uploadFilterLevelPin, onFilterPinMouseDown);
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
    scaleModul.offClickElem();
    window.util.offClick(uploadFilterControls, setFilter);
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
