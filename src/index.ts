import type { Middleware } from './types.js';
import { routerTree } from './middleware.js';
export * from "./decorator.js";

export const globalMiddlewares = []; // 全局中间件队列

export default {
  /**
   * 添加全局中间件
   * @param middleware 
   */
  use(middleware: Middleware) {

    if (middleware instanceof Function) {
      globalMiddlewares.push(middleware);
    } else {
      throw new Error("global routing middleware must be of function type");
    }

  },
  /**
   * get 请求
   * @param path 请求路径
   * @param middlewares 中间件队列
   */
  get(path: string, ...middlewares: Middleware[]) {
    routerTree.add('GET', path, ...globalMiddlewares, ...middlewares);
  },
  /**
   * post 请求
   * @param path 请求路径
   * @param middlewares 中间件队列
   */
  post(path: string, ...middlewares: Middleware[]) {
    routerTree.add('POST', path, ...globalMiddlewares, ...middlewares);
  },
  /**
   * put 请求
   * @param path 请求路径
   * @param middlewares 中间件队列
   */
  put(path: string, ...middlewares: Middleware[]) {
    routerTree.add('PUT', path, ...globalMiddlewares, ...middlewares);
  },
  /**
   * delete 请求
   * @param path 请求路径
   * @param middlewares 中间件队列
   */
  del(path: string, ...middlewares: Middleware[]) {
    routerTree.add('DELETE', path, ...globalMiddlewares, ...middlewares);
  },
};
