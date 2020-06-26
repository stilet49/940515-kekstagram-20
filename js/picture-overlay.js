'use strict';

(function () {
  function renderComment(comment, template) {
    var commentElem = template.cloneNode(true);

    commentElem.querySelector('.social__picture').setAttribute('src', comment.avatar);
    commentElem.querySelector('.social__picture').setAttribute('alt', comment.name);

    commentElem.querySelector('.social__text').textContent = comment.message;

    return commentElem;
  }

  function addCommentToPicture(comments, template) {
    var fragment = document.createDocumentFragment();

    comments.forEach(function (comment) {
      fragment.appendChild(renderComment(comment, template));
    });

    return fragment;
  }

  function createCommentTempalte() {
    var template = document.createElement('template');
    template.id = 'comment';

    var list = document.createElement('li');
    list.classList.add('social__comment');
    template.content.appendChild(list);

    list.insertAdjacentHTML('afterbegin', '<img class="social__picture" width="35" height="35">');
    list.insertAdjacentHTML('beforeend', '<p class="social__text"></p>');

    return template.content;
  }

  function addPictureToBigPicture(item, target, template) {
    target.querySelector('.big-picture__img').querySelector('img').setAttribute('src', item.url);
    target.querySelector('.big-picture__img').querySelector('img').setAttribute('alt', item.description);
    target.querySelector('.likes-count').textContent = item.likes;
    target.querySelector('.social__caption').textContent = item.description;
    target.querySelector('.comments-count').textContent = item.comments.length;

    var list = target.querySelector('.social__comments');

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    var comments = item.comments;
    var commentsFragment = addCommentToPicture(comments, template);
    target.querySelector('.social__comments').appendChild(commentsFragment);
  }

  function openBigPicture(picture, target) {
    var commentTemplate = createCommentTempalte();

    addPictureToBigPicture(picture, target, commentTemplate);

    document.addEventListener('keydown', onBigPictureEscPress);

    document.querySelector('body').classList.add('modal-open');
    bigPicture.classList.remove('hidden');
  }

  function closeBigPicture() {
    document.removeEventListener('keydown', onBigPictureEscPress);
    bigPicture.classList.add('hidden');
  }

  function onBigPictureEscPress(evt) {
    if (evt.keyCode !== window.util.KeyCodes.ESC) {
      return;
    }

    if (bigPicture.classList.contains('hidden')) {
      return;
    }

    closeBigPicture();
  }

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');

  bigPictureCancel.addEventListener('click', function onBigPictureCloseClick() {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
  });

  bigPictureCancel.addEventListener('keydown', function onBigPictureCancelEnterPress(evt) {
    if (evt.keyCode !== window.util.KeyCodes.ENTER) {
      return;
    }

    closeBigPicture();
  });
  window.pictureOverlay = {
    bigPicture: bigPicture,
    openBigPicture: openBigPicture
  };

})();
