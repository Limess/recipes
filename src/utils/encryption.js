'use strict'

const Promise = require('bluebird');
const bcrypt = Promise.promisifyAll(require('bcrypt'));

function hashPassword(password) {
  return bcrypt.genSaltAsync(10)
  .then(salt => bcrypt.hashAsync(password, salt))
  .then(hash => hash)
  .catch(err => {
    throw error
  });
}

function checkPassword(password, hash) {
  return bcrypt.compareAsync(password, hash)
  .catch(err => {
    throw err;
  });
}

module.exports = {
  hashPassword,
  checkPassword
}
