import Router from "koa-router";

import adminController from "../controller/adminController";

let adminRouter: Router = new Router();

adminRouter.all('*', adminController.all);

adminRouter.post('login', adminController.login);

adminRouter.delete('logOut', adminController.logOut);

adminRouter.post('unit', adminController.addUnit);

adminRouter.post('account', adminController.addAccount);

adminRouter.get('unit', adminController.getUnit);
adminRouter.get('unit/:unitID', adminController.getUnit);

adminRouter.get('unitLogoUrl', adminController.getUnitLogoUrl);
adminRouter.get('unitLogoUrl/:unitID', adminController.getUnitLogoUrl);

adminRouter.get('account', adminController.getAccount);
adminRouter.get('account/:unitID', adminController.getAccount);

adminRouter.put('unit', adminController.updateUnit);

adminRouter.put('account', adminController.updateAccount);

adminRouter.put('packToTransfer', adminController.packToTransfer);

adminRouter.get('api', adminController.api);

adminRouter.get(':viewName', adminController.getView);

export default adminRouter;