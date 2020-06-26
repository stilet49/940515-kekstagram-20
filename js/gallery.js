'use strict';

(function () {

  var picturesData = null;

  var onSuccess = function (allPictures) {
    var pictureTemplate = document.querySelector('#picture').content;
    var pictures = document.querySelector('.pictures');

    picturesData = allPictures;

    var photos = window.picture.addPhotoToPictures(picturesData, pictureTemplate);
    pictures.appendChild(photos);
  };

  var onError = function () {
    /* Я пока не придумал как обрабатывать ошибки, да и по заданию никаких требований нет.
    При этом на вывод в консоль и алерт линтер ругается*/
  };
  /* var generatedPictures = window.data.generatePictures();
  var photos = window.picture.addPhotoToPictures(generatedPictures, pictureTemplate);
  pictures.appendChild(photos); */

  window.backend.load(onSuccess, onError);

  var commentCounter = document.querySelector('.social__comment-count');
  commentCounter.classList.add('hidden');

  var commentLoader = document.querySelector('.comments-loader');
  commentLoader.classList.add('hidden');
})();
