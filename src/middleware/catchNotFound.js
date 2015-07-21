'use strict';

module.exports = () =>
  function* catchNotFound(next) {
    // yield control up the chain
    yield next;
    // if the status code after control is returned is 404,
    // render the 404 template
    if (this.status !== 404) {
      return;
    }
    this.status = 404;

    const error = {
      message: 'Page Not found'
    };

    // re-use error template
    yield this.render('error', {
      title: 'Page Not Found',
      error: error
    });
  };
