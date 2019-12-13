'use strict';

const { router } = require('@app');
const common = require('../lib/common.js');

router.get('/', 'home.index');

router.get('/sms/a/b', 'home.sms');

router.get('/sms/:name/:sub', 'home.sms');

router.get('/login', 'home.login');

console.log(common.routerTree);
