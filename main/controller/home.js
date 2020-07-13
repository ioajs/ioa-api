'use strict';

module.exports = class {
  index(ctx) {
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