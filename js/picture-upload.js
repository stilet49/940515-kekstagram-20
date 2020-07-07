'use strict';

(function () {
  var uploadSelectImageForm = document.querySelector('#upload-select-image');
  var effectImagePreview = uploadSelectImageForm.querySelector('.img-upload__preview').querySelector('img');
  var uploadFileElement = uploadSelectImageForm.querySelector('#upload-file');

  function resetUploadForm(form) {
    var uploadResizeControlsValue = form.querySelector('.scale__control--value');
    var effectLevel = form.querySelector('.img-upload__effect-level');
    var uploadEffectControls = form.querySelector('.img-upload__effects ');


    uploadResizeControlsValue.value = '100%';
    effectImagePreview.className = '';
    effectImagePreview.style = '';
    effectLevel.style.display = 'none';
    uploadEffectControls.querySelector('[name=effect]').checked = true;
    form.querySelector('.text__hashtags').value = '';
    form.querySelector('.text__hashtags').style.border = '';
    form.querySelector('.text__description').value = '';
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

    uploadSelectImageForm.querySelectorAll('.effects__preview').forEach(function (item) {
      item.style.backgroundImage = 'url(' + fileUrl + ')';
    });
    uploadSelectImageForm.querySelector('.img-upload__start').classList.add('hidden');
    uploadSelectImageForm.querySelector('.img-upload__overlay').classList.remove('hidden');
    window.validationField.enableValidationField();
    document.querySelector('body').classList.add('modal-open');
  }

  function closeUploadOverlay() {
    document.removeEventListener('keydown', onUploadOverlayEscPress);

    resetUploadForm(uploadSelectImageForm);
    uploadFileElement.value = '';
    uploadSelectImageForm.querySelector('.img-upload__start').classList.remove('hidden');
    uploadSelectImageForm.querySelector('.img-upload__overlay').classList.add('hidden');
    window.validationField.disableValidationField();
    document.querySelector('body').classList.remove('modal-open');
  }

  var onLoadForm = function () {
    window.requestResult.displaySuccess();
    closeUploadOverlay();
  };

  var onErrorForm = function () {
    window.requestResult.displayError(true);
    closeUploadOverlay();
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
    onUploadFormElementSubmit(uploadSelectImageForm);

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
