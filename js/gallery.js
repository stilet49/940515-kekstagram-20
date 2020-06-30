'use strict';

(function () {

  var onSuccess = function (allPictures) {
    var pictureTemplate = document.querySelector('#picture').content;
    var pictures = document.querySelector('.pictures');

    var photos = window.picture.addPhotoToPictures(allPictures, pictureTemplate);
    pictures.appendChild(photos);
  };

  var onError = function (message) {
    window.requestResult.displayError(message, true);
  };

  window.backend.load(onSuccess, onError);

  var commentCounter = document.querySelector('.social__comment-count');
  commentCounter.classList.add('hidden');

  var commentLoader = document.querySelector('.comments-loader');
  commentLoader.classList.add('hidden');
})();
