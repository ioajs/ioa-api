'use strict';

const SymbolWildcard = Symbol('*'); // 通配符Key
const SymbolName = Symbol('name'); // 参数名Key
const SymbolMiddleware = Symbol('middleware'); // 中间件Key
const routerTree = {}; // 路由字典树
const allQueue = []; // 所有中间件集合队列
const beforeMiddleware = []; // 全局中间件队列

module.exports = {
   SymbolWildcard,
   SymbolName,
   SymbolMiddleware,
   routerTree,
   allQueue,
   beforeMiddleware,
   /**
    * 根据path从middleware中提取controller
    * @param {Object} app
    * @param {String} path 路由路径
    * @param {Array} middlewares 包含多个中间件的数组
    */
   getController(app, path, middlewares) {

      const $controller = middlewares.pop();

      if (typeof $controller === 'string') {

         const controllerPath = $controller;

         const controllerPathArray = controllerPath.split('.');
         let iteration = app.controller;

         // 迭代提取controller
         for (const itemPath of controllerPathArray) {

            const item = iteration[itemPath];
            if (item) {
               iteration = item;
            } else {
               throw new Error(`${path}路由中未找到${controllerPath}控制器`)
            }

         }

         if (iteration instanceof Function) {

            return iteration;

         } else {

            throw new Error(`${path}路由中指定${controllerPath}控制器必须为函数类型`);

         }

      } else if ($controller instanceof Function) {

         return $controller;

      } else {

         throw new Error(`${path}路由中指定控制器必须为函数类型`);

      }

   },
   /**
    * 创建路由查找树
    * @param {Object} app
    * @param {String} method 请求类型，GET、POST、PUT、DELETE
    * @param {String} path 路由路径
    * @param {Array} middlewares 包含多个中间件的数组
    * @param {Function} controller 控制器
    */
   createTree (app, method, path, middlewares, controller) {

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
      let iterative = routerTree[method];
   
      if (iterative === undefined) {
         routerTree[method] = {};
         iterative = routerTree[method];
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
   
      allQueue.push(list);
   
      iterative[SymbolMiddleware] = list;
   
   }
}