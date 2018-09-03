import MyFun from "../units/myFun";
import { MySql } from "../units/mySql";
import { MyDb } from "../units/dbInfo";
import MyEnum from "../units/myEnum";
import myJSON from "../units/myJSON";
import MyType from "../units/myType";

let deviceServer = {
  addDevice: async (json: any) => {
    return await MyFun.serverTryCatch(async () => {
      let result = myJSON.message();
      let fields: MyDb.DeviceDetailTableField = {
        DTUId: undefined,
        DTUModel: undefined,
        siteName: undefined,
        controllerModel: undefined,
        communicationNumber: undefined,
        registrationDate: undefined,
        licenseExpirationDate: undefined,
        uploadPhoto: undefined,
        controllerBrand: undefined,
        controllerType: undefined,
        operatorORengineer: undefined,
        licensePeriod: undefined,
        deviceStatus: undefined,
        other: undefined,
        unitModel: undefined,
        engineModel: undefined,
        speedControlType: undefined,
        speedControlBoardModel: undefined,
        pressureRegulatorType: undefined,
        manufacturer: undefined,
        electricGeneratorModel: undefined,
        actuatorType: undefined,
        fuelTankCapacity: undefined,
        reference: undefined,
        accessory: undefined,
        electronicFenceStatus: undefined,
        electronicFenceScope: undefined,
        createTime: undefined,
      }

      let kv = await MyFun.objFiltrate<MyDb.DeviceDetailTableField>(fields, json, { createTime: new Date().toLocaleString() });
      let mySql = new MySql<MyDb.DeviceDetailTableField>();

      await mySql.MultipleResultTransaction(async (query) => {
        let DTUIdResult: any = await query.multipleSelect({
          table: MyEnum.dbName[2],
          wherekv: {
            DTUId: kv.DTUId
          },
          fieldkv: [MyEnum.deviceDetailField[0]]
        });

        if (DTUIdResult instanceof Array && DTUIdResult.length !== 0) {
          result.msg = `DTU编号 ${kv.DTUId} 已存在`;
          return;
        }

        let insertDeviceResult: any = await query.multipleInsert({
          table: MyEnum.dbName[2],
          kv
        });

        if (insertDeviceResult.serverStatus == 2) {
          result.code = true;
          result.msg = "添加设备成功"
        } else {
          result.msg = "添加设备失败"
        }
        return;
      })

      return result;
    })
  },

  addDeviceMaintenance: async (json: any) => {
    return await MyFun.serverTryCatch(async () => {
      let result: MyType.myMessage = myJSON.message();

      let field: MyDb.DeviceMaintenanceTable = {
        DTU: undefined,
        controllerType: undefined,
        maintenanceOrganization: undefined,
        maintenancePersonnel: undefined,
        maintenanceCost: undefined,
        maintenanceTime: undefined,
        maintenanceContent: undefined,
        createTime: undefined,
      };
      let kv = await MyFun.objFiltrate<MyDb.DeviceMaintenanceTable>(field, json, { createTime: new Date().toLocaleString() });
      let mySql = new MySql<MyType.myDbFeild>();

      await mySql.MultipleResultTransaction(async (query) => {
        let deviceDtuResults = await query.multipleSelect({
          table: MyEnum.dbName[2],
          wherekv: {
            DTUId: kv.DTU
          },
          fieldkv: [MyEnum.deviceDetailField[0]],
          LIMIT: {start: 0, length: 1}
        });

        if (deviceDtuResults instanceof Array && deviceDtuResults.length !== 0) {
          let insertResult = await query.multipleInsert({
            table: MyEnum.dbName[3],
            kv
          });
          if ((insertResult as any).serverStatus == 2 && (insertResult as any).affectedRows != 0) {
            result.code = true;
            result.msg = '新增维修记录成功'
          }
        } else {
          result.msg = `未收录DTU = ${kv.DTU} 的设备，不能为你添加维修记录`
        }
      });
      return result;
    });
  },

  addDeviceUpkeep: async (json: any) => {
    return await MyFun.serverTryCatch(async () => {
      let result: MyType.myMessage = myJSON.message();
      let field: MyDb.DeviceUpkeepTableField = {
        DTU: undefined,
        controllerType: undefined,
        upkeepContent: undefined,
        upkeepCost: undefined,
        upkeepEstablishment: undefined,
        upkeepPersonnel: undefined,
        upkeepTime: undefined,
        nextUpkeepDate: undefined,
        createTime: undefined,
      };

      let kv = await MyFun.objFiltrate<MyDb.DeviceUpkeepTableField>(field, json, {createTime: new Date().toLocaleString()});
      let mySql = new MySql<MyType.myDbFeild>();

      await mySql.MultipleResultTransaction(async (query) => {
        let deviceDtuResults = await query.multipleSelect({
          table: MyEnum.dbName[2],
          wherekv: {
            DTUId: kv.DTU
          },
          fieldkv: [MyEnum.deviceDetailField[0]],
          LIMIT: {start: 0, length: 1}
        });

        if (deviceDtuResults instanceof Array && deviceDtuResults.length !== 0) {
          let insertResult = await query.multipleInsert({
            table: MyEnum.dbName[4],
            kv
          });
          if ((insertResult as any).serverStatus == 2 && (insertResult as any).affectedRows != 0) {
            result.code = true;
            result.msg = '新增 保养记录 成功';
          }
        } else {
          result.msg = `未收录DTU = ${kv.DTU} 的设备，不能为你添加 保养记录`;
        }
      });
      return result;
    })
  }
};

export default deviceServer;