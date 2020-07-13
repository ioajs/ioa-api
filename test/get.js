'use strict';

const test = require('jmr');
const axios = require('axios');

test('get /', async t => {

   const { data } = await axios.get("/");

   t.deepEqual(data, 'hello ioa');

});

test('get /sms/:name/:sub', async t => {

   const { data } = await axios.get("/sms/sub/1232");

   t.deepEqual(data, {
      name: "sub",
      sub: "1232"
   })

});

test('get /user/:id', async t => {

   const { data } = await axios.get("user/666");

   t.deepEqual(data, { id: "666" });

});
