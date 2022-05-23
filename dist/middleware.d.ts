import type { CTX } from './types.js';
import { Router } from './Router.js';
export declare const routerTree: Router;
/**
 * koa 路由参数解析、路由分发中间件
 * @param object ctx 请求上下文
 */
export default function (ctx: CTX): Promise<{
    code: number;
    error: string;
}>;
