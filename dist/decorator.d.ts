import type { Middleware } from './types.js';
export declare function Controller(): (controller: new () => void) => void;
/**
 * get router
 * @param path
 * @param middlewares
 * @returns
 */
export declare function Get(path: string, ...middlewares: Middleware[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * post router
 * @param path
 * @param middlewares
 * @returns
 */
export declare function Post(path: string, ...middlewares: Middleware[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * put router
 * @param path
 * @param middlewares
 * @returns
 */
export declare function Put(path: string, ...middlewares: Middleware[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
/**
 * delete router
 * @param path
 * @param middlewares
 * @returns
 */
export declare function Del(path: string, ...middlewares: Middleware[]): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
