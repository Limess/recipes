'use strict';

module.exports = () =>
  function* checkIfLoggedIn(next) {
    const UNAUTHORISED = 401;

    const isRegister = this.request.url === '/register';
    const isLogin = this.request.url === '/login';

    // if the user is authorised and they're not hitting a login page, return
    if (this.state.isAuthorised && this.state.userName && !isRegister && !isLogin) {
      yield next;
    // if they're authorised and hitting a login related page, redirect to profile
    // as they can't login twice
    } else if (this.state.isAuthorised && this.state.userName && (isLogin || isRegister)) {
      this.redirect('/profile');
    // if they're not authorised, let them hit login/register if they're requesting it
    } else if (isLogin || isRegister) {
      this.cookies.set('userName', '');
      this.cookies.set('authToken', '');
      yield next;
    // if they're not authorised, redirect the user to login
    } else {
      // set redirect cookie to original URL so the
      // user can be redirected after logging in
      this.cookies.set('userName', '');
      this.cookies.set('authToken', '');
      this.cookies.set('redirect', this.request.url);

      this.status = UNAUTHORISED;
      this.redirect('/login');
    }
  };
