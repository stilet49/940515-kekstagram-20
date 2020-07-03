'use strict';

(function () {
  var picturesData = null;
  var imgFiltersContainer = document.querySelector('.img-filters');
  var picturesContainer = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture').content;

  var removePictureElements = function () {
    var pictureElements = Array.from(picturesContainer.querySelectorAll('.picture'));

    pictureElements.forEach(function (it) {
      picturesContainer.removeChild(it);
    });
  };

  var renderPictures = function (pictures) {
    var photos = window.picture.addPhotoToPictures(pictures, pictureTemplate);

    picturesContainer.appendChild(photos);
  };

  var sortFiltersMap = {
    'filter-default': window.util.debounce(function (sortedArray) {
      removePictureElements();
      renderPictures(sortedArray);
    }),

    'filter-random': window.util.debounce(function (sortedArray) {
      var sortedByRandomPictures = sortedArray.slice();
      sortedByRandomPictures = window.util.shuffleArray(sortedByRandomPictures).slice(15);

      removePictureElements();
      renderPictures(sortedByRandomPictures);
    }),

    'filter-discussed': window.util.debounce(function (sortedArray) {
      var sortedByCommentsOrder = sortedArray.slice()
        .sort(function (a, b) {
          return b.comments.length - a.comments.length;
        });

      removePictureElements();

      renderPictures(sortedByCommentsOrder);
    })
  };

  var onImgFiltersContainerClick = function (evt) {
    var target = evt.target;
    var activeButton = imgFiltersContainer.querySelector('.img-filters__button--active');

    if (target !== activeButton) {
      if (target.classList.contains('img-filters__button')) {
        activeButton.classList.remove('img-filters__button--active');
        target.classList.add('img-filters__button--active');
        activeButton = target;

        sortFiltersMap[target.id](picturesData);
      }
    }
  };

  var enableSortPictures = function () {
    imgFiltersContainer.classList.remove('img-filters--inactive');
    imgFiltersContainer.addEventListener('click', onImgFiltersContainerClick);
  };

  var onSuccess = function (allPictures) {
    picturesData = allPictures;

    renderPictures(allPictures);

    enableSortPictures();
  };

  var onError = function (message) {
    window.requestResult.displayError(message, true);
  };

  window.backend.load(onSuccess, onError);

  /* var commentCounter = document.querySelector('.social__comment-count');
  commentCounter.classList.add('hidden'); */

  var commentLoader = document.querySelector('.comments-loader');
  commentLoader.classList.add('hidden');
})();
