'use strict';

const config = require('config');
const path = require('path');
const recipesDir = path.join(process.cwd(), config.get('dataDirectory'));
const recipesJson = require(recipesDir + '/recipes.json');
const Promise = require('bluebird');

function getRecipe(recipeId) {
	const recipe = recipesJson.recipes.find(recipe => recipe.id === recipeId);
  if(recipe) {
    console.log('got recipe: ' + JSON.stringify(recipe, null, 2));
    return Promise.resolve(recipe);
  } else {
    let message = `no recipe with recipeId: ${recipeId} exists`;
    console.log(message)
    return Promise.reject(new Error(message));
  }
}

function getRecipes() {
  let recipes = recipesJson.recipes;
  if (Object.keys(recipes).length === 0) {
    console.log('no recipes available');
    recipes = {};
  } else {
    console.log('got recipes: ' + JSON.stringify(recipes, null, 2));
  }
	return Promise.resolve(recipes);
}

module.exports = {
	getRecipe,
	getRecipes
};
