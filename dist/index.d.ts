import type { Middleware } from './types.js';
export * from "./decorator.js";
export declare const globalMiddlewares: any[];
declare const _default: {
    /**
     * 添加全局中间件
     * @param middleware
     */
    use(middleware: Middleware): void;
    /**
     * get 请求
     * @param path 请求路径
     * @param middlewares 中间件队列
     */
    get(path: string, ...middlewares: Middleware[]): void;
    /**
     * post 请求
     * @param path 请求路径
     * @param middlewares 中间件队列
     */
    post(path: string, ...middlewares: Middleware[]): void;
    /**
     * put 请求
     * @param path 请求路径
     * @param middlewares 中间件队列
     */
    put(path: string, ...middlewares: Middleware[]): void;
    /**
     * delete 请求
     * @param path 请求路径
     * @param middlewares 中间件队列
     */
    del(path: string, ...middlewares: Middleware[]): void;
};
export default _default;
