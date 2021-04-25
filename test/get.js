import test from 'jtm';
import axios from 'axios';

test('get /', async t => {

   const { data } = await axios.get("/");

   t.deepEqual(data, 'hello ioa');

});

test('get /object', async t => {

   const { data } = await axios.get("/object");

   t.deepEqual(data, 'object');

});


test('get /func', async t => {

   const { data } = await axios.get("/func");

   t.deepEqual(data, 'function');

});


test('get /sms/:name/:sub', async t => {

   const { data } = await axios.get("/sms/sub/1232");

   t.deepEqual(data, {
      name: "sub",
      sub: "1232"
   })

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
