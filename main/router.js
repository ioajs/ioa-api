import ioa from 'ioa';
// import routerTree from '../lib/routerTree.js';

const app = ioa.app();

const { router, middleware } = app;
const { global, before } = middleware;

router.global(global);

router.before(before);

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
