import api from '@ioa/api';

api.use(async function (ctx, next) {

   ctx.global = "global middleware";

   await next();

});

api.use(async function (ctx, next) {

   ctx.before = "before middleware";

   await next();

   // await next();

})
