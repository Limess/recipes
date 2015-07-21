'use strict';

// use flat files dir, can be changed per environment set by NODE_ENV to test with fixtures
const recipeRepository = require('../repositories/recipeRepository');
const userRepository = require('../repositories/userRepository');
// we use promises on this layer, could use generators throughout but it's an approach I'm used to
const Promise = require('bluebird');

function getRecipe(userName, recipeId) {
  // need to add whether the recipe is starred so we can display the star button
  // accordingly
  function getUserOrNull() {
    return userRepository.getUser(userName)
    .then(user => user)
    .catch(() => null);
  }
  return Promise.join(
    getUserOrNull(),
    recipeRepository.getRecipe(recipeId),
    (user, recipe) => {
      if (user && user.starredRecipes && user.starredRecipes.length > 0) {
        const matchingRecipe = user.starredRecipes.find(starredRecipe =>
          starredRecipe === recipe.id
        );
        if (matchingRecipe) {
          recipe.isStarred = true;
        }
      }
      return recipe;
    });
}

function getRecipes() {
  // No date processing to be done here so just return
  return recipeRepository.getRecipes().then(recipes => {
    if (recipes.length > 0) {
      return recipes;
    }
    return null;
  });
}

function getStarredRecipesForUserName(userName) {
  return userRepository.getUser(userName).then(getStarredRecipesForUser);
}

function getStarredRecipesForUser(user) {
  if (user.starredRecipes && user.starredRecipes.length > 0) {
    return recipeRepository.getRecipes().then(recipes => {
      return getRecipesFromRecipeIds(recipes, user.starredRecipes);
    });
  }
  return null;
}

function getRecipesFromRecipeIds(recipes, recipeIds) {
  return recipeIds.map(function matchRecipes(recipeId) {
      // map each recipeId to a recipe object, otherwise returns undefined
      return recipes.find((recipe) => {
        return recipe.id === recipeId;
      });
    }).filter(function(recipeId) {
      return recipeId;
    });
}

module.exports = {
	getRecipe,
	getRecipes,
  getStarredRecipesForUserName
};
