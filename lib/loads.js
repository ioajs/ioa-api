'use strict';

const before = require('./before.js');
const routerTree = require('./routerTree.js');

const { queueGroup, globalQueue } = routerTree;

module.exports = {
  "middleware": {
    "level": 30
  },
  "controller": {
    "level": 50,
    module(func) {
      if (func.prototype) {
        return new func();
      }
      return func;
    }
  },
  "router": {
    "level": 80,
    before,
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