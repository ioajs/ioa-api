import test from 'jtm';
import axios from 'axios';

test('options /', async t => {

   const { data } = await axios.options("/", {
      "headers": {
         "access-control-request-method": "GET"
      }
   });

   t.deepEqual(data, '');

});
