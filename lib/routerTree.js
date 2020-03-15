'use strict';

const SymbolWildcard = Symbol('*'); // 通配符Key
const SymbolName = Symbol('name'); // 参数名Key
const SymbolMiddleware = Symbol('middleware'); // 中间件Key
const tree = {}; // 路由字典树
const queueGroup = []; // 所有中间件队列集合
const globalQueue = []; // 全局中间件队列

module.exports = {
  SymbolWildcard,
  SymbolName,
  SymbolMiddleware,
  tree,
  queueGroup,
  globalQueue,
  /**
   * 添加路由索引
   * @param {Object} app 应用容器
   * @param {String} method 请求类型
   * @param {String} path 请求路径
   * @param {Array} middlewares 中间件队列
   * @param {Function} controller 控制器
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

    const [, ...pathArray] = path.split('/');

    // 对请求类型进行分组保存
    let iterative = tree[method];

    if (iterative === undefined) {
      tree[method] = {};
      iterative = tree[method];
    }

    // 将path路径转换为对应的对象索引tree
    for (const name of pathArray) {

      const [one, ...cname] = name;

      // 路由包含动态参数，提取并保存参数名
      if (one === ':') {

        if (!iterative[SymbolWildcard]) {
          iterative[SymbolWildcard] = {};
        }

        iterative = iterative[SymbolWildcard];
        iterative[SymbolName] = cname.join('');

      } else {

        if (!iterative[name]) {
          iterative[name] = {};
        }

        iterative = iterative[name];

      }

    }

    if (!iterative[SymbolMiddleware]) {
      iterative[SymbolMiddleware] = {};
    }

    const list = [
      ...app.$beforeMiddleware,
      ...middlewares,
      controller
    ];

    queueGroup.push(list);

    iterative[SymbolMiddleware] = list;

  }
}