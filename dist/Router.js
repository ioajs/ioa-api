export const symbolName = Symbol('name'); // 参数名 key
export const symbolWildcard = Symbol('*'); // 通配符 key
export const symbolMiddleware = Symbol('middleware'); // 中间件 key
export class Router {
    tree = {}; // 路由字典树
    /**
     * 添加路由索引
     * @param method 请求类型
     * @param path 请求路径
     * @param middlewares 中间件队列
     * @returns string[] 路由路径数组
     */
    add(method, path, ...middlewares) {
        // 中间件类型验证与替换
        for (const index in middlewares) {
            const middleware = middlewares[index];
            if (!(middleware instanceof Function)) {
                throw new Error("路由定义中间件必须为函数类型");
            }
        }
        const pathArray = path.split('/');
        if (pathArray[0] === '') {
            pathArray.shift();
        }
        if (pathArray[pathArray.length - 1] === '') {
            pathArray.pop();
        }
        // 对请求类型进行分组保存
        let iterative = this.tree[method];
        if (iterative === undefined) {
            this.tree[method] = {};
            iterative = this.tree[method];
        }
        // 将path路径转换为对应的对象索引tree
        for (const name of pathArray) {
            const [one, ...cname] = name;
            // 路由包含动态参数，提取并保存参数名
            if (one === ':') {
                if (!iterative[symbolWildcard]) {
                    iterative[symbolWildcard] = {};
                }
                iterative = iterative[symbolWildcard];
                iterative[symbolName] = cname.join('');
            }
            else {
                if (!iterative[name]) {
                    iterative[name] = {};
                }
                iterative = iterative[name];
            }
        }
        if (!iterative[symbolMiddleware]) {
            iterative[symbolMiddleware] = {};
        }
        iterative[symbolMiddleware] = middlewares;
        return pathArray;
    }
}
