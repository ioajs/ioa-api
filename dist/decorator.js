import router from './index.js';
export function Controller() {
    return function (controller) {
        new controller();
    };
}
/**
 * get router
 * @param path
 * @param middlewares
 * @returns
 */
export function Get(path, ...middlewares) {
    return function (target, propertyKey, descriptor) {
        router.get(path, ...middlewares, descriptor.value);
    };
}
/**
 * post router
 * @param path
 * @param middlewares
 * @returns
 */
export function Post(path, ...middlewares) {
    return function (target, propertyKey, descriptor) {
        router.post(path, ...middlewares, descriptor.value);
    };
}
/**
 * put router
 * @param path
 * @param middlewares
 * @returns
 */
export function Put(path, ...middlewares) {
    return function (target, propertyKey, descriptor) {
        router.put(path, ...middlewares, descriptor.value);
    };
}
/**
 * delete router
 * @param path
 * @param middlewares
 * @returns
 */
export function Del(path, ...middlewares) {
    return function (target, propertyKey, descriptor) {
        router.del(path, ...middlewares, descriptor.value);
    };
}
