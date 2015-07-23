// Was going to use client side ajax calls to enhance server side calls, left in for demonstration
(function(ajax, dom) {

  'use strict';

 // dom.delegate('.login__form', 'submit', login);
 // dom.delegate('.register__form', 'submit', register);

  function login(event) {
    event.preventDefault();
    var loginForm = dom.get('.login__form');

    ajax.post('/login', loginForm.serialize(), function(err, response) {
      if (err) {
        // clear token if invalid for whatever reason;
        if (err.statusCode = 403 && window.recipes.accessToken) {
          delete window.recipes.accessToken;
        }
        console.error(err);
      }
      window.recipes.accessToken = response.token;
    });
  }

  function register(event) {
    console.log('hit register handler');
    event.preventDefault();
    var registerForm = dom.get('.register__form');

    ajax.post('/register', registerForm.serialize(), function(err, response) {
      if (err) {
        console.error(err);
      }
      window.recipes.accessToken = response.token;
    });
  }

}(window.recipes.ajax, window.recipes.dom));
