'use strict';

const { router } = require('@app');
const common = require('../lib/common.js');

router.get('/', 'home.index');

router.get('/sms/:name/:sub', 'home.sms');

router.get('/login', 'home.login');

router.on('/login', 'home.login');

router.on('/sms', 'home.sms');

console.log(common.WebSocket)