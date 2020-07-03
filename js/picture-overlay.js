'use strict';

(function () {

  var MAX_COMMENTS_LENGTH = 5;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
  var commentsContainer = bigPicture.querySelector('.social__comments');
  var commentCountElement = bigPicture.querySelector('.social__comment-count');
  var loadMoreCommentsBtn = bigPicture.querySelector('.comments-loader');

  var clonedComments = [];
  var currentAddedComments = null;

  function renderComment(comment) {
    var commentElement = document.createElement('li');
    var userIconElement = document.createElement('img');
    var commentText = document.createTextNode(comment.message);

    commentElement.classList.add('social__comment', 'social__comment--text');
    userIconElement.classList.add('social__picture');
    userIconElement.src = comment.avatar;
    userIconElement.alt = comment.name;

    commentElement.appendChild(userIconElement);
    commentElement.appendChild(commentText);

    return commentElement;
  }

  function addCommentToPicture(commentsLength) {
    currentAddedComments += commentsLength;

    for (var i = 0; i < commentsLength; i++) {
      commentsContainer.appendChild(renderComment(clonedComments[0]));

      clonedComments.splice(0, 1);
    }

    if (clonedComments.length === 0) {
      loadMoreCommentsBtn.classList.add('hidden');
    }

    commentCountElement.firstChild.textContent = currentAddedComments.toString() + ' из ';

  }

  var onLoadMoreCommentsBtnClick = function (evt) {
    evt.preventDefault();

    addCommentToPicture(window.util.clamp(clonedComments.length, 0, MAX_COMMENTS_LENGTH));
  };

  function addPictureToBigPicture(item, target) {
    target.querySelector('.big-picture__img').querySelector('img').setAttribute('src', item.url);
    target.querySelector('.big-picture__img').querySelector('img').setAttribute('alt', item.description);
    target.querySelector('.likes-count').textContent = item.likes;
    target.querySelector('.social__caption').textContent = item.description;
    target.querySelector('.comments-count').textContent = (item.comments.length).toString();

    var list = target.querySelector('.social__comments');

    while (list.firstChild) {
      list.removeChild(list.firstChild);
    }
    loadMoreCommentsBtn.classList.toggle('hidden', (item.comments.length <= 5));
    clonedComments = item.comments.slice();

    addCommentToPicture(window.util.clamp(clonedComments.length, 0, MAX_COMMENTS_LENGTH));

    loadMoreCommentsBtn.addEventListener('click', onLoadMoreCommentsBtnClick);

  }

  function openBigPicture(picture, target) {

    addPictureToBigPicture(picture, target);

    document.addEventListener('keydown', onBigPictureEscPress);

    document.querySelector('body').classList.add('modal-open');
    bigPicture.classList.remove('hidden');
  }

  function closeBigPicture() {
    currentAddedComments = 0;

    document.removeEventListener('keydown', onBigPictureEscPress);
    bigPicture.classList.add('hidden');
    loadMoreCommentsBtn.removeEventListener('click', onLoadMoreCommentsBtnClick);
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

  bigPictureCancel.addEventListener('click', function onBigPictureCloseClick() {
    closeBigPicture();
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
