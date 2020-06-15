'use strict';

var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var USERS = [
  'Элинский Аристарх',
  'Умберг Иосиф',
  'Нустров Пахом',
  'Николюк Викентий',
  'Яковенко Ян',
  'Колпачёв Аким',
  'Порошина Влада',
  'Каверина Аза',
  'Кац Ирина',
  'Астрединова Альбина',
  'Ядрова Элеонора',
  'Енютина Регина'
];

var KEYCODES = {
  Enter: 13,
  Esc: 27
};

var SCALE_STEP = 25;
var SCALE_MIN = 25;
var SCALE_MAX = 100;

function generatePictureURL(index) {
  return 'photos/' + index + '.jpg';
}

function generateAvatarURL(index) {
  return 'img/avatar-' + index + '.svg';
}

function getRandomInteger(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function generateRandomUser(users) {
  var max = users.length - 1;
  var nameNumber = getRandomInteger(0, max);

  return (users[nameNumber]);
}

function generateRandomComment(comments) {
  var listComments = [];
  var max = comments.length - 1;
  var countComments = getRandomInteger(1, 5);

  for (var i = 0; i < countComments; i++) {
    var commentNumber = getRandomInteger(0, max);
    var avatarNumber = getRandomInteger(1, 6);
    listComments.push({
      avatar: generateAvatarURL(avatarNumber),
      message: comments[commentNumber],
      name: generateRandomUser(USERS)
    });
  }

  return listComments;
}

function generatePictures(quantity) {
  var pictures = [];

  quantity = quantity || 25; // либо заданное значение либо 25

  for (var i = 0; i < quantity; i++) {
    pictures.push({
      url: generatePictureURL(i + 1, quantity),
      description: '',
      likes: getRandomInteger(15, 200),
      comments: generateRandomComment(COMMENTS)
    });
  }

  return pictures;
}

function renderPhoto(picture, template) {
  var pictureElem = template.cloneNode(true);

  pictureElem.querySelector('.picture')
    .querySelector('img').setAttribute('src', picture.url);

  pictureElem.querySelector('.picture__likes').textContent = picture.likes;

  pictureElem.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElem;
}

function addPhotoToPictures(pictures, target, template) {
  var fragment = document.createDocumentFragment();

  pictures.forEach(function (picture) {
    fragment.appendChild(renderPhoto(picture, template));
  });

  target.appendChild(fragment);
}

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

  document.body.appendChild(template);

  return template;
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

var pictureTemplate = document.querySelector('#picture').content;
var pictures = document.querySelector('.pictures');

var generatedPictures = generatePictures();

addPhotoToPictures(generatedPictures, pictures, pictureTemplate);

var commentCounter = document.querySelector('.social__comment-count');
commentCounter.classList.add('hidden');

var commentLoader = document.querySelector('.comments-loader');
commentLoader.classList.add('hidden');

var commentTemplate = createCommentTempalte().content;
var bigPicture = document.querySelector('.big-picture');
var bigPictureCancel = bigPicture.querySelector('.big-picture__cancel');
addPictureToBigPicture(generatedPictures[0], bigPicture, commentTemplate);

bigPicture.classList.remove('hidden');


bigPictureCancel.addEventListener('click', function onBigPictureClose(evt) {
  bigPicture.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
});

var uploadSelectImageForm = document.querySelector('#upload-select-image');
var uploadOverlay = uploadSelectImageForm.querySelector('.img-upload__overlay');
var uploadFile = uploadSelectImageForm.querySelector('#upload-file');
var uploadImage = uploadSelectImageForm.querySelector('.img-upload__start');
var uploadFormCancel = uploadSelectImageForm.querySelector('.img-upload__cancel');
var uploadEffectControls = uploadSelectImageForm.querySelector('.img-upload__effects ');
var uploadResizeControls = uploadSelectImageForm.querySelector('.img-upload__scale');
var uploadResizeControlsValue = uploadResizeControls.querySelector('.scale__control--value');
var uploadImagePreview = uploadSelectImageForm.querySelector('.img-upload__preview');
var effectImagePreview = uploadImagePreview.querySelector('img');
var uploadFormHashtags = uploadSelectImageForm.querySelector('.text__hashtags');
var uploadFormDescription = uploadSelectImageForm.querySelector('.text__description');

uploadSelectImageForm.addEventListener('submit', function onUploadSelectImageFormSubmit(evt) {
  if (!document.activeElement.classList.contains('img-upload__submit')) {
    evt.preventDefault();
    return;
  }

  var isValidForm = validateUploadForm();

  if (!isValidForm) {
    evt.preventDefault();
  }
});

uploadFormDescription.addEventListener('invalid', function (evt) {
  uploadFormDescription.style.border = '1px solid #f00';
});

uploadFormDescription.addEventListener('valid', function (evt) {
  uploadFormDescription.style.border = '';
});

function resetUploadForm() {
  uploadFile.value = '';
  uploadResizeControlsValue.value = '55%';
  effectImagePreview.className = '';
  effectImagePreview.style.transform = '';

  uploadEffectControls.querySelector('[name=effect]').checked = true;
  uploadFormHashtags.value = '';
  uploadFormDescription.value = '';
}

function validateUploadForm() {
  var isValidHashtags = validataFormHashtags();

  if (!isValidHashtags) {
    uploadFormHashtags.style.border = '1px solid #f00';
  } else {
    uploadFormHashtags.style.border = '';
  }

  return isValidHashtags;

}

function validataFormHashtags() {
  var hashtags = uploadFormHashtags.value.split(' ').sort();
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
  if (evt.keyCode !== KEYCODES.Esc) {
    return;
  }

  if (document.activeElement.classList.contains('text__description')) {
    return;
  }

  closeUploadOverlay();
}

function openUploadOverlay() {
  uploadImage.classList.add('hidden');
  uploadOverlay.classList.remove('hidden');
  document.querySelector('body').classList.add('modal-open');
}

function closeUploadOverlay() {
  document.removeEventListener('keydown', onUploadOverlayEscPress);

  resetUploadForm();

  uploadImage.classList.remove('hidden');
  uploadOverlay.classList.add('hidden');
  document.querySelector('body').classList.remove('modal-open');
  uploadFile.removeEventListener('change');
}

uploadFile.addEventListener('change', function onUploadFileChange(evt) {
  document.addEventListener('keydown', onUploadOverlayEscPress);

  openUploadOverlay();
});

uploadFormCancel.addEventListener('click', function onUploadFormCancelClick(evt) {
  closeUploadOverlay();

});

uploadResizeControls.addEventListener('click', function onUploadResizeControlsClick(evt) {
  var step = SCALE_STEP;
  var min = SCALE_MIN;
  var max = SCALE_MAX;

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

var currentEffect = 'none';

var effectLevel = document.querySelector('.img-upload__effect-level');
var effectLevelLine = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevelLine.querySelector('.effect-level__pin');
var effectLevelVal = effectLevelLine.querySelector('.effect-level__depth');

function getCoords(elem) {
  var box = elem.getBoundingClientRect();

  return {
    left: box.left + window.pageXOffset,
    top: box.top + window.pageYOffset
  };
}

function updateEffectsLevel(percents) {
  var effect = EFFECTS[currentEffect];

  var value = (typeof percents !== 'undefined') ? (effect.max * percents) / 100 : effect.max;

  value = effect.units ? value + effect.units : value;

  effectImagePreview.style.filter = effect.filter + '(' + value + ')';
}

function changeLevelDisplay() {
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

changeLevelDisplay();

uploadEffectControls.addEventListener('change', function onUploadEffectControlsChange(evt) {
  if (evt.target.name !== 'effect') {
    return;
  }

  effectImagePreview.classList.remove('effects__preview--' + currentEffect);

  effectImagePreview.classList.add('effects__preview--' + evt.target.value);

  currentEffect = evt.target.value;

  changeLevelDisplay();
});

effectLevelPin.addEventListener('mousedown', function onEffectLeveloinMouseDown(evt) {
  evt.preventDefault();

  var pinCoords = getCoords(effectLevelPin);
  var lineCoords = getCoords(effectLevelLine);

  function onEffectLevelPinMouseUp(upEvt) {
    upEvt.preventDefault();

    var newLeft = pinCoords.left - lineCoords.left + effectLevelPin.offsetWidth * 0.5;
    var rightEdge = effectLevelLine.offsetWidth;
    var percents = (newLeft * 100) / rightEdge;

    updateEffectsLevel(percents);

    document.removeEventListener('mouseup', onEffectLevelPinMouseUp);
  }

  document.addEventListener('mouseup', onEffectLevelPinMouseUp);
});
