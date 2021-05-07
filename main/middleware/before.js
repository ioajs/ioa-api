export default async function (ctx, next) {

   ctx.before = "before middleware";

   await next();
   
   // await next();

}