'use strict';

const helper = require('./helper.js');
const routerTree = require('./routerTree.js');

const { getController } = helper;

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

  app.router = {
    get(path, ...middlewares) {
      const controller = getController(app, path, middlewares);
      routerTree.add(app, 'GET', path, middlewares, controller);
    },
    post(path, ...middlewares) {
      const controller = getController(app, path, middlewares);
      routerTree.add(app, 'POST', path, middlewares, controller);
    },
    put(path, ...middlewares) {
      const controller = getController(app, path, middlewares);
      routerTree.add(app, 'PUT', path, middlewares, controller);
    },
    delete(path, ...middlewares) {
      const controller = getController(app, path, middlewares);
      routerTree.add(app, 'DELETE', path, middlewares, controller);
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
            routerTree.add(app, type, path + params, middlewares, action);
          }
        }

      } else {

        throw new Error(`REST路由指定${controllerPath}控制器不存在`);

      }

    },
    /**
     * 添加组件级中间件
     * @param  {...any} parameter 
     */
    before(...parameter) {

      for (const item of parameter) {
        if (item instanceof Function) {
          app.$beforeMiddleware.push(item);
        } else {
          throw new Error(`前置中间件参数必须为函数类型`);
        }
      }

    },
    /**
     * 添加全局中间件
     * @param  {...any} parameter 
     */
    global(...parameter) {

      for (const item of parameter) {
        if (item instanceof Function) {
          routerTree.globalQueue.push(item);
        } else {
          throw new Error(`“${app.$name}”应用路由中注册全局中间件必须为函数类型`);
        }
      }

    },
  }

}