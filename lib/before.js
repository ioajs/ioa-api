'use strict';

const ioa = require('ioa');
const common = require('./common.js');

const { SymbolWildcard, SymbolName, SymbolMiddleware } = common;
const { routerTree, beforeMiddleware, allQueue, Subscribe } = common;

ioa.beforeMiddleware = beforeMiddleware; // 全局中间件队列

// rest路由与controller命名约定
const Resources = {
   "index": {
      "type": 'GET',
      "params": ""
   },
   "details": {
      "type": 'GET',
      "params": "/:id"
   },
   "create": {
      "type": 'POST',
      "params": ""
   },
   "update": {
      "type": 'PUT',
      "params": "/:id"
   },
   "destroy": {
      "type": 'DELETE',
      "params": "/:id"
   }
}

/**
* 为app添加路由依赖
* @param {object} app 
*/
module.exports = function router({ root: app }) {

   app.$beforeMiddleware = [];

   /**
    * 根据path从middleware中提取controller
    * @param {String} path 路由路径
    * @param {Array} middlewares 包含多个中间件的数组
    */
   function getController(path, middlewares) {

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

   }

   /**
    * 创建路由查找树
    * @param {String} method 请求类型，GET、POST、PUT、DELETE、Subscribe
    * @param {String} path 路由路径
    * @param {Array} middlewares 包含多个中间件的数组
    * @param {Function} controller 控制器
    */
   function createTree(method, path, middlewares, controller) {

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

   app.router = {
      get(path, ...middlewares) {
         const controller = getController(path, middlewares);
         createTree('GET', path, middlewares, controller);
      },
      post(path, ...middlewares) {
         const controller = getController(path, middlewares);
         createTree('POST', path, middlewares, controller);
      },
      put(path, ...middlewares) {
         const controller = getController(path, middlewares);
         createTree('PUT', path, middlewares, controller);
      },
      delete(path, ...middlewares) {
         const controller = getController(path, middlewares);
         createTree('DELETE', path, middlewares, controller);
      },
      /**
       * Rest api
       * @param {String} path 
       * @param {...Function} middlewares 
       */
      resources(path, ...middlewares) {

         const controllerPath = middlewares.pop();
         const controllerPathArray = controllerPath.split('.');

         // 通过controllerPath迭代提取controller
         let controller = app.controller;
         for (const name of controllerPathArray) {
            const item = controller[name];
            if (item) {
               controller = item;
            } else {
               throw new Error(`RESTful路由指定${controllerPath}控制器不存在`);
            }
         }

         if (typeof controller === 'object') {

            for (const name in Resources) {
               const action = controller[name];
               if (action instanceof Function) {
                  const { type, params } = Resources[name];
                  createTree(type, path + params, middlewares, action);
               }
            }

         } else {

            throw new Error(`REST路由指定${controllerPath}控制器不存在`);

         }

      },
      /**
       * socket路由
       */
      on(path, ...middlewares) {

         Subscribe.push(path);
         const controller = getController(path, middlewares);
         createTree('Subscribe', path, middlewares, controller);

      },
      /**
       * 添加组件级中间件
       * @param  {...any} parameter 
       */
      befor(...parameter) {

         for (const item of parameter) {
            if (item) {
               app.$beforeMiddleware.push(item);
            }
         }

      },
      /**
       * 添加全局中间件
       * @param  {...any} parameter 
       */
      global(...parameter) {

         for (const item of parameter) {
            if (item) {
               ioa.beforeMiddleware.push(item);
            }
         }

      },
   }

}