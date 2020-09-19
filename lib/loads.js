'use strict';

const before = require('./addRouter.js');
const routerTree = require('./routerTree.js');

const { queueGroup, globalQueue } = routerTree;

module.exports = {
  "middleware": {
    "level": 30
  },
  "controller": {
    "level": 50,
    before,
    module(func) {
      if (func.prototype) {
        return new func();
      } else {
        return func;
      }
    }
  },
  "router": {
    "level": 80,
    after() {

      // 阻止钩子重复执行，否则会添加多个相同的全局中间件
      if (this.after.once) return;
      
      this.after.once = true;

      for (const list of queueGroup) {
        list.unshift(...globalQueue);
      }

    }
  }
};