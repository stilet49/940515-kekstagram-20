'use strict';

(function () {
  var uploadSelectImageForm = document.querySelector('#upload-select-image');
  var effectImagePreview = uploadSelectImageForm.querySelector('.img-upload__preview').querySelector('img');
  var uploadFileElement = uploadSelectImageForm.querySelector('#upload-file');

  function resetUploadForm(form) {
    var uploadResizeControlsValue = form.querySelector('.scale__control--value');

    var uploadEffectControls = form.querySelector('.img-upload__effects ');

    uploadFileElement.value = '';
    uploadResizeControlsValue.value = '100%';
    effectImagePreview.className = '';
    effectImagePreview.style.transform = '';

    uploadEffectControls.querySelector('[name=effect]').checked = true;
    form.querySelector('.text__hashtags').value = '';
    form.querySelector('.text__description').value = '';
  }

  function validateUploadForm(form) {
    var isValidHashtags = validataFormHashtags(form);
    var uploadFormHashtags = form.querySelector('.text__hashtags');

    if (!isValidHashtags) {
      uploadFormHashtags.style.border = '1px solid #f00';
    } else {
      uploadFormHashtags.style.border = '';
    }

    return isValidHashtags;
  }

  function validataFormHashtags(form) {
    var hashtags = form.querySelector('.text__hashtags').value.split(' ').sort();
    var noMoreThanFiveHashtags = hashtags.length <= 5;

    var hasDuplicate = (hashtags.length === 1) ? false : hashtags.some(function (item, index, array) {
      if (!array[index + 1]) {
        return false;
      }

      return item.toLowerCase() === array[index + 1].toLowerCase();
    });

    var everyHashtagPasses = hashtags.every(function (item) {
      return /^#[a-zа-яA-ZА-Я0-9]{1,20}$/.test(item);
    });

    return noMoreThanFiveHashtags && !hasDuplicate && everyHashtagPasses;
  }

  function onUploadOverlayEscPress(evt) {
    if (evt.keyCode !== window.util.KeyCodes.ESC) {
      return;
    }

    if (document.activeElement.classList.contains('text__description')) {
      return;
    }

    closeUploadOverlay();
  }

  function openUploadOverlay(fileUrl) {
    resetUploadForm(uploadSelectImageForm);
    effectImagePreview.src = fileUrl;

    uploadSelectImageForm.querySelector('.img-upload__start').classList.add('hidden');
    uploadSelectImageForm.querySelector('.img-upload__overlay').classList.remove('hidden');
    document.querySelector('body').classList.add('modal-open');
  }

  function closeUploadOverlay() {
    document.removeEventListener('keydown', onUploadOverlayEscPress);

    resetUploadForm(uploadSelectImageForm);

    uploadSelectImageForm.querySelector('.img-upload__start').classList.remove('hidden');
    uploadSelectImageForm.querySelector('.img-upload__overlay').classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
  }

  var onLoadForm = function () {
    closeUploadOverlay();
    window.requestResult.displaySuccess();
  };

  var onErrorForm = function () {
    closeUploadOverlay();
    window.requestResult.displayError(true);
  };

  var onUploadFormElementSubmit = function (form) {
    var formData = new FormData(form);

    window.backend.upload(formData, onLoadForm, onErrorForm);
  };

  uploadSelectImageForm.addEventListener('submit', function onUploadSelectImageFormSubmit(evt) {
    if (!document.activeElement.classList.contains('img-upload__submit')) {
      evt.preventDefault();
      return;
    }
    evt.preventDefault();
    var isValidForm = validateUploadForm(uploadSelectImageForm);

    if (!isValidForm) {
      evt.preventDefault();
    } else {
      onUploadFormElementSubmit(uploadSelectImageForm);
    }

  });

  uploadSelectImageForm.querySelector('.text__description').addEventListener('invalid', function () {
    uploadSelectImageForm.querySelector('.text__description').style.border = '1px solid #f00';
  });

  uploadSelectImageForm.querySelector('.text__description').addEventListener('valid', function () {
    uploadSelectImageForm.querySelector('.text__description').style.border = '';
  });

  uploadFileElement.addEventListener('change', function onUploadFileChange(evt) {
    document.addEventListener('keydown', onUploadOverlayEscPress(evt));
    window.readFile(uploadFileElement, openUploadOverlay);
  });

  uploadSelectImageForm.querySelector('.img-upload__cancel').addEventListener('click', function onUploadFormCancelClick() {
    closeUploadOverlay(uploadSelectImageForm);
  });

})();
