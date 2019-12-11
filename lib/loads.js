'use strict';

const after = require('./after.js');
const common = require('./common.js');

const { allQueue, beforeMiddleware } = common;

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
      },
      after
   },
   "router": {
      "level": 80,
      after() {

         for (const list of allQueue) {
            list.unshift(...beforeMiddleware);
         }

         delete this.after; // 仅允许触发一次

      }
   }
};