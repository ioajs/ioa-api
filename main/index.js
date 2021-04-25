import ioa from 'ioa';
import loads from '../lib/loads.js';

const { app } = ioa;

app.loader({
  ...loads,
  "koa.js": {
    "level": 15
  }
});
