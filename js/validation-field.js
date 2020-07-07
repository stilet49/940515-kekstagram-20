'use strict';

(function () {
  var MAX_COUNT_HASHTAGS = 5;
  var MAX_LENGTH_HASHTAG = 20;
  var HASHTAGS_REGEX = /^#[a-zа-яA-ZА-Я0-9]{1,20}$/;

  var uploadTextContainer = document.querySelector('.img-upload__text');

  /* Поле ввода комментария к картинке */
  var textCommentElement = uploadTextContainer.querySelector('.text__description');

  /* Валидация хеш-тегов */
  var hashTagInputElement = uploadTextContainer.querySelector('.text__hashtags');

  var getHashTagValidity = function (hashTags) {
    if (hashTags.length > MAX_COUNT_HASHTAGS) {
      return 'Превышено максимальное количество тегов (максимум 5 - хеш-тегов)';
    }

    for (var i = 0; i < hashTags.length; i++) {
      if (hashTags[i] === '#') {
        return 'Хеш-тег не может состоять тольк из "#": ' + hashTags[i];
      } else if (hashTags[i][0] !== '#') {
        return 'Хеш-тег должен начинаться с "#": ' + hashTags[i];
      }

      if (!HASHTAGS_REGEX.test(hashTags[i])) {
        return 'Хеш-тег должен состоять только из букв (а-я, А-Я, a-z, A-Z) и цифр(0-9): ' + hashTags[i];
      }

      if (hashTags[i].length > MAX_LENGTH_HASHTAG) {
        return 'Превышена максимальная длина хеш-тега (20 - символов): ' + hashTags[i];
      }


      var currentHashTag = hashTags[i].toLowerCase();

      for (var j = i + 1; j < hashTags.length; j++) {
        var nextHashTag = hashTags[j].toLowerCase();

        if (currentHashTag === nextHashTag) {
          return 'Одинаковые хеш-теги: ' + hashTags[i] + ' и ' + hashTags[j];
        }
      }
    }

    return '';
  };

  var onHashTagInputElementInput = function () {
    checkValidityField();
  };

  var checkValidityField = function () {
    var filteredHashTags = window.util.getFilteredArray(hashTagInputElement.value, ' ');
    var message = getHashTagValidity(filteredHashTags);

    if (message !== '') {
      hashTagInputElement.style.border = '1px solid #f00';
    } else {
      hashTagInputElement.style.border = '';
    }

    hashTagInputElement.setCustomValidity(message);
  };

  var enableValidationField = function () {
    hashTagInputElement.addEventListener('input', onHashTagInputElementInput);
  };

  var disableValidationField = function () {
    hashTagInputElement.value = '';
    textCommentElement.value = '';
    hashTagInputElement.removeEventListener('input', onHashTagInputElementInput);
  };

  window.validationField = {
    enableValidationField: enableValidationField,

    disableValidationField: disableValidationField
  };
})();
