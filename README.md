# 

Recipes example project.

Stack:
  * Koa.js
  * File reads/writes backend (allows testing without DB tools etc)
  * Docker container with IOJS
  * ES6 using babel-node binary 
  * JWT authentication

Didn't have time for tests (There wasn't too much complicated logic, bit embarassed about it however) but I would have expected to use [rewire](https://github.com/jhnns/rewire) + [mocha](http://mochajs.org/) + [shinon](http://sinonjs.org/).
All logic is done on the server, I'd have liked to do filtering on the client but ran out of time. Otherwise client side code would just be progressive enhancement
