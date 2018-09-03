import MyType from "../units/myType";
import { MyInterface } from "../units/myInterface";
import MyFun from '../units/myFun';;
import MyJson from '../units/myJSON';
import MyEnum from "../units/myEnum";
import deviceServer from '../server/deviceServer';
import myJSON from "../units/myJSON";
import StaticValue from '../static/staticValue';

type myCtx = MyType.myCtx;
type myNext = MyInterface.lext;

let deviceController = {
  addDeviceDetail: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let result = myJSON.message();
      let { uploadPhoto, accessory } = ctx.state.files;
      let { role } = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;

      if (uploadPhoto && uploadPhoto instanceof Array) {
        for (const iterator of uploadPhoto) {
          MyFun.deleteFile(iterator.path)
        }
        uploadPhoto = undefined;
      }

      if (accessory && accessory instanceof Array) {
        for (const iterator of accessory) {
          MyFun.deleteFile(iterator.path)
        }
        accessory = undefined;
      }

      let uploadPhotoPath = uploadPhoto ? uploadPhoto.path : undefined;
      let accessoryPath = accessory ? accessory.path : undefined;
      json.uploadPhoto = undefined;
      json.accessory = undefined;

      if (myJSON.addDeviceRole.find(value => MyEnum.accountType[value] == role) !== undefined) {
        if (uploadPhoto) {
          let uploadPhotoResult = await MyFun.saveFile(uploadPhoto, StaticValue.devicePhotoAbsolutePath);
          if ((uploadPhotoResult as any).code) {
            json.uploadPhoto = `${StaticValue.devicePhotoRelativePath}/${(uploadPhotoResult as any).msg.newName}`;
            uploadPhotoPath = (uploadPhotoResult as any).msg.newPath;
          }

          let accessoryResult = await MyFun.saveFile(accessory, StaticValue.devicePhotoAbsolutePath);
          if ((accessoryResult as any).code) {
            json.accessory = `${StaticValue.deviceAccessoryRelativePath}/${(accessoryResult as any).msg.newName}`;
            accessoryPath = (accessoryResult as any).msg.newPath;
          }
        }
        result = await deviceServer.addDevice(json);
      } else {
        result.msg = '该账号不支持添加设备，请使用拥有相关权限的账号'
      }
      if (!result.code) {
        uploadPhotoPath && MyFun.deleteFile(uploadPhotoPath);
        accessoryPath && MyFun.deleteFile(accessoryPath);
      }
      return result;
    });
  },

  addDeviceMaintenance: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let result = myJSON.message();
      let { role } = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;

      if (myJSON.addMaintenanceRole.find(value =>  MyEnum.accountType[value] == role ) !== undefined) {
        result = await deviceServer.addDeviceMaintenance(json);
      } else {
        result.msg = "该账号没有添加 维修记录 的权限"
      }
      return result;
    })
  },

  addDeviceUpkeep: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let result: MyType.myMessage = myJSON.message();
      let { role } = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;

      if (myJSON.addUpkeepRole.find(value =>  MyEnum.accountType[value] == role ) !== undefined) {
        result = await deviceServer.addDeviceUpkeep(json);
      } else {
        result.msg = "该账号没有添加 保养记录 的权限"
      }
      return result;
    });
  }
};

export default deviceController;