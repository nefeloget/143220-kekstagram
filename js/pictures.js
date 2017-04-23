'use strict';

(function () {

  // Константы
  var MIN_LIKES = 15;     // Минимальное кол-во лайков
  var MAX_LIKES = 200;    // Максимальное кол-во лайков
  var MIN_COMMENTS = 1;   // Минимальное кол-во комментариев
  var MAX_COMMENTS = 2;   // Максимальное кол-во комментариев
  var KEY_CODE_ENTER = 13;// Числовой код клавиши ENTER
  var KEY_CODE_ESC = 27;  // Числовой код клавиши ESC

  var picturesCount = 25; // Кол-во фотографий
  var pictures = [];      // Массив фотографий

  // Список комментариев
  var commentsList = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце-концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как-будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  // Получение случайного значения из диапазона
  var getRandomValue = function (maxValue, minValue) {
    if (!minValue) {
      minValue = 0;
    }
    return Math.round(Math.random() * (maxValue - minValue) + minValue);
  };

  // Конструктор картинки
  var Picture = function (idUser) {
    // Адрес картинки
    this.url = 'photos/' + idUser + '.jpg';
    // Количество лайков, поставленных фотографии
    this.likes = getRandomValue(MAX_LIKES, MIN_LIKES);
    // Количество комментариев
    this.commentsCount = getRandomValue(MAX_COMMENTS, MIN_COMMENTS);
    // Список комментариев, оставленных другими пользователями к этой фотографии.
    this.comments = [];
  };

  Picture.prototype = {
    // Метод добавления случайных комментариев из списка
    addComments: function () {
      var commentValue;
      for (var i = 1; i <= this.commentsCount; i++) {
        commentValue = commentsList[getRandomValue(commentsList.length - 1)];
        if (!findValue(this.comments, commentValue)) {
          this.comments.push(commentValue);
        }
      }
    }
  };

  // Создаем экземпляр картинки
  var getPictures = function (idUser) {
    var pictureEl = new Picture(idUser);
    pictureEl.addComments();
    pictures.push(pictureEl);
  };

  // Проверка на cуществование значения в массиве
  var findValue = function (array, value) {
    if (array.length > 0) {
      for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === value) {
          return true;
        }
      }
    }
    return false;
  };

  // Создаем массив с фотографиями и заполняем его случайными данными
  for (var i = 1; i <= picturesCount; i++) {
    getPictures(i);
  }

  // ----------------------------------------------------

  var pictureTemplate = document.querySelector('#picture-template').content;
  var pictureContainer = document.querySelector('.pictures');
  var imageSelector = 'img';
  var commentsSelector = '.picture-comments';
  var likesSelector = '.picture-likes';
  var fragment = document.createDocumentFragment();

  // Добавляем данные для картинки в контейнер
  var pictureContent = function (container, element) {
    container.querySelector(imageSelector).setAttribute('src', element.url);
    container.querySelector(commentsSelector).textContent = element.commentsCount;
    container.querySelector(likesSelector).textContent = element.likes;
  };

  // Создаем картинки по шаблону
  var addPicturesContent = function (element, template) {
    var pictureEl = template.cloneNode(true);
    pictureContent(pictureEl, element);

    // Добавляем событие для открытия галереи
    pictureEl.querySelector('.picture').addEventListener('click', function (evt) {
      evt.preventDefault();
      openGallery(element);
    });

    return pictureEl;
  };

  // Помещаем картинки на страницу
  var addPicturesOnPage = function (picturesArray, template, container) {
    picturesArray.forEach(function (item) {
      fragment.appendChild(addPicturesContent(item, template));
    });
    container.appendChild(fragment);
  };

  addPicturesOnPage(pictures, pictureTemplate, pictureContainer);

  // ----------------------------------------------------

  var uploadOverlay = document.querySelector('.upload-overlay');
  var galleryOverlay = document.querySelector('.gallery-overlay');
  var galleryOverlayClose = galleryOverlay.querySelector('.gallery-overlay-close');
  var uploadForm = document.getElementById('upload-select-image');
  var uploadCancel = uploadOverlay.querySelector('#upload-cancel');
  // var uploadSubmit = uploadOverlay.querySelector('#upload-submit');
  var uploadComment = uploadOverlay.querySelector('.upload-form-description');
  var inputUploadFile = document.getElementById('upload-file');

  // Показать блок
  var showElement = function (block) {
    block.classList.remove('invisible');
  };

  // Скрыть блок
  var hideElement = function (block) {
    block.classList.add('invisible');
  };

  // Добавляем событие нажатия клавиши
  var onKeyDown = function (el, handler) {
    el.addEventListener('keydown', handler);
  };
  // Удаляем событие нажатия клавиши
  var offKeyDown = function (el, handler) {
    el.removeEventListener('keydown', handler);
  };

  // Добавляем событие click
  var onClick = function (el, handler) {
    el.addEventListener('click', handler);
  };
  // Удаляем событие click
  var offClick = function (el, handler) {
    el.removeEventListener('click', handler);
  };

  // Добавляем событие невалидного поля
  var onInvalid = function (el, handler) {
    el.addEventListener('input', handler);
  };
  // Удаляем событие невалидного поля
  var offInvalid = function (el, handler) {
    el.removeEventListener('input', handler);
  };

  // Нажатие клавиш
  function onKeyPress(keyCode, callback) {
    return function (evt) {
      if (evt.keyCode === keyCode) {
        callback(evt);
      }
    };
  }

  // Сброс действия по умолчанию
  function onPrevent(callback) {
    return function (evt) {
      evt.preventDefault();
      callback(evt);
    };
  }

  // Меняем внешний вид невалидного поля
  var addInvalidField = function (evt) {
    evt.preventDefault();
    evt.target.style.border = '1px solid red';
    evt.target.style.outline = '0';
  };

  // ----------------------------------------------------

  // Открытие галереи
  var openGallery = function (element) {

    // Заполняем окно галереи картинкой
    var galleryOverlayContent = function () {
      commentsSelector = '.comments-count';
      likesSelector = '.likes-count';
      pictureContent(galleryOverlay, element);
    };

    galleryOverlayContent(element);
    // Показываем окно
    showElement(galleryOverlay);
    // Ставим фокус на крестик
    galleryOverlayClose.focus();
    // Добавляем событие для закрытия галереи по нажатию ESC
    onKeyDown(document, galleryCloseESC);
    // Закрываем галерею по нажатию ENTER на крестике
    onKeyDown(galleryOverlayClose, galleryCloseENTER);
    // Добавляем событие для закрытия галереи по крестику
    onClick(galleryOverlayClose, galleryCloseClick);
  };

  // Закрытие галереи
  var closeGallery = function () {
    // Удаляем события нажатия кнопок
    offKeyDown(document, galleryCloseESC);
    offKeyDown(galleryOverlay, galleryCloseENTER);
    offClick(galleryOverlayClose, galleryCloseClick);
    // Закрываем окно
    hideElement(galleryOverlay);
  };

  var galleryCloseESC = onKeyPress(KEY_CODE_ESC, closeGallery);
  var galleryCloseENTER = onKeyPress(KEY_CODE_ENTER, closeGallery);
  var galleryCloseClick = onPrevent(closeGallery);

  // ----------------------------------------------------

  // Константы для логики изменения размера изображения
  var SCALE_MIN = 25;           // Минимальный масштаб (%)
  var SCALE_MAX = 100;          // Макcимальный масштаб (%)
  var SCALE_STEP = 25;          // Шаг (%)
  var SCALE_DEFAULT_VALUE = 100;// Значение по умолчанию (%)

  // Поле отображения масштаба
  var uploadScaleControl = uploadOverlay.querySelector('.upload-resize-controls-value');
  // Загруженная картинка в форму кадрирования (просмотр)
  var uploadImagePreview = uploadOverlay.querySelector('.filter-image-preview');
  // Кнопка изменения размера картинки в меньшую сторону
  var uploadScaleMinus = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  // Кнопка изменения размера картинки в большую сторону
  var uploadScalePlus = uploadOverlay.querySelector('.upload-resize-controls-button-inc');


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
    setScale(defaultValue);
    uploadScaleControl.setAttribute('value', defaultValue + '%');
  };

  // Открытие окна добавления и редактирования фото
  var openUpload = function () {
    // Скрываем форму загрузки фото
    hideElement(uploadForm);
    // Показываем окно добавления и редактирования фото
    showElement(uploadOverlay);

    // Добавляем событие для закрытия окна по нажатию ESC
    onKeyDown(document, uploadCloseESC);
    // Закрываем окно по нажатию ENTER на крестике
    onKeyDown(uploadCancel, uploadCloseENTER);
    // Пока идет ввод в коментариях, форму не закрыть
    onKeyDown(uploadComment, uploadCommentCloseESC);
    // Добавляем событие для закрытия окна по крестику
    onClick(uploadCancel, uploadCloseClick);
    // Добавляем событие для закрытия окна по кнопке Отправить
    // onClick(uploadSubmit, uploadCloseClick);
    // Добавляем событие валидации поля комментирования
    onInvalid(uploadComment, addInvalidField);
    // Добавляем события для кнопок изменения масштаба
    onClick(uploadScaleMinus, onUploadScaleMinus);
    onClick(uploadScalePlus, onUploadScalePlus);
  };

  // Закрытие окна добавления фото
  var closeUpload = function () {
    // Удаляем события
    offKeyDown(document, uploadCloseESC);
    offKeyDown(uploadOverlay, uploadCloseENTER);
    offKeyDown(uploadComment, uploadCommentCloseESC);
    offClick(uploadCancel, uploadCloseClick);
    // offClick(uploadSubmit, uploadCloseClick);
    offInvalid(uploadComment, addInvalidField);
    offClick(uploadScaleMinus, onUploadScaleMinus);
    offClick(uploadScalePlus, onUploadScalePlus);
    // Закрываем окно
    hideElement(uploadOverlay);
    showElement(uploadForm);

    // Устанавливаем значения по умолчанию
    setDefaultUpload(SCALE_DEFAULT_VALUE);
  };

  var uploadCloseESC = onKeyPress(KEY_CODE_ESC, closeUpload);
  var uploadCloseENTER = onKeyPress(KEY_CODE_ENTER, closeUpload);
  var uploadCommentCloseESC = onKeyPress(KEY_CODE_ESC, function (evt) {
    evt.stopPropagation();
  });
  var uploadCloseClick = onPrevent(closeUpload);

  // ----------------------------------------------------

  // Когда фотка загружена открываем окно редактирования фото
  inputUploadFile.addEventListener('change', openUpload);

}());
