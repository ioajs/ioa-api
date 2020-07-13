'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const middleware = require('../lib/middleware.js');

const koa = new Koa();

koa.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  extendTypes: { text: ['text/xml', 'application/xml'] }
}));

koa.use(middleware);

koa.listen(8600);

console.log(`http server: http://localhost:8600`);

module.exports = koa;