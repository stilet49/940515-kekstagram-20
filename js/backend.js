'use strict';

(function () {
  var LOAD_URL = 'https://javascript.pages.academy/kekstagram/data';

  var StatusNumber = {
    SUCCESSFUL: 200,
    REDIRECT: 300,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
  };

  var statusMessageMap = {};

  statusMessageMap[StatusNumber['SUCCESSFUL']] = 'Успешно отправлен';
  statusMessageMap[StatusNumber['REDIRECT']] = 'Ресурс переехал';
  statusMessageMap[StatusNumber['BAD_REQUEST']] = 'Неправильный запрос';
  statusMessageMap[StatusNumber['INTERNAL_SERVER_ERROR']] = 'Ошибка на стороне сервера';

  var checkStatus = function (response) {
    if (response.status >= StatusNumber.SUCCESSFUL && response.status < StatusNumber.REDIRECT) {
      return response;
    } else {
      var messageError = (statusMessageMap[response.status]) || 'Статус ответа: ' + response.status + ' ' + response.statusText;

      throw new Error(messageError);
    }
  };

  var toJSON = function (response) {
    return response.json();
  };

  var getData = function () {
    return fetch(LOAD_URL, {method: 'GET'}).then(checkStatus);
  };

  var load = function (onLoad, onError) {
    getData().catch(function (err) {
      onError(err);
    })
    .then(toJSON)
    .then(onLoad);
  };

  window.backend = {
    load: load
  };

})();
