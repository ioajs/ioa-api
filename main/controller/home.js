import api, { Get } from '@ioa/api';

api.get('/', function (ctx) {

  console.log(ctx.global)
  console.log(ctx.before)

  ctx.body = 'hello ioa';

});

// @Get('/xxx')
function sms(ctx) {

  ctx.body = ctx.params;

}

api.get('/sms/a/b', sms);
api.get('/sms/:name/:sub', sms);

api.post('/login', function (ctx) {

  const body = ctx.request.body;

  ctx.body = {
    type: 'login',
    body
  };

});
