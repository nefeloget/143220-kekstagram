'use strict';

window.data = (function () {
  // Константы
  var MIN_LIKES = 15;     // Минимальное кол-во лайков
  var MAX_LIKES = 200;    // Максимальное кол-во лайков
  var MIN_COMMENTS = 1;   // Минимальное кол-во комментариев
  var MAX_COMMENTS = 2;   // Максимальное кол-во комментариев
  var PICTURES_COUNT = 25;// Кол-во фотографий

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

  // Конструктор картинки
  var Picture = function (idUser) {
    // Адрес картинки
    this.url = 'photos/' + idUser + '.jpg';
    // Количество лайков, поставленных фотографии
    this.likes = window.util.getRandomValue(MAX_LIKES, MIN_LIKES);
    // Количество комментариев
    this.commentsCount = window.util.getRandomValue(MAX_COMMENTS, MIN_COMMENTS);
    // Список комментариев, оставленных другими пользователями к этой фотографии.
    this.comments = [];
  };

  Picture.prototype = {
    // Метод добавления случайных комментариев из списка
    addComments: function () {
      var commentValue;
      for (var i = 1; i <= this.commentsCount; i++) {
        commentValue = commentsList[window.util.getRandomValue(commentsList.length - 1)];
        if (!window.util.findValue(this.comments, commentValue)) {
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

  // Создаем массив с фотографиями и заполняем его случайными данными
  for (var i = 1; i <= PICTURES_COUNT; i++) {
    getPictures(i);
  }

  return pictures;

})();
