'use strict';

// Data repository - here we just get data, return it to the service
// to be processed. If data doesn't exist and should exist we'll through an
// appropriate error (obviously this is just to save time here)

// Here we're just using raw json fixtures as datastores
// rather than implementing a database or external API to serve them

const Promise = require('bluebird');
const config = require('config');
const path = require('path');
// use flat files dir, can be changed per environment set by NODE_ENV to test with fixtures
const recipesDir = path.join(process.cwd(), config.get('dataDirectory'));
const recipesJson = require(recipesDir + '/recipes.json');

function getRecipes() {
  return new Promise((resolve) => {
    let recipes = recipesJson.recipes;
    if (recipes.length < 1) {
      recipes = [];
    } else {
      recipes.map(parseRecipe);
    }
    return resolve(recipes);
  });
}

function getRecipe(recipeId) {
  return new Promise((resolve) => {
    const matchedRecipe = recipesJson.recipes.find(recipe => recipe.id === recipeId);
    if (!matchedRecipe) {
      // No recipe existing can be regarded as an error as it would be expected
      const message = `no recipe with recipeId: ${recipeId} exists`;

      throw new Error(message);
    } else {
      const parsedRecipe = parseRecipe(matchedRecipe);

      return resolve(parsedRecipe);
    }
  });
}

function parseRecipe(recipe) {
  let preparationTime = recipe.preparationTime;
  if (preparationTime > 3600) {
    preparationTime = Math.floor(preparationTime / 3600) + ' hours';
  } else if (preparationTime > 60) {
    preparationTime = Math.floor(preparationTime / 60) + ' minutes';
  } else {
    preparationTime = preparationTime + ' seconds';
  }
  recipe.preparationTimeString = preparationTime;

  return recipe;
}

module.exports = {
  getRecipe,
  getRecipes
};
