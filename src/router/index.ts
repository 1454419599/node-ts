import Koa from 'koa'
import Router from 'koa-router';
import KoaWebsocket from 'koa-websocket';

import adminRouter from "./adminRouter";
import deviceRouter from './deviceRouter';
import pushMessageRouter from './pushMessageRouter';
import webSocketRouter from './webSocketRouter';
import fileRouter from './fileRouter';

let router = new Router();
let wsRouter = new Router();

export default async (app: KoaWebsocket.App) => {
  router.use('/', adminRouter.routes(), adminRouter.allowedMethods());
  
  router.use('/device', deviceRouter.routes(), deviceRouter.allowedMethods());

  router.use('/pushMessage', pushMessageRouter.routes(), pushMessageRouter.allowedMethods());

  router.use('/file', fileRouter.routes(), fileRouter.allowedMethods());

  wsRouter.use('/webSocket', webSocketRouter.routes(), webSocketRouter.allowedMethods());

  app.use(router.routes()).use(router.allowedMethods());

  app.ws.use(wsRouter.routes()).use(wsRouter.allowedMethods());
  
}
