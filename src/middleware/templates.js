'use strict';

const path = require('path');
const views = require('koa-views');

const templateDir = path.join(__dirname, '../views/templates');

module.exports = () =>
    // use jade middleware for templating
  views(templateDir, {
    'default': 'jade'
  });
