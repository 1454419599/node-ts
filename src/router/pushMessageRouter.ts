import Router from 'koa-router';
import pushMessageController from '../controller/pushMessageController';

let pushMessageRouter = new Router();

pushMessageRouter.get('/sendMail', pushMessageController.sendMail);

export default pushMessageRouter;