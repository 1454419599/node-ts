import Router from "koa-router";

import adminController from "../controller/adminController";

let adminRouter: Router = new Router();

adminRouter.all('*', adminController.all);

adminRouter.post('addUnit', adminController.addUnit);

adminRouter.post('addAccount', adminController.addAccount);

adminRouter.get('getUnit', adminController.getUnit);

adminRouter.post('login', adminController.login);

adminRouter.delete('logOut', adminController.logOut);

adminRouter.get(':viewName', adminController.getView);

export default adminRouter;