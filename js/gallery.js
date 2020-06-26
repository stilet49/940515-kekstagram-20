'use strict';

(function () {

  var pictureTemplate = document.querySelector('#picture').content;
  var pictures = document.querySelector('.pictures');

  var generatedPictures = window.data.generatePictures();

  var photos = window.picture.addPhotoToPictures(generatedPictures, pictureTemplate);
  pictures.appendChild(photos);

  var commentCounter = document.querySelector('.social__comment-count');
  commentCounter.classList.add('hidden');

  var commentLoader = document.querySelector('.comments-loader');
  commentLoader.classList.add('hidden');
})();
