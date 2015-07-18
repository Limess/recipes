
module.exports = () =>
  function* checkIfLoggedIn(next) {
    const UNAUTHORISED = 401;

    const isRegister = this.request.url === '/register';
    const isLogin = this.request.url === '/login';

    if (this.isAuthorised && !isRegister && !isLogin) {
      yield next;
    } else if (this.isAuthorised && (isLogin || isRegister)) {
      this.redirect('/profile');
    } else if (isLogin || isRegister) {
      yield next;
    } else {
      this.status = UNAUTHORISED;
      this.redirect('/login');
    }
  }
