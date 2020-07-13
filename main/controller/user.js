'use strict';

class User {
   index(ctx) {

      ctx.body = ctx.params;
      
   }
}

module.exports = User;