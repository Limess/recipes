'use strict';

const router = require('koa-router')();
const recipeService = require('./services/recipeService');

router
	.get('/', function* getHome() {
	  console.log('Got root');
	  return this.render('home', false);
	})
	.get('/recipes', function* getRecipes() {
    const recipes = yield recipeService.getRecipes();
    console.log(recipes);
    this.render('recipes', {
      recipes
    });
	})
	.get('/recipes/:recipeId', function* getRecipe(next) {
    try {
      const recipe = yield recipeService.getRecipe(this.params.recipeId);
			this.render('recipe', {
				recipe
			});
    } catch(err) {
      console.log(err);
      yield next;
    }
	});

module.exports = function() {
	router.allowedMethods();
	return router.routes();
};
