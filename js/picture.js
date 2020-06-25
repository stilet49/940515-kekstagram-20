'use strict';

(function () {
  function renderPhoto(picture, template) {
    var pictureElem = template.cloneNode(true);
    var pictureLink = pictureElem.querySelector('.picture');
    pictureElem.querySelector('.picture')
      .querySelector('img').setAttribute('src', picture.url);

    pictureElem.querySelector('.picture__likes').textContent = picture.likes;

    pictureElem.querySelector('.picture__comments').textContent = picture.comments.length;
    pictureLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      window.pictureOverlay.openBigPicture(picture, window.pictureOverlay.bigPicture);
    });

    pictureLink.addEventListener('keydown', function (evt) {
      if (evt.keyCode !== window.util.KeyCodes.ENTER) {
        return;
      }

      evt.preventDefault();
      window.pictureOverlay.openBigPicture(picture, window.pictureOverlay.bigPicture);
    });
    return pictureElem;
  }

  function addPhotoToPictures(pictures, template) {
    var fragment = document.createDocumentFragment();

    pictures.forEach(function (picture) {
      fragment.appendChild(renderPhoto(picture, template));
    });

    return fragment;
  }

  window.picture = {
    addPhotoToPictures: addPhotoToPictures
  };
})();
