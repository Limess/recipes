'use strict';

const Promise = require('bluebird');
const encryption = require('../utils/encryption');
let userJson = [];

function getUser(userName) {
  const user = userJson.find(user => user.userName === userName);
  // returns undefined if no user is found
  return user;
}

function createUser(user) {
  const existingUser = getUser(user.userName);
  if (!existingUser) {
    const hash = encryption.hashPassword(user.password)
    .then(hash => {
      userJson.push({
        userName: user.userName,
        passwordHash: hash,
        starredRecipes: []
      });
    });
  } else {
    // throw error if user already exists, handle this later
    return Promise.reject(new Error(`User with userName ${user.userName} already exists`));
  }
}

function authenticateUser(userName, password) {
  const existingUser = getUser(userName);
  if (existingUser) {
    return encryption.checkPassword(password, user.passwordHash);
  } else {
    // throw error if user already exists, handle this later
    return Promise.reject(new Error(`User with userName ${userName} does not exit`));
  }
}

function starRecipe(userName, recipeId) {
  const user = getUser(userName);
  if (!user) {
    return Promise.reject(Error(`User with userName: ${userName} did not exist`))
  } else {
    user.starredRecipes.push(recipeId);
    return Promise.resolve();
  }
}

module.exports = {
  getUser,
  createUser,
  starRecipe
};
