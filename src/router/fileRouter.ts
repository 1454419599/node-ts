import Router from 'koa-router';

import fileController from '../controller/fileController';

let fileRouter = new Router();

fileRouter.get('/download*', fileController.download);

fileRouter.post('/upload*', fileController.upload);

export default fileRouter;