'use strict';

/**
* 根据path从middleware中提取controller
* @param {Object} app 
* @param {String} path 路由路径
* @param {Array} middlewares 包含多个中间件的数组
*/
module.exports = function (app, path, middlewares) {

  const controller = middlewares.pop();

  if (typeof controller === 'string') {

    const controllerPathArray = controller.split('.');

    let iteration = app.controller;

    // 迭代提取controller
    for (const itemPath of controllerPathArray) {

      const item = iteration[itemPath];

      if (item) {

        iteration = item;

      } else {

        throw new Error(`${path}路由中未找到${controllerPath}控制器`);

      }

    }

    if (iteration instanceof Function) {

      return iteration;

    } else {

      throw new Error(`${path}路由中指定${controllerPath}控制器必须为函数类型`);

    }

  } else if (controller instanceof Function) {

    return controller;

  } else {

    throw new Error(`${path}路由中指定控制器必须为函数类型`);

  }

}