import Router from 'koa-router';

import webSocketController from '../controller/webSocketController';

let webSocketRouter = new Router();

webSocketRouter.get('/systemMessage', webSocketController.systemMessage);

export default webSocketRouter;