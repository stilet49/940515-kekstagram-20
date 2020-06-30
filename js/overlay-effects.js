'use strict';

(function () {

  var SCALE_STEP = 25;
  var SCALE_MIN = 25;
  var SCALE_MAX = 100;

  var EFFECTS = {
    chrome: {
      filter: 'grayscale',
      max: 1
    },
    sepia: {
      filter: 'sepia',
      max: 1
    },
    marvin: {
      filter: 'invert',
      max: 100,
      units: '%'
    },
    phobos: {
      filter: 'blur',
      max: 3,
      units: 'px'
    },
    heat: {
      filter: 'brightness',
      max: 3
    }
  };

  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      left: box.left + window.pageXOffset,
      top: box.top + window.pageYOffset
    };
  }

  function updateEffectsLevel(percents) {
    var effect = EFFECTS[currentEffect];
    var effectImagePreview = uploadSelectImageForm.querySelector('.img-upload__preview').querySelector('img');

    var value = (typeof percents !== 'undefined') ? (effect.max * percents) / 100 : effect.max;

    value = effect.units ? value + effect.units : value;

    effectImagePreview.style.filter = effect.filter + '(' + value + ')';
  }

  function changeLevelDisplay(form) {
    var effectImagePreview = form.querySelector('.img-upload__preview').querySelector('img');
    var effectLevel = form.querySelector('.img-upload__effect-level');
    var effectLevelLine = effectLevel.querySelector('.effect-level__line');
    var effectLevelPin = effectLevelLine.querySelector('.effect-level__pin');
    var effectLevelVal = effectLevelLine.querySelector('.effect-level__depth');

    if (currentEffect === 'none') {
      effectLevel.style.display = 'none';
      effectImagePreview.style.filter = '';
      return;
    }

    updateEffectsLevel();
    effectLevelPin.style.left = '100%';
    effectLevelVal.style.width = '100%';
    effectLevel.style.display = 'block';
  }

  var uploadSelectImageForm = document.querySelector('#upload-select-image');

  uploadSelectImageForm.querySelector('.img-upload__scale').addEventListener('click', function onUploadResizeControlsClick(evt) {
    var step = SCALE_STEP;
    var min = SCALE_MIN;
    var max = SCALE_MAX;

    var uploadResizeControlsValue = uploadSelectImageForm.querySelector('.img-upload__scale').querySelector('.scale__control--value');
    var effectImagePreview = uploadSelectImageForm.querySelector('.img-upload__preview').querySelector('img');

    var currentValue = parseInt(uploadResizeControlsValue.value.slice(0, -1), 10);
    var newValue = 0;

    if (evt.target.classList.contains('scale__control--smaller')) {
      newValue = currentValue - step;
      newValue = (newValue <= min) ? min : newValue;
    }

    if (evt.target.classList.contains('scale__control--bigger')) {
      newValue = currentValue + step;
      newValue = (newValue >= max) ? max : newValue;
    }

    uploadResizeControlsValue.value = newValue + '%';
    effectImagePreview.style.transform = 'scale(' + (newValue / 100) + ')';
  });

  var currentEffect = 'none';

  changeLevelDisplay(uploadSelectImageForm);

  uploadSelectImageForm.querySelector('.img-upload__effects ').addEventListener('change', function onUploadEffectControlsChange(evt) {
    var effectImagePreview = uploadSelectImageForm.querySelector('.img-upload__preview').querySelector('img');

    if (evt.target.name !== 'effect') {
      return;
    }

    effectImagePreview.classList.remove('effects__preview--' + currentEffect);

    effectImagePreview.classList.add('effects__preview--' + evt.target.value);

    currentEffect = evt.target.value;

    changeLevelDisplay(uploadSelectImageForm);
  });

  uploadSelectImageForm.querySelector('.effect-level__pin').addEventListener('mousedown', function onEffectLeveloinMouseDown(evt) {
    evt.preventDefault();

    var effectLevelPin = uploadSelectImageForm.querySelector('.effect-level__pin');
    var effectLevelLine = uploadSelectImageForm.querySelector('.effect-level__line');
    var effectLevelVal = effectLevelLine.querySelector('.effect-level__depth');
    var pinCoords = getCoords(effectLevelPin);
    var lineCoords = getCoords(effectLevelLine);
    var shiftX = evt.pageX - pinCoords.left;

    function onEffectLeveloinMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var newLeft = moveEvt.pageX - shiftX - lineCoords.left;

      if (newLeft < 0) {
        newLeft = 0;
      }

      var rightEdge = effectLevelLine.offsetWidth;

      if (newLeft > rightEdge) {
        newLeft = rightEdge;
      }

      var percents = (newLeft * 100) / rightEdge;

      updateEffectsLevel(percents);

      effectLevelPin.style.left = newLeft + 'px';
      effectLevelVal.style.width = newLeft + 'px';
    }

    function onEffectLevelPinMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onEffectLeveloinMouseMove);
      document.removeEventListener('mouseup', onEffectLevelPinMouseUp);
    }

    document.addEventListener('mousemove', onEffectLeveloinMouseMove);
    document.addEventListener('mouseup', onEffectLevelPinMouseUp);

    return false;
  });


  uploadSelectImageForm.querySelector('.effect-level__pin').addEventListener('dragstar', function onEffectLevelPinDragStart(evt) {
    evt.preventDefault();
  });


})();
