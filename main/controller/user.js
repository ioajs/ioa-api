import api from '@ioa/api';

api.get('/user/:id', function (ctx) {

   ctx.body = ctx.params;

});
