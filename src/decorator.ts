import type { Middleware } from './types.js';
import router from './index.js';

export function Controller() {
  return function (controller: new () => void): void {
    new controller();
  }
}

/**
 * get router
 * @param path 
 * @param middlewares 
 * @returns 
 */
export function Get(path: string, ...middlewares: Middleware[]) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    router.get(path, ...middlewares, descriptor.value);
  }
}

/**
 * post router
 * @param path 
 * @param middlewares 
 * @returns 
 */
export function Post(path: string, ...middlewares: Middleware[]) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    router.post(path, ...middlewares, descriptor.value);
  }
}

/**
 * put router
 * @param path 
 * @param middlewares 
 * @returns 
 */
export function Put(path: string, ...middlewares: Middleware[]) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    router.put(path, ...middlewares, descriptor.value);
  }
}

/**
 * delete router
 * @param path 
 * @param middlewares 
 * @returns 
 */
export function Del(path: string, ...middlewares: Middleware[]) {
  return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
    router.del(path, ...middlewares, descriptor.value);
  }
}
