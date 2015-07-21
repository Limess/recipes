'use strict';

const router = require('koa-router')();
const recipeService = require('./services/recipeService');
const userService = require('./services/userService');
const checkIfLoggedIn = require('./middleware/checkIfLoggedIn');

// Define routes, TODO: move recipes endpoints to separate /recipes controller
router
  .get('/', function* redirectToRecipes() {
    this.redirect('/recipes');
  })
  .get('/recipes/:recipeId', function* getRecipe(next) {
    try {
      const recipe = yield recipeService.getRecipe(this.state.userName, this.params.recipeId);
      yield this.render('recipe', {
        recipe,
        title: recipe.name
      });
    // log the not found, yield control up the chain (will result in 404 as error is caught)
    } catch(err) {
      this.status = 404;
      yield next;
    }
  })
  .get('/recipes/:recipeId/star',
    checkIfLoggedIn(),
    function* getRecipe() {
      yield userService.starRecipe(this.state.userName, this.params.recipeId);
      this.redirect('/profile');
    }
  )
  .get('/recipes/:recipeId/unstar',
    checkIfLoggedIn(),
    function* getRecipe() {
      yield userService.unStarRecipe(this.state.userName, this.params.recipeId);
      this.redirect('/profile');
    }
  )
  .get('/recipes', function* getRecipes(next) {
    function* renderRecipes(recipes) {
      yield this.render('recipes', {
        recipes,
        emptyMessage: 'Sorry, we currently have no recipes for you',
        title: 'All recipes'
      });
    }
    const recipes = yield recipeService.getRecipes();
    yield pageinateRecipes(this, recipes, renderRecipes, next);
  })
  .get('/recipes/starred',
    checkIfLoggedIn(),
    function* getStarredRecipes(next) {
      function* renderStarredRecipes(recipes) {
        yield this.render('recipes', {
          recipes,
          emptyMessage: 'Sorry, we currently have no recipes for you',
          title: 'All recipes'
        });
      }
      const recipes = yield recipeService.getStarredRecipesForUserName(this.request.body.user);
      yield pageinateRecipes(this, recipes, renderStarredRecipes, next);
    }
  )
  .get('/login',
    checkIfLoggedIn(),
    function* getLogin() {
      yield this.render('login', {
        title: 'Login'
      });
    }
  )
  .post('/login',
    function* loginUser() {
      let errorMessage;
      const body = this.request.body;
      if (body.userName && body.password) {
        try {
          const token = yield userService.authenticateUser(body.userName, body.password);
          this.cookies.set('authToken', token);
          this.cookies.set('userName', body.userName);

          const redirectCookieUrl = this.cookies.get('redirect');
          const redirectUrl = redirectCookieUrl || '/profile';

          return this.redirect(redirectUrl);
        } catch (err) {
          errorMessage = err.message;
        }
      } else {
        errorMessage = 'Username and Password required';
      }
      yield this.render('login', {
        errorMessage,
        success: false,
        title: 'Login'
      });
    }
  )
  .get('/register',
    checkIfLoggedIn(),
    function* getRegister() {
      yield this.render('register', {
        title: 'Register'
      });
    }
  )
  .post('/register',
    // TODO: sanitise input
    function* registerUser() {
      const body = this.request.body;
      try {
        if (!body.password) {
          throw new Error('Passwords is required');
        } else if (body.password !== body.passwordRepeat) {
          throw new Error('Passwords must match');
        } else if (!body.userName) {
          throw new Error('Username is required');
        }
        const token = yield userService.registerUser(body.userName, body.password);
        this.cookies.set('authToken', token);
        this.cookies.set('userName', body.userName);

        const redirectCookieUrl = this.cookies.get('redirect');
        const redirectUrl = redirectCookieUrl || '/profile';

        return this.redirect(redirectUrl);
      } catch(err) {
        yield this.render('register', {
          errorMessage: err.message,
          title: 'Register'
        });
      }
    }
  )
  .get('/profile',
    checkIfLoggedIn(),
    // Here we need to show starred recipes and user details (just name for now)
    function* getProfile() {
      const userName = this.state.userName;
      const userExists = yield userService.doesUserExist(userName);
      if (userExists) {
        const starredRecipes = yield recipeService.getStarredRecipesForUserName(userName);
        yield this.render('profile', {
          title: 'Profile',
          userName: userName,
          starredRecipes: starredRecipes
        });
      } else {
        // if the user doesn't exist we want to clean state and force the user to login
        this.cookies.set('authToken', '');
        this.cookies.set('userName', '');
        this.status = 403;
        return this.redirect('/login');
      }
    }
  )
  .get('/logout', function* logoutUser() {
    this.cookies.set('authToken', '');
    this.cookies.set('userName', '');
    return this.redirect('/');
  });


// shared helper for pageinated recipe pages
function pageinateRecipes(context, recipes, success, next) {
  if (recipes) {
    // calculate page numbers in batches of 10
    const isPageQuery = (context.query && !isNaN(context.query.page));
    const pageNumber = isPageQuery ? context.query.page : 1;

    if (recipes.length > ((pageNumber - 1) * 10)) {
      const pageRecipes = recipes.slice(pageNumber - 1, pageNumber + 9);
      // set page state so we can show pagination controls
      context.state.pageNumbers = Math.floor(recipes.length / 10) + 1;
      // we have to bind the callback to the koa context
      return success.call(context, pageRecipes);
    }
    context.status = 404;
    return next;
  } else {
    return success.call(context)
  }
}

module.exports = () => {
  router.allowedMethods();
  return router.routes();
};
