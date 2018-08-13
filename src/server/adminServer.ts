import { MySql } from './../units/mySql';
import MyFun from "../units/myFun";
import MyType from '../units/myType';
import MyEnum from '../units/myEnum';
import myMd5 from '../units/myMd5';
import { MyDb } from '../units/dbInfo';
import StaticValue from '../static/staticValue'
import myJSON from '../units/myJSON';

export default {
  login: async (json: any) => {
    return await MyFun.serverTryCatch(async () => {
      let { affiliatedUnit, userName, password } = json;
      let mySql = new MySql<MyType.myDbFeild>();
      let info: MyType.mySessionInfo;
      let result: MyType.myMessage = myJSON.message();
      result.msg = await mySql.multipleResult(async (query) => {
        let resultAccounts = await query.multipleSelect({
          table: MyEnum.dbName[1],
          wherekv: {
            userName
          },
          fieldkv: [
            MyEnum.accountInfoField[0], //ID
            MyEnum.accountInfoField[3], //password
            MyEnum.accountInfoField[4], //role
            MyEnum.accountInfoField[8], //affiliatedUnitID
            MyEnum.accountInfoField[9], //accountTreeID
          ]
        });
        let inputPassword = password;
        if (resultAccounts instanceof Array && resultAccounts.length !== 0) {
          let { ID, password, role, affiliatedUnitID, accountTreeID } = resultAccounts[0];
          if (await myMd5.getMd5(inputPassword) !== password) {
            return "密码错误";
          }

          let resultUnits = await query.multipleSelect({
            table: MyEnum.dbName[0],
            wherekv: {
              ID: affiliatedUnitID
            },
            fieldkv: [
              MyEnum.unitBaseField[1],  //unitName
              MyEnum.unitBaseField[2],  //unitType
              MyEnum.unitBaseField[12]  //unitTreeID
            ]
          });
          if (resultUnits instanceof Array && resultUnits.length !== 0) {
            let { unitName, unitType, unitTreeID } = resultUnits[0];
            if (unitName === affiliatedUnit) {
              info = {
                ID,
                userName,
                unitName,
                unitType,
                role,
                affiliatedUnitID,
                unitTreeID,
                accountTreeID
              }
              result.data = info;
              result.code = true;
              return `欢迎登录${userName}`
            } else {
              return "公司名错误";
            }
          }
        } else {
          return "该账号不存在"
        }
      });
      return result;
    })
  },

  selectAccount: async (wherekv: Object, fieldkv: Array<string>) => {
    return await MyFun.serverTryCatch(async () => {
      let mySql = new MySql<MyDb.UserInfoTableField>();
      return await mySql.select({
        table: MyEnum.dbName[1],
        wherekv,
        fieldkv
      })
    });
  },

  selectUnit: async (wherekv: Object, fieldkv: Array<string>) => {
    return await MyFun.serverTryCatch(async () => {
      let mySql = new MySql<MyDb.UnitBaseTableField>();
      return await mySql.select({
        table: MyEnum.dbName[0],
        wherekv,
        fieldkv
      })
    })
  },
  
  addAccount: async (json: any) => {
    return await MyFun.serverTryCatch(async () => {
      let mySql = new MySql<MyType.myDbFeild>();
      let { icon, userName, password, role, extensionNumber, sex, realName, affiliatedUnitID, accountTreeID } = json;
      let result: MyType.myMessage = myJSON.message();
      await mySql.MultipleResultTransaction(async (query) => {
        //通过userName查询账号数据表
        let selectAccountResults = await query.multipleSelect({
          table: MyEnum.dbName[1],
          wherekv: {
            userName
          },
          fieldkv: ['ID']
        })
        //判断userName是否存在
        if (selectAccountResults instanceof Array && selectAccountResults.length !== 0) {
          result.msg = `${userName} 用户名已存在`;
          return;
        }
        //判断密码是否符合规范并验证
        if (await MyFun.verifyPassword(password)) {
          password = await myMd5.getMd5(password);
        } else {
          result.msg = "密码必须包含大写字母、小写字母、及数字"
          return;
        }
        let insertAccountResult: any = await query.multipleInsert({
          table: MyEnum.dbName[1],
          kv: {
            icon: `${StaticValue.iconSaverelativePath}/${icon}`,
            userName,
            password,
            role,
            extensionNumber,
            sex,
            realName,
            affiliatedUnitID,
          }
        });

        if (insertAccountResult.serverStatus == 2) {
          let { insertId } = insertAccountResult;
          await query.multipleUpdate({
            table: MyEnum.dbName[1],
            wherekv: {
              ID: insertId
            },
            kv: {
              accountTreeID: `${accountTreeID},${insertId}`
            }
          });

          if (myJSON.theOnlyAccount.find(item => `${item}` == MyEnum.accountType[role]) !== undefined) {
            await query.multipleUpdate({
              table: MyEnum.dbName[0],
              wherekv: {
                ID: affiliatedUnitID
              },
              kv: {
                adminAccountID: insertId
              }
            })
          }
        } else {
          await query.multipleRollback();
        }
        result.code = true;
        result.msg = "添加账号成功"
        return;
      });
      return result;
    })
  },

  addUnit: async (json: any) => {
    return await MyFun.serverTryCatch(async () => {
      let { unitName, unitType, linkman, TEL, parentUnit, unitAddress, unitEmail, unitURL, remark, parentUnitID, unitTreeID, parentAdminAcountID, logo } = json;
      let result: MyType.myMessage = myJSON.message();
      let mySql = new MySql<MyType.myDbFeild>();
      try {
        await mySql.MultipleResultTransaction(async (query) => {
          let selectUnitResult = await query.multipleSelect({
            table: MyEnum.dbName[0],
            wherekv: {
              unitName
            }
          });
          if (selectUnitResult instanceof Array && selectUnitResult.length != 0) {
            result.msg = `公司名 ${unitName} 已存在`
            return;
          }
          let insertUnitResult: any = await query.multipleInsert({
            table: MyEnum.dbName[0],
            kv: {
              unitName,
              unitType,
              linkman,
              TEL,
              parentUnit,
              unitAddress,
              unitEmail,
              unitURL,
              logo: logo ? `${StaticValue.logoSaveRelativePath}/${logo}` : undefined,
              remark,
              parentUnitID,
              unitTreeID,
              parentAdminAcountID
            }
          });
          if (insertUnitResult.serverStatus == 2) {
            let inserId = insertUnitResult.insertId;
            await query.multipleUpdate({
              table: MyEnum.dbName[0],
              wherekv: {
                ID: inserId
              },
              kv: {
                unitTreeID: `${unitTreeID},${inserId}`
              }
            })
            result.code = true;
            result.msg = "公司添加成功"
          }
          return;
        });
      } catch (error) {
        MyFun.deleteFile(`${StaticValue.iconSaveAbsolutePath}/${logo}`)
        throw error;
      }
      return result;
    });
  }
}