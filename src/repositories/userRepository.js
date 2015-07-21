'use strict';

const Promise = require('bluebird');
const encryption = require('../utils/encryption');
let userJson = []; // left as let to make it clear that this is modified (contents are modified)

function getUser(userName) {
  return new Promise((resolve) => {
    const foundUser = userJson.find(user => user.userName === userName);
    if (!foundUser) {
      throw new Error(`No user with username: ${userName} exists`);
    } else {
      return resolve(foundUser);
    }
  });
}

function createUser(userName, password) {
  return getUser(userName).then(
    // RESOLVED: user already exists
    () => {
      throw new Error(`User with userName ${userName} already exists`);
    },
    // REJECTED: user doesn't exist
    () => {
      return encryption.hashPassword(password).then(hash => {
        const user = {
          userName: userName,
          passwordHash: hash,
          starredRecipes: []
        };
        userJson.push(user);
        return user;
      });
    });
}

function authenticateUser(userName, password) {
  return getUser(userName).catch(() => {
    // throw error if user already exists, handle this later
    throw new Error(`User with userName ${userName} does not exit`);
  }).then(existingUser => {
    if (encryption.checkPassword(password, existingUser.passwordHash)) {
      return existingUser;
    }
    throw new Error('Incorrect Password');
  });
}

function starRecipe(userName, recipeId) {
  return getUser(userName).then(existingUser => {
    if (!existingUser.starredRecipes.indexOf(recipeId) > -1) {
      // Add starred recipe
      existingUser.starredRecipes.push(recipeId);
    }
    return existingUser.starredRecipes;
  }).catch(() => {
    throw new Error(`User with userName: ${userName} did not exist`);
  });
}

function unStarRecipe(userName, recipeId) {
  return getUser(userName).then(existingUser => {
    const index = existingUser.starredRecipes.indexOf(recipeId);
    if (index > -1) {
      // Remove starred recipe
      existingUser.starredRecipes.splice(index, 1);
    }
    return existingUser.starredRecipes;
  }).catch(() => {
    throw new Error(`User with userName: ${userName} did not exist`);
  });
}

module.exports = {
  getUser,
  authenticateUser,
  createUser,
  starRecipe,
  unStarRecipe
};
