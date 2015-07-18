'use strict';

// Data repository - here we just get data, return it to the service
// to be processed. If data doesn't exist and should exist we'll through an
// appropriate error

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
    if (Object.keys(recipes).length === 0) {
      console.log('no recipes available');
      recipes = {};
    } else {
      recipes.map(parseRecipe);
      console.log('got recipes: ' + JSON.stringify(recipes, null, 2));
    }
    return resolve(recipes);
  });
}

function getRecipe(recipeId) {
  return new Promise((resolve, reject) => {
    let recipe = recipesJson.recipes.find(recipe => recipe.id === recipeId);
    if (!recipe) {
      // No recipe existing can be regarded as an error as it would be expected
      // and should result in a 404
      let message = `no recipe with recipeId: ${recipeId} exists`;
      console.log(message)

      return reject(new Error(message));
    } else {
      recipe = parseRecipe(recipe);
      console.log('got recipe: ' + JSON.stringify(recipe, null, 2));

      return resolve(recipe);
    }
  });
}

function parseRecipe(recipe) {
  let preparationTime = recipe.preparationTime;
  if (preparationTime > 3600) {
    preparationTime = Math.floor(prepartionTime / 3600) + " hours"
  } else if (preparationTime > 60) {
    preparationTime = Math.floor(preparationTime / 60) + " minutes";
  } else {
    preparationTime = preparationTime + " seconds";
  }
  recipe.preparationTimeString = preparationTime;

  return recipe;
}

module.exports = {
  getRecipe,
  getRecipes
};
