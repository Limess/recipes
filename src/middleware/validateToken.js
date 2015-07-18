'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = () =>
  function* validateToken(next) {
    // set unauthorised by default
    this.isAuthorised = false
    // allow token in body, query string, or headers
    var token = (this.request.body && this.request.body.accessToken) ||
      (this.params && this.params.accessToken) ||
      this.cookies.get('acessToken') ||
      this.header['X-Access-Token'];
    if (token) {
      console.log('JWT token present');
      try {
        // decode JWT
        var decoded = jwt.decode(token, config.get('jwtSecretKey'));

        if (decoded.exp >= Date.now()) {
          // token is valid add flag to context,
          // then return next middleware (probably an auth'd endpoint)
          this.isAuthorised = true;
          return yield next;
        }
        yield next;
      } catch (err) {
        // if error in decoding return 400 BAD REQUEST
        // to tell the client to clear their token
        this.status = 400;
        console.log('redirected from validateToken');
        return this.redirect('/login');
      }
    } else {
      yield next;
    }
  }
