'use strict';

const userService = require('../services/userService');

// Used to check if we can trust the userName in the users cookies
// Also prevents the user from getting in an erronous state
// could also redirect the user to a /logout endpoint which
// is more transparent
module.exports = () =>
  function* checkUser(next) {
    const userName = this.cookies.get('userName');
    if (userName) {
      try {
        const userExists = yield userService.doesUserExist(userName);
        if (!userExists) {
          this.cookies.set('authToken', '');
          this.cookies.set('userName', '');
        } else {
          this.state.userName = userName;
        }
      } catch (err) {
        this.cookies.set('authToken', '');
        this.cookies.set('userName', '');
      }
    }
    yield next;
  };
