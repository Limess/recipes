window.recipes.transport = (function($) {

  'use strict';

  function get(url, callback) {
    $.ajax({
      dataType: 'json',
      type: 'GET',
      beforeSend: setAuthHeader,
      url: url,
      success: function(res) {
        callback(false, res);
      },
      error: function(jqXHR) {
        var err = jqXHR.responseJSON;
        if (err) {
          callback(err, false)
        }
      }
    });
  }

  function post(url, formData, callback) {
    console.log('making post');
    $.ajax({
      dataType: 'json',
      type: 'POST',
      beforeSend: setAuthHeader,
      url: url,
      data: formData,
      success: function(res) {
        callback(false, res);
      },
      error: function(jqXHR) {
        var err = jqXHR.responseJSON;
        if (err) {
          callback(err, false);
        }
      }
    });
  }

  function setAuthHeader(xhr) {
    var accessToken = window.recipes.accessToken;
    if (accessToken) {
      xhr.setRequestHeader('X-Access-Token', accessToken);
    }
  }

  return {
    get: get,
    post: post
  };

}(jQuery));
