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
    module(obj) {

      if (obj === undefined) return;

      const prototype = obj.prototype;

      if (prototype) {

        const names = Object.getOwnPropertyNames(prototype);

        // 长度小于等于1时，为普通函数或class为空
        if (names.length <= 1) return obj;

        const instance = new obj();

        for (const name of names) {
          if (name === 'constructor') continue;
          instance[name] = instance[name].bind(instance);
        }

        return instance;

      } else {

        return obj;

      }

    }
  },
  "router.js": {
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