import Vue from 'vue';
import Router from 'vue-router';
import { checkPasswordMw, checkGuestMw, validateRequestIdMw } from '@/router/middlewares';
import { middlewarePipeline } from './middleware.pipeline.js';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/:id',
      name: 'home',
      component: () => import('@/modules/home/Home'),
      meta: {
        middleware: [
          validateRequestIdMw,
          checkPasswordMw
        ]
      }
    },
    {
      path: '/:id/password',
      name: 'password',
      component: () => import('@/modules/password/Password'),
      meta: {
        middleware: [
          validateRequestIdMw,
          checkGuestMw
        ]
      }
    }
  ]
});

router.beforeEach(async(to, from, next) => {
  if (!to.meta.middleware || !to.meta.middleware.length) {
    return next();
  }
  const middleware = to.meta.middleware;

  const context = {
    to,
    from,
    next,
    vueNext: next
  };

  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1)
  });
});

export default router;