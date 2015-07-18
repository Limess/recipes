'use strict';

const bodyParser = require('koa-body-parser');
const compress = require('koa-compress');
const logger = require('koa-logger');
const responseTime = require('koa-response-time');
const serve = require('koa-static');
const koa = require('koa');
const path = require('path');
const routes = require('./routes.js');
const catchNotFound = require('./middleware/catchNotFound');
const catchErrors = require('./middleware/catchErrors');
const templates = require('./middleware/templates');
const validateToken = require('./middleware/validateToken');
const app = module.exports = koa();

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// Add X-Response-Time headers to non-static content
app.use(responseTime());

// Request logger
app.use(logger());

// Compress responses
app.use(compress());

// Parse request bodies into this.request.body
app.use(bodyParser());

// Template configuration
app.use(templates());

// Not-found and internal server error handlers
app.use(catchNotFound());
app.use(catchErrors());

// Validate JWT token if it exists and add flag to context
app.use(validateToken());

// Define routes
app.use(routes());

function start() {
  const port = process.env.PORT || 5000;
  app.listen(port);
  console.log(`listening on port ${port}`);
}

// start the server automatically if app.js running through node
// else expose it on the module
if (!module.parent) {
  start();
}

module.exports = {
  start
};
