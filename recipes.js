// base package at root level to start the application server
// this is used to allow relative paths to be resolved from the root dir
require("babel/register");
var app = require('./src/app.js')

app.start();
