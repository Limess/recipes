'use strict';

// use flat files dir, can be changed per environment set by NODE_ENV to test with fixtures
const recipeRepository = require('../repositories/recipeRepository')
const userRepository = require('../repositories/userRepository')
// we use promises on this layer, could use generators throughout but it's an approach I'm used to
const Promise = require('bluebird');

// Get the recipe, throw a generic error if non-exist, would likely extend this error normally and
// handle it in the layer above depending on interpretation
function getRecipe(recipeId) {
  // No date processing to be done here so just return from repository
  return recipeRepository.getRecipe(recipeId);
}

function getRecipes() {
  // No date processing to be done here so just return
  const recipes = recipeRepository.getRecipes();
  return Promise.resolve(recipes);
}

function getStarredRecipesForUserName(userName) {
  let recipes = {};
  const user = userRepository.getUser(userName);
  if (!(user.starredRecipes && user.starredRecipes == {})) {
    recipes = recipeRepository.getRecipes();
    recipes = mapRecipeIdsToRecipes(recipes, user.starredRecipes)
  }
  return Promise.resolve(recipes);
}

function mapRecipeIdsToRecipes(recipes, recipeIds) {
  return recipeIds.map(function matchRecipes(recipeId) {
      // map each recipeId to a recipe object
      recipes.forEach((recipe, index, array) => {
        if (recipe.id === starredRecipeId) {
          // if matched remove the recipe from the recipes array
          recipes = array.splice(i, 1);
          return recipe;
        }
      });
      // in the case that the recipe doesn't exist for whatever reason
      return null;
    }).filter(function(recipeId) {
      return recipeId !== null
    });
}

module.exports = {
	getRecipe,
	getRecipes
};
