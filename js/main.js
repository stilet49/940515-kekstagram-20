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

function addCommentToPicture(comments, target, template) {
  var fragment = document.createDocumentFragment();

  comments.forEach(function (comment) {
    fragment.appendChild(renderComment(comment, template));
  });

  target.querySelector('.social__comments').appendChild(fragment);
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
  addCommentToPicture(comments, target, template);
}

var pictureTemplate = document.querySelector('#picture').content;
var pictures = document.querySelector('.pictures');

var generatedPictures = generatePictures();

addPhotoToPictures(generatedPictures, pictures, pictureTemplate);

var commentCounter = document.querySelector('.social__comment-count');
commentCounter.classList.add('hidden');

var commentLoader = document.querySelector('.comments-loader');
commentLoader.classList.add('hidden');

/* //createCommentTempalte(); */
var commentTemplate = createCommentTempalte().content;
var bigPicture = document.querySelector('.big-picture');
addPictureToBigPicture(generatedPictures[0], bigPicture, commentTemplate);

bigPicture.classList.remove('hidden');

document.querySelector('body').classList.add('modal-open');


