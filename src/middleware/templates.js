'use strict';

const path = require('path');
const jade = require('koa-jade');
const isDevelopment = process.env.NODE_ENV === 'development';

const templateDir = path.join(__dirname, '../views/templates');

module.exports = () =>
    // use jade middleware for templating
  jade.middleware({
    viewPath: templateDir,
    debug: isDevelopment,
    compileDebug: isDevelopment,
    pretty: isDevelopment,
    noCache: isDevelopment,
    // locals: global_locals_for_all_pages,
    basedir: templateDir,
    helperPath: []
  })

