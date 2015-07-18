'use strict';

const router = require('koa-router')();
const jwt = require('jsonwebtoken');
const recipeService = require('./services/recipeService');
const userService = require('./services/userService');
const checkIfLoggedIn = require('./middleware/checkIfLoggedIn');

// Define routes, TODO: move recipes endpoints to separate /recipes controller
router
	.get('/', function* getHome() {
	  return this.render('home', false);
	})
	.get('/recipes/:recipeId', function* getRecipe(next) {
    try {
      const recipe = yield recipeService.getRecipe(this.params.recipeId);
			this.render('recipe', {
				recipe,
        title: recipe.name
			});
    // log the not found, yield control up the chain (will result in 404 as error is caught)
    } catch(err) {
      this.status = 404;
      console.log(err);
      yield next;
    }
	})
  .post('/recipes/:recipeId/star',
    checkIfLoggedIn(),
    function* getRecipe(next) {
      const recipe = yield recipeService.getRecipe(this.params.recipeId);
      this.body = {
        'success': true
      }
    }
  )
  .get('/recipes', function* getRecipes() {
    const recipes = yield recipeService.getRecipes();
    this.render('recipes', {
      recipes,
      emptyMessage: 'Sorry, we currently have no recipes for you',
      title: 'All recipes'
    });
  })
  .get('/recipes/starred',
    checkIfLoggedIn(),
    function* getStarredRecipes(next) {
      const recipes = yield recipeService.getStarredRecipes(this.request.body.user);
      this.render('recipes', {
        recipes,
        emptyMessage: 'Sorry, you don\'t currently have any starred recipes, get started by starring recipes you like',
        title: 'Starred Recipes'
      });
    }
  )
  .get('/login',
    checkIfLoggedIn(),
    function* getLogin() {
      this.render('login', {
        title: 'Login'
      });
    }
  )
  .post('/login',
    function* loginUser() {
      let errorMessage;
      if (this.request.body.userName && this.request.body.password) {
        if (userService.authenticateUser()) {
          const token = jwt.sign(user, config.get('jwtSecretKey'), {
            expiresInMinutes: 1440 // expires in 24 hours
          });
          const redirectCookieUrl = this.cookies.get('redirect');
          if (redirectCookieUrl) {
            return this.redirect(redirectCookieUrl);
          } else {
            return this.redirect('/profile');
          }
        } else {
          errorMessage =  "Username or Password was invalid, please try again";
        }
      } else {
        errorMessage = 'Username and Password required'
      }
      this.body = {
        errorMessage,
        success: false
      }
    }
  )
  .get('/register',
    checkIfLoggedIn(),
    function* getRegister() {
      this.render('register', {
        title: 'Register'
      });
    }
  )
  .post('/register',
    function* registerUser() {
      const body = this.request.body;
      if (body.password !== body.passwordRepeat) {
        return this.render('register', {
          errorMessage: 'Passwords must match'
        });
      } else if (!body.userName) {
        return this.render('register', {
          errorMessage: 'Username is required'
        });
      } else if (!body.password || !body.passwordRepeat) {
        return this.render('register', {
          errorMessage: 'Require matching passwords'
        });
      }

      try {
        const token = yield userService.registerUser({
          userName: body.userName,
          password: body.password
        });
        console.log(token);
        this.cookies.set('authToken', token);
        this.redirect('/');
      } catch(err) {
        this.render('register', {
          errorMessage: err.message
        });
      }
    }
  );

module.exports = function() {
	router.allowedMethods();
	return router.routes();
};
