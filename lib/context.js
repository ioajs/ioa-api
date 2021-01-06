'use strict';

const consoln = require('consoln');

/**
 * koa路由参数解析、路由分发中间件
 * @param {Object} ctx 请求上下文
 */
module.exports = function (router) {

  const { tree, symbolWildcard, symbolName, symbolMiddleware } = router;

  return async function (ctx) {

    ctx.params = {};

    let iterative = tree[ctx.method];

    if (iterative === undefined) {

      if (ctx.method === 'OPTIONS') {

        const method = ctx.request.header["access-control-request-method"];

        iterative = tree[method];

        if (iterative) {

          ctx.status = 204;

        } else {

          ctx.status = 500;

          return ctx.body = {
            code: 1000,
            error: `不支持"${method}"请求`
          };

        }

      } else {

        ctx.status = 500;

        return ctx.body = {
          code: 1000,
          error: `不支持"${ctx.method}"请求`
        };

      }

    }

    // 通过path路径查找中间件
    const pathArray = ctx.path.split('/');

    if (pathArray[0] === '') {
      pathArray.shift();
    }

    if (pathArray[pathArray.length - 1] === '') {
      pathArray.pop();
    }

    for (const path of pathArray) {

      const item = iterative[path];

      if (item) {
        iterative = item;
      }

      // 当path不匹配时，尝试用通配符
      else if (iterative[symbolWildcard]) {
        iterative = iterative[symbolWildcard];
        ctx.params[iterative[symbolName]] = path;
      }

      else {
        return ctx.body = {
          code: 1000,
          error: '请求地址无效，未匹配到路由'
        };
      }

    }

    if (iterative instanceof Object) {

      const middlewares = iterative[symbolMiddleware];

      if (middlewares) {

        let index = -1;

        // 有锁next()递进器，防止重复调用
        async function next() {

          const item = middlewares[index + 1];

          if (item) {

            let lock = false;

            await item(ctx, async () => {

              if (lock === false) {
                lock = tree;
                index++;
                await next();
              } else {
                throw new Error(`同一个中间件中next()禁止多次重复调用`);
              }

            });

          }

        }

        await next().catch(error => {

          consoln.error(error);

          ctx.body = {
            code: 1000,
            error: error.message
          };

        });

      } else {

        ctx.body = {
          code: 1000,
          error: "请求地址无效，未匹配到路由"
        };

      }

    } else {

      ctx.body = {
        code: 1000,
        error: "请求地址无效，未匹配到路由"
      };

    }

  }

}