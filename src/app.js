'use strict';

const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const koa = require('koa');
const path = require('path');
const routes = require('./routes.js');
const catchNotFound = require('./middleware/catchNotFound');
const catchErrors = require('./middleware/catchErrors');
const templates = require('./middleware/templates');
const app = module.exports = koa();

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Request logger
app.use(logger());

// Compress responses
app.use(compress());

// Template configuration
app.use(templates());

// Not-found and internal server error handlers
app.use(catchNotFound());
app.use(catchErrors());

// Define routes
app.use(routes());


function start() {
  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`listening on port ${port}`);
}

if (!module.parent) {
  start();
}

module.exports = {
  start
};
