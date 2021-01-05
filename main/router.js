'use strict';

const app = require('@app');
// const routerTree = require('../lib/routerTree.js');

const { router, middleware } = app;
const { test } = middleware;

router.global(test);

router.get('/', 'home.index');

router.get('/object', 'object.index');

router.get('/func', 'func');

router.get('/sms/a/b', 'home.sms');

router.get('/sms/:name/:sub', 'home.sms');

router.post('/login', 'home.login');

router.get('/user/:id', 'user.index');

// setTimeout(() => {

//    console.log(routerTree.tree.GET);
   
// }, 1000);
