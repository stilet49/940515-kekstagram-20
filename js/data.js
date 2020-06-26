'use strict';

(function () {
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

  window.data = {
    generatePictures: generatePictures
  };
})();
