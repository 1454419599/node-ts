import { MySql, SelectOptions, Where } from './../units/mySql';
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

  getUnitLogoUrl: async (json: any, info: MyType.mySessionInfo) => {
    return await MyFun.serverTryCatch(async () => {
      let { affiliatedUnitID } = info;
      let { unitID } = json;
      let flag = true;
      unitID = parseInt(unitID);
      if (typeof unitID !== 'number' || isNaN(unitID)) {
        unitID = affiliatedUnitID;
      }
      let mySql = new MySql<MyDb.UnitBaseTableField>();
      return await mySql.multipleResult(async (query) => {
        while (flag) {
          let option: SelectOptions<MyDb.UnitBaseTableField> = {
            table: MyEnum.dbName[0],
            wherekv: {
              ID: unitID
            },
            fieldkv: [MyEnum.unitBaseField[9], MyEnum.unitBaseField[11]]
          };

          let unitResult = await query.multipleSelect(option);

          if (unitResult instanceof Array && unitResult.length != 0) {
            let { logo, parentUnitID } = unitResult[0];
            if (logo) {
              flag = false;
              return logo;
            } else {
              unitID = parentUnitID;
            }
          } else {
            return 'unitID不存在';
          }
        }
      });
    })
  },

  getAccount: async (json: any, info: MyType.mySessionInfo) => {
    return await MyFun.serverTryCatch(async () => {
      let result: MyType.myMessage = myJSON.message();
      let { unitID, q, page, length, orderField, desc, fasttips, field } = json;
      let { ID, accountTreeID, unitTreeID, role } = info;
      let fieldkv = myJSON.accountField;

      page = parseInt(page);
      length = parseInt(length);
      desc = desc && desc == 1 ? true : false;
      unitID = parseInt(unitID);
      length = isNaN(length) || length <= 0 ? 30 : length;
      let start = isNaN(page) || page <= 1 ? 0 : (page - 1) * length;
      let isPrefix = fasttips && fasttips != 1 ? true : false;
      let ORDERarr: any = undefined;
      if (MyEnum.accountInfoField[orderField] !== undefined) {
        ORDERarr = [{ field: [orderField], DESC: desc }];
      }

      let LIMIT = { start, length };

      let mySql = new MySql<MyType.myDbFeild>();
      await mySql.multipleResult(async (query) => {
        if (!isNaN(unitID)) {
          let unitResults = await query.multipleSelect({
            table: MyEnum.dbName[0],
            wherekv: {
              ID: unitID
            },
            fieldkv: [MyEnum.unitBaseField[12]]
          });
          if (unitResults instanceof Array && unitResults.length !== 0) {
            let { unitTreeID } = unitResults[0];
            let wherekv;
            let where;
            if (unitID == 1 && MyEnum.accountType[1] == role) {
              // wherekv = {
              //   accountTreeID: `1,${ID}`
              // }
              where = `\`${MyEnum.accountInfoField[8]}\` = ${unitID} AND \`${MyEnum.accountInfoField[9]}\` LIKE '1,${ID}%'`;
            } else {
              wherekv = {
                affiliatedUnitID: unitID
              }
            }
            console.log(info.unitTreeID, unitTreeID)
            if (new RegExp(info.unitTreeID).test(unitTreeID)) {
              let option: SelectOptions<MyDb.UserInfoTableField> = {
                table: MyEnum.dbName[1],
                where,
                wherekv,
                fieldkv,
                LIMIT,
                ORDERarr,
              }
              let accountResults = await query.multipleSelect(option);
              delete option.fieldkv;
              delete option.LIMIT;
              delete option.ORDERarr;
              option.field = 'COUNT(`ID`) AS `count`';
              let countResult = await query.multipleSelect(option);
              if (countResult instanceof Array && countResult.length != 0) {
                countResult = countResult[0]
              } else {
                countResult = 0;
              }
              result.code = true;
              result.msg = "unitID查询成功"
              result.data = { accounts: accountResults, count: countResult };
            } else {
              result.msg = "该账号不支持查看该公司的账号,请使用该公司的上级管理账号"
            }
          } else {
            result.msg = `unitID = ${unitID}, 不存在该公司`
          }
        } else if (q) {

          let fields = [MyEnum.accountInfoField[2], MyEnum.accountInfoField[7]];
          if (MyEnum.accountInfoField[field] !== undefined) {
            fields = [field];
          }
          let options: SelectOptions<MyDb.UserInfoTableField>[] = [];
          let option: SelectOptions<MyDb.UserInfoTableField> = {
            table: MyEnum.dbName[1],
            fieldkv,
          }
          fields.forEach(value => {
            options.push(Object.assign({}, option, {
              where: {
                fields: {
                  [value]: q,
                  accountTreeID
                },
                isPrefix
              }
            }))
          });
          let accountResult = await query.multipleUnionSelect(options, false, {LIMIT, ORDERarr});
          let {sql} = await mySql.unionSelectSql(options);
          sql = `SELECT COUNT(*) AS \`count\` FROM (${sql}) a`;
          let countResult = await mySql.query(query.conn, sql, []);
          if (countResult instanceof Array && countResult.length !== 0) {
            countResult = countResult[0];
          } else {
            countResult = 0;
          }
          result.code = true;
          result.data = {accounts: accountResult, count: countResult};
          result.msg = `q = ${q}, 查询成功`
        }
      });
      return result;
    });
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
  },

  getUnit: async (json: any, session: MyType.mySessionInfo) => {
    return await MyFun.serverTryCatch(async () => {
      let { unitID, q, page, length, desc, orderField, fasttips, field } = json;
      let { unitTreeID, role, ID } = session;
      let table = MyEnum.dbName[0];
      let fieldkv = myJSON.unitField;
      let result: MyType.myMessage = myJSON.message();

      unitID = parseInt(unitID);
      page = parseInt(page);
      length = parseInt(length);

      if (field && MyEnum.unitBaseField[field] === undefined) {
        field = undefined
      }
      desc = desc == 1 ? true : false;
      let isPrefix = fasttips == 1 ? false : true;

      length = typeof length === 'number' && length > 0 ? length : 30;
      let start = typeof page === 'number' && page > 0 ? (page - 1) * length : 0;

      let LIMIT = {
        start,
        length
      };
      let ORDERarr: any;
      if (MyEnum.unitBaseField[orderField] !== undefined) {
        ORDERarr = orderField ? [{ field: [orderField], DESC: desc }] : undefined;
      } else {
        ORDERarr = undefined;
      }
      let mySql = new MySql<MyDb.UnitBaseTableField>();
      await mySql.multipleResult(async (query) => {
        if (typeof unitID === 'number' && !isNaN(unitID)) {
          let selectResult = await query.multipleSelect({
            table,
            wherekv: {
              ID: unitID
            },
            fieldkv: [MyEnum.unitBaseField[12]]
          });
          if (selectResult instanceof Array && selectResult.length !== 0) {
            let parentUnitTreeID = selectResult[0].unitTreeID;
            if (new RegExp(unitTreeID).test(parentUnitTreeID) || unitID == 1) {
              let wherekv: MyDb.UnitBaseTableField = unitID == 1 && role == MyEnum.accountType[1] ? { parentAdminAcountID: ID } : { parentUnitID: unitID };
              let options: SelectOptions<MyDb.UnitBaseTableField> = {
                table,
                wherekv,
                fieldkv,
                LIMIT,
                ORDERarr
              }
              let unitResults = await query.multipleSelect(options);
              delete options.fieldkv;
              delete options.LIMIT;
              delete options.ORDERarr;
              options.field = 'COUNT(`ID`) AS `count`';
              let unitCount = await query.multipleSelect(options);
              if (unitCount instanceof Array && unitCount.length !== 0) {
                unitCount = unitCount[0].count;
              } else {
                unitCount = 0
              }
              result.code = true;
              result.data = { units: unitResults, count: unitCount };
              result.msg = `unitID = ${unitID} 查询成功`
            } else {
              result.msg = "该账号不能查看该公司的子公司，请使用该公司的上级管理账号查看"
            }
          } else {
            result.msg = "未找到公司，请检查unitID";
            return;
          }
        } else if (q) {
          let option: SelectOptions<MyDb.UnitBaseTableField> = {
            table,
            fieldkv,
          }
          let options: SelectOptions<MyDb.UnitBaseTableField>[] = [];
          let fields: string[] = field ? [field] : [MyEnum.unitBaseField[1], MyEnum.unitBaseField[3]];
          fields.forEach(element => {
            options.push(Object.assign({}, option, {
              where: {
                fields: {
                  [element]: q,
                  unitTreeID
                },
                isPrefix
              }
            }))
          });

          let unitResults = await query.multipleUnionSelect(options, false, { LIMIT, ORDERarr });
          let sql = `SELECT COUNT(\`ID\`) AS count FROM (${(await mySql.unionSelectSql(options)).sql}) as a`
          let countResult = await mySql.query(query.conn, sql, []);
          if (countResult instanceof Array && countResult.length !== 0) {
            countResult = countResult[0].count;
          } else {
            countResult = 0;
          }
          result.code = true;
          result.msg = `${q}结果`
          result.data = { units: unitResults, count: countResult };
        }
      });
      return result;
    });
  }
}