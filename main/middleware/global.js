export default async function (ctx, next) {

   ctx.global = "global middleware";

   await next();
   
   // await next();

}