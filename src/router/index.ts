import Koa from 'koa'
import Router from 'koa-router';

import adminRouter from "./adminRouter";

let router = new Router();

export default async (app: Koa) => {
  router.use('/', adminRouter.routes(), adminRouter.allowedMethods());

  app.use(router.routes()).use(router.allowedMethods());
}