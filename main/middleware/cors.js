'use strict';

const cors = require('@koa/cors');

module.exports = cors({
   'origin': '*',
   'maxAge': 86400
});
