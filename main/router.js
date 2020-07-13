'use strict';

const app = require('@app');
const routerTree = require('../lib/routerTree.js');

const { router, middleware } = app;
const { cors } = middleware;

router.global(cors);

router.get('/', 'home.index');

router.get('/sms/a/b', 'home.sms');

router.get('/sms/:name/:sub', 'home.sms');

router.get('/login', 'home.login');

setTimeout(() => {

   console.log(routerTree.tree.GET);
   
}, 1000);
