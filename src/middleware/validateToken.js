'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = () =>
  function* validateToken(next) {
    // set unauthorised by default
    let isAuthorised = false;
    // allow token in body, query string, or headers
    const token = (this.request.body && this.request.body.accessToken) ||
      (this.params && this.params.accessToken) ||
      this.cookies.get('authToken') ||
      this.header['X-Access-Token'];
    if (token) {
      try {
        // decode JWT
        const secretKey = config.get('jwtSecretKey');
        yield jwt.verify(token, secretKey);

        isAuthorised = true;
      } catch(err) {
        // if error in decoding return 400 BAD REQUEST
        // to tell the client to clear their token
        this.cookies.set('token', '');
      }
    }

    this.state.isAuthorised = isAuthorised;
    yield next;
  };
