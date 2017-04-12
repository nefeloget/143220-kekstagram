'use strict';

// Константы
var MIN_LIKES = 15;   // Минимальное кол-во лайков
var MAX_LIKES = 200;  // Максимальное кол-во лайков
var MIN_COMMENTS = 1; // Минимальное кол-во комментариев
var MAX_COMMENTS = 2; // Максимальное кол-во комментариев

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
var getRandomValue = function (minValue, maxValue) {
  return Math.round(Math.random() * (maxValue - minValue) + minValue);
};

// Конструктор картинки
var Picture = function (idUser) {
  // Адрес картинки
  this.url = 'photos/' + idUser + '.jpg';
  // Количество лайков, поставленных фотографии
  this.likes = getRandomValue(MIN_LIKES, MAX_LIKES);
  // Количество комментариев
  this.commentsCount = getRandomValue(MIN_COMMENTS, MAX_COMMENTS);
  // Список комментариев, оставленных другими пользователями к этой фотографии.
  this.comments = [];

  // Метод добавления случайных комментариев из списка
  this.addComments = function (commentsArray) {
    for (var i = 0; i < this.commentsCount; i++) {
      this.comments.push(commentsArray[Math.floor(Math.random() * (commentsArray.length - 1))]);
    }
  };

  // Метод добавления данных в массив
  this.addInArray = function (picturesArray) {
    picturesArray.push(this);
  };
};

// Создаем экземпляр картинки
var getPictures = function (idUser, commentsArray, picturesArray) {
  var pictureEl = new Picture(idUser);
  pictureEl.addComments(commentsArray);
  pictureEl.addInArray(picturesArray);
};

// Создаем массив с фотографиями и заполняем его случайными данными
for (var i = 1; i <= picturesCount; i++) {
  getPictures(i, commentsList, pictures);
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

// Показать блок
var showElement = function (block) {
  block.classList.remove('invisible');
};

// Скрыть блок
var hideElement = function (block) {
  block.classList.add('invisible');
};

// Заполняем окно галереи картинкой
var galleryOverlayContent = function (element) {
  commentsSelector = '.comments-count';
  likesSelector = '.likes-count';
  pictureContent(galleryOverlay, element);
};

hideElement(uploadOverlay);
showElement(galleryOverlay);
galleryOverlayContent(pictures[0]);
