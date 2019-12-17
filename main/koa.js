'use strict';

const Koa = require('koa');
const middleware = require('../lib/middleware.js');

const koa = new Koa();

koa.use(middleware);

koa.listen(8600);

console.log(`http server: http://localhost:8600`);

module.exports = koa;