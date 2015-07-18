'use strict';

const userRepository = require('../repositories/userRepository')
const Promise = require('bluebird');

function registerUser(userName) {
  // return result of repository call, no processing to be done yet
  return Promise.resolve().then(() => userRepository.createUser(userName));
}

function authenticateUser(userName, password) {
  return userRepository.authenticateUser(userName, password);
}

function starRecipe(userName, recipeId) {
  // return result of repository call, no processing to be done yet
  return userRepository.starRecipe(userName, recipeId);
}

module.exports = {
  registerUser,
  authenticateUser,
  starRecipe
};
