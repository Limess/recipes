'use strict';

const config = require('config');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
require('bluebird');

function registerUser(userName, password) {
  // return result of repository call. If successful generate token
  return userRepository.createUser(userName, password).then(generateJWT);
}

function authenticateUser(userName, password) {
  // return result of repository call. If successful generate token
  return userRepository.authenticateUser(userName, password).then(generateJWT);
}

function starRecipe(userName, recipeId) {
  // return result of repository call, no processing to be done yet
  return userRepository.starRecipe(userName, recipeId);
}

function unStarRecipe(userName, recipeId) {
  // return result of repository call, no processing to be done yet
  return userRepository.unStarRecipe(userName, recipeId);
}

function doesUserExist(userName) {
  // return true if returned user
  // catch Promise user not found error and return false if user doesn't exist
  return userRepository.getUser(userName)
  .then(() => true)
  .catch(() => false);
}

function generateJWT(user) {
  return jwt.sign(user, config.get('jwtSecretKey'), {
    expiresInMinutes: 60 * 24 // expires in 24 hours
  });
}

module.exports = {
  registerUser,
  authenticateUser,
  starRecipe,
  unStarRecipe,
  doesUserExist
};
