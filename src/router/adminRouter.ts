import Router from "koa-router";

import adminController from "../controller/adminController";

let adminRouter: Router = new Router();

adminRouter.all('*', adminController.all);

adminRouter.post('login', adminController.login);

adminRouter.delete('logOut', adminController.logOut);

adminRouter.put('addUnit', adminController.addUnit);

adminRouter.put('addAccount', adminController.addAccount);

adminRouter.get('getUnit', adminController.getUnit);

adminRouter.get('getUnitLogoUrl', adminController.getUnitLogoUrl);

adminRouter.get('getAccount', adminController.getAccount);

adminRouter.put('updateUnit', adminController.updateUnit);

adminRouter.put('updateAccount', adminController.updateAccount);

adminRouter.put('PackToTransfer', adminController.PackToTransfer);

adminRouter.get('api', adminController.api);

adminRouter.get(':viewName', adminController.getView);

export default adminRouter;