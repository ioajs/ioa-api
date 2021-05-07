export default class {
  index(ctx) {

    console.log(ctx.global)
    console.log(ctx.before)

    ctx.body = 'hello ioa';
    
  }
  sms(ctx) {

    ctx.body = ctx.params;

  }
  login(ctx) {

    const body = ctx.request.body;

    ctx.body = {
      type: 'login',
      body
    };

  }
};