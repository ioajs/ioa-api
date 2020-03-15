'use strict';

const consoln = require('consoln');
const routerTree = require('./routerTree.js');

const { tree, SymbolWildcard, SymbolName, SymbolMiddleware } = routerTree;

/**
 * koa路由参数解析、路由分发中间件
 * @param {Object} ctx 请求上下文
 */
module.exports = async ctx => {

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

        ctx.body = {
          code: 1000,
          error: '资源不存在'
        }

        return;

      }

    } else {

      ctx.status = 500;

      ctx.body = {
        code: 1000,
        error: '资源不存在'
      }

      return;

    }

  }

  // 通过path路径查找中间件
  const [, ...pathArray] = ctx.path.split('/');

  for (const path of pathArray) {

    const item = iterative[path];

    if (item) {
      iterative = item;
    }

    // 当path不匹配时，尝试用通配符填充
    else if (iterative[SymbolWildcard]) {
      iterative = iterative[SymbolWildcard];
      ctx.params[iterative[SymbolName]] = path;
    }

    else {
      ctx.body = {
        code: 1000,
        error: '资源不存在'
      }
      return
    }

  }

  if (iterative instanceof Object) {

    const middlewares = iterative[SymbolMiddleware];

    if (middlewares) {

      let index = -1;

      // 含状态锁的next()递进器，防止重复调用
      async function next() {

        const item = middlewares[index + 1];

        if (item) {

          let lock = true;

          await item(ctx, async () => {

            if (lock) {
              lock = false;
              index++;
              await next();
            }

          })

        }

      }

      await next().catch(error => {

        consoln.error(error);

        ctx.body = {
          code: 1000,
          error: error.message
        }

      })

    } else {

      ctx.body = {
        code: 1000,
        error: "资源不存在"
      }

    }

  } else {

    ctx.body = {
      code: 1000,
      error: "资源不存在"
    }

  }

}