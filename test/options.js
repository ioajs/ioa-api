'use strict';

const test = require('jmr');
const axios = require('axios');

test('options /', async t => {

   const { data } = await axios.options("/", {
      "headers": {
         "access-control-request-method": "GET"
      }
   });

   t.deepEqual(data, '');

});
