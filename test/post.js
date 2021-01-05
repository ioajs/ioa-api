'use strict';

const test = require('jmr');
const axios = require('axios');

test('post /login', async t => {

   const body = { id: '666', kk: '888' };

   const { data } = await axios.post("login", body);

   t.deepEqual(data, {
      type: 'login',
      body
   });

});