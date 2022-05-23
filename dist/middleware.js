import { Router, symbolWildcard, symbolName, symbolMiddleware } from './Router.js';
export const routerTree = new Router();
const { tree } = routerTree;
/**
 * koa 路由参数解析、路由分发中间件
 * @param object ctx 请求上下文
 */
export default async function (ctx) {
    let iterative = tree[ctx.method];
    if (iterative === undefined) {
        if (ctx.method === 'OPTIONS') {
            const method = ctx.request.header["access-control-request-method"];
            iterative = tree[method];
            if (iterative) {
                ctx.status = 204;
                ctx.body = '';
            }
            else {
                ctx.status = 500;
                ctx.body = {
                    code: 1000,
                    error: `不支持"${method}"请求`
                };
            }
        }
        else {
            ctx.status = 500;
            ctx.body = {
                code: 1000,
                error: `不支持"${ctx.method}"请求`
            };
        }
        return;
    }
    ctx.params = {};
    if (ctx.path !== '/') {
        // 通过 path 路径查找中间件
        const pathArray = ctx.path.slice(1).split('/');
        for (const path of pathArray) {
            const item = iterative[path];
            if (item) {
                iterative = item;
            }
            // 当 path 不匹配时，尝试用通配符
            else if (iterative[symbolWildcard]) {
                iterative = iterative[symbolWildcard];
                ctx.params[iterative[symbolName]] = path;
            }
            else {
                return ctx.body = {
                    code: 1000,
                    error: 'Invalid request address, route match failed'
                };
            }
        }
    }
    if (iterative instanceof Object) {
        const middlewares = iterative[symbolMiddleware];
        if (middlewares) {
            const [entry] = middlewares;
            let index = 0;
            // 有锁 next() 递进器，防止重复调用
            await entry(ctx, async function next() {
                index++;
                const middleware = middlewares[index];
                if (middleware) {
                    let lock = false;
                    await middleware(ctx, () => {
                        if (lock === false) {
                            lock = true;
                            return next();
                        }
                        else {
                            throw new Error(`禁止在同一个中间件中多次重复调用 next()`);
                        }
                    });
                }
            });
        }
        else {
            ctx.body = {
                code: 1000,
                error: "请求地址无效，未匹配到路由"
            };
        }
    }
    else {
        ctx.body = {
            code: 1000,
            error: "请求地址无效，未匹配到路由"
        };
    }
}
