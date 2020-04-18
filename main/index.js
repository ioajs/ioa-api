'use strict';

const app = require('@app');

const loads = require('../lib/loads.js');

app.loader({
  ...loads,
  "koa.js": {
    "level": 15
  }
});
