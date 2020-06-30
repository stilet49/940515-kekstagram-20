'use strict';

(function () {
  var LOAD_URL = 'https://javascript.pages.academy/kekstagram/data';
  var UPLOAD_URL = 'https://javascript.pages.academy/kekstagram';

  var StatusNumber = {
    SUCCESSFUL: 200,
    REDIRECT: 300,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500
  };

  var connect = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === StatusNumber.SUCCESSFUL) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000; // 10s

    return xhr;
  };

  var load = function (onLoad, onError) {
    var xhr = connect(onLoad, onError);

    xhr.open('GET', LOAD_URL);
    xhr.send();
  };

  var upload = function (data, onLoad, onError) {
    var xhr = connect(onLoad, onError);

    xhr.open('POST', UPLOAD_URL);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };

})();
