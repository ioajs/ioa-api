'use strict';

module.exports = async function (ctx, next) {

   ctx.test = "test middleware";

   await next();
   
   // await next();

}