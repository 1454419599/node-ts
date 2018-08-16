import Router from "koa-router";

import adminController from "../controller/adminController";

let adminRouter: Router = new Router();

adminRouter.all('*', adminController.all);

adminRouter.post('addUnit', adminController.addUnit);

adminRouter.post('addAccount', adminController.addAccount);

adminRouter.get('getUnit', adminController.getUnit);

adminRouter.get('getUnitLogoUrl', adminController.getUnitLogoUrl);

adminRouter.get('getAccount', adminController.getAccount);

adminRouter.post('updateUnit', adminController.updateUnit);

adminRouter.post('login', adminController.login);

adminRouter.delete('logOut', adminController.logOut);

adminRouter.get(':viewName', adminController.getView);

export default adminRouter;