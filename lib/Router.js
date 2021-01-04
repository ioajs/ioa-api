'use strict';

const symbolWildcard = Symbol('*'); // 通配符Key
const symbolName = Symbol('name'); // 参数名Key
const symbolMiddleware = Symbol('middleware'); // 中间件Key

module.exports = class {
  constructor() {

    this.symbolWildcard = symbolWildcard;
    this.symbolName = symbolName;
    this.symbolMiddleware = symbolMiddleware;
    this.queueGroup = []; // 所有中间件队列集合
    this.globalQueue = []; // 全局中间件队列
    this.tree = {}; // 路由字典树
    
  }
  /**
   * 添加路由索引
   * @param {Object} app 应用容器
   * @param {String} method 请求类型
   * @param {String} path 请求路径
   * @param {Array} middlewares 中间件队列
   * @param {Function} controller 控制器
   * @returns {Array} pathArray 路由路径数组
   */
  add(app, method, path, middlewares, controller) {

    const appMiddleware = app.middleware;

    // 中间件类型验证与替换
    for (const index in middlewares) {
      let middleware = middlewares[index];
      if (typeof middleware === 'string') {
        middleware = appMiddleware[middleware];
        middlewares[index] = middleware;
      }
      if (!(middleware instanceof Function)) {
        throw new Error(`路由指定中间件必须为函数类型`);
      }
    }

    // 控制器类型验证
    if (!(controller instanceof Function)) {
      throw new Error(`路由指定${path}控制器不存在`);
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

      } else {

        if (!iterative[name]) {
          iterative[name] = {};
        }

        iterative = iterative[name];

      }

    }

    if (!iterative[symbolMiddleware]) {
      iterative[symbolMiddleware] = {};
    }

    const list = [
      ...app.beforeMiddleware,
      ...middlewares,
      controller
    ];

    this.queueGroup.push(list);

    iterative[symbolMiddleware] = list;

    return pathArray;

  }
}