'use strict';

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = () =>
  function* catchErrors(next) {
    try {
      // yield control up the chain
      yield next;
      // if anywhere in the chain an unhandled error occurs,
      // render the error template to the client
    } catch (error) {
      console.log('Got error: ' + error.stack);
      this.status = error.statusCode || 500;
      error.statusCode = this.status

      // only render the stack to the client in development (expensive operation + exposes code)
      // pretty prints the stack
      let stack = isDevelopment ? JSON.stringify(error.stack, null, 2) : undefined;
      error = {
        message: error.message,
        stack
      }

      return this.render('error', {
        title: 'Oops, something bad happened. Sorry about that.',
        error
      });
    }
  }

