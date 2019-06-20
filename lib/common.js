'use strict';

module.exports = {
   SymbolWildcard: Symbol('*'), // 通配符Key
   SymbolName: Symbol('name'), // 参数名Key
   SymbolMiddleware: Symbol('middleware'), // 中间件Key
   routerTree: {}, // 路由字典树
   allQueue: [], // 所有中间件集合队列
   beforeMiddleware: [], // 全局中间件队列
   WebSocket: [], // webSocket类型路由path队列
}