import Router from 'koa-router';
import deviceController from '../controller/deviceController';

let deviceRouter = new Router();

deviceRouter.post('/deviceDetail', deviceController.addDeviceDetail);

deviceRouter.post('/deviceMaintenance', deviceController.addDeviceMaintenance);

deviceRouter.post('/deviceUpkeep', deviceController.addDeviceUpkeep);

export default deviceRouter;