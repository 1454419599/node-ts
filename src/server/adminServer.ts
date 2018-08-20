import { MySql, SelectOptions, Where, UpdateOptions } from './../units/mySql';
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
              MyEnum.unitBaseField[11]  //unitTreeID
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
      let result: MyType.myMessage = myJSON.message();

      unitID = parseInt(unitID);
      if (typeof unitID !== 'number' || isNaN(unitID)) {
        unitID = affiliatedUnitID;
      }
      let mySql = new MySql<MyDb.UnitBaseTableField>();

      await mySql.multipleResult(async (query) => {
        while (flag) {
          let option: SelectOptions<MyDb.UnitBaseTableField> = {
            table: MyEnum.dbName[0],
            wherekv: {
              ID: unitID
            },
            fieldkv: [MyEnum.unitBaseField[8], MyEnum.unitBaseField[10]]
          };

          let unitResult = await query.multipleSelect(option);

          if (unitResult instanceof Array && unitResult.length != 0) {
            let { logo, parentUnitID } = unitResult[0];
            if (logo) {
              flag = false;
              result.code = true;
              result.msg = "查询成功";
              result.data = logo;
              return logo;
            } else {
              unitID = parentUnitID;
            }
          } else {
            result.msg = 'LOGO查询失败';
            return;
          }
        }
      });

      return result;
    })
  },

  getAccount: async (json: any, info: MyType.mySessionInfo) => {
    return await MyFun.serverTryCatch(async () => {
      let result: MyType.myMessage = myJSON.message();
      let { unitID, q, page, length, orderField, desc, fasttips, field, minDate, maxDate } = json;
      let { ID, accountTreeID, role } = info;
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
        if (q) {

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
          let accountResult = await query.multipleUnionSelect(options, false, { LIMIT, ORDERarr });
          let { sql } = await mySql.unionSelectSql(options);
          sql = `SELECT COUNT(*) AS \`count\` FROM (${sql}) a`;
          let countResult = await query.multipleQuery(sql, []);
          if (countResult instanceof Array && countResult.length !== 0) {
            countResult = countResult[0].count;
          } else {
            countResult = 0;
          }
          result.code = true;
          result.data = { accounts: accountResult, count: countResult };
          result.msg = `q = ${q}, 查询成功`
        } else if (unitID) {
          let unitResults = await query.multipleSelect({
            table: MyEnum.dbName[0],
            wherekv: {
              ID: unitID
            },
            fieldkv: [MyEnum.unitBaseField[11]]
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
                countResult = countResult[0].count
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
        } else if (minDate || maxDate) {
          let whereSql = ` \`createTime\` BETWEEN '${minDate ? minDate : new Date(0).toLocaleString()}' AND '${maxDate ? maxDate : new Date().toLocaleString()}' `;
          let option: SelectOptions<MyDb.UserInfoTableField> = {
            table: MyEnum.dbName[1],
            where: ` ${ await mySql.likeSql({
              accountTreeID
            })} AND (${whereSql})`,
            fieldkv,
            LIMIT,
            ORDERarr
          }
          let accountResults = await query.multipleSelect(option);
          delete option.fieldkv;
          delete option.LIMIT;
          delete option.ORDERarr;
          option.field = 'COUNT(`ID`) AS count';
          let countResult = await query.multipleSelect(option);

          if (countResult instanceof Array && countResult.length !== 0) {
            countResult = countResult[0].count;
          } else {
            countResult = 0;
          }

          result.code = true;
          result.data = { accounts: accountResults, count: countResult };
          result.msg = `${minDate} - ${maxDate}, 查询成功`
        }
      });
      return result;
    });
  },

  updateUnit: async (json: any, info: MyType.mySessionInfo) => {
    return await MyFun.serverTryCatch(async () => {
      let { unitID } = json;
      let result: MyType.myMessage = myJSON.message();

      unitID = parseInt(unitID);

      if (isNaN(unitID)) {
        result.msg = "请指定正确类型的unitID";
        return result;
      }

      let keyObj = {
        logo: undefined,
        unitName: undefined,
        unitType: undefined,
        linkman: undefined,
        TEL: undefined,
        unitAddress: undefined,
        unitEmail: undefined,
        unitURL: undefined,
        remark: undefined,
        lastChangeTime: undefined,
      }

      let obj = await MyFun.objFiltrate(keyObj, json, { lastChangeTime: new Date().toLocaleString() });
      console.log(obj);
      await MyFun.deleteObjNullOrundefined(obj);
      console.log(obj);

      let mySql = new MySql<MyDb.UnitBaseTableField>();
      await mySql.MultipleResultTransaction(async (query) => {
        let unitResult = await query.multipleSelect({
          table: MyEnum.dbName[0],
          wherekv: {
            ID: unitID
          },
          fieldkv: [MyEnum.unitBaseField[11], MyEnum.unitBaseField[10], MyEnum.unitBaseField[8]]
        });

        if (unitResult instanceof Array && unitResult.length !== 0) {
          let { logo, unitTreeID, parentUnitID } = unitResult[0];
          let infoUnitTreeID = info.unitTreeID;
          if (MyEnum.accountType[1] == info.role) {
            infoUnitTreeID = `${infoUnitTreeID},${info.ID}`
          }
          console.log(infoUnitTreeID, unitTreeID, new RegExp(infoUnitTreeID).test(unitTreeID))
          if (new RegExp(infoUnitTreeID).test(unitTreeID)) {
            let updateUnitType = (obj as MyDb.UnitBaseTableField).unitType
            if (updateUnitType) {
              let parentunitResult = await query.multipleSelect({
                table: MyEnum.dbName[0],
                wherekv: {
                  ID: parentUnitID
                },
                fieldkv: [MyEnum.unitBaseField[2]]
              });
              if (parentunitResult instanceof Array && parentunitResult.length !== 0) {
                let { unitType } = parentunitResult[0];
                console.log(unitType, myJSON.unitAddUnit[MyEnum.unitType[unitType]], updateUnitType)

                if (myJSON.unitAddUnit[MyEnum.unitType[unitType]].find(value => MyEnum.unitType[value] == updateUnitType) === undefined) {
                  result.msg = `unitType = ${updateUnitType}, 该公司不能修改为该类型的公司`;
                  return;
                }
              } else {
                throw `数据库数据错误 => unitID = ${unitID}, 错误字段 parentUnitID`
              }
            }

            let updateResult = await query.multipleUpdate({
              table: MyEnum.dbName[0],
              wherekv: {
                ID: unitID
              },
              kv: obj as MyDb.UnitBaseTableField
            });
            if ((updateResult as any).serverStatus == 2 && (updateResult as any).affectedRows > 0) {
              if ((obj as any).logo) {
                MyFun.deleteFile(`${StaticValue.publicPath}/${logo}`)
              }
              result.code = true;
              result.msg = "修改成功";
            }
            result.data = updateResult;
          } else {
            result.msg = `该账号没有修改该公司的权限，请使用该公司的上级管理账号修改公司信息`
          }
        } else {
          result.msg = `unitID = ${unitID} 公司不存在`
        }
      });
      return result;
    });
  },

  updateAccout: async (json: any, info: MyType.mySessionInfo) => {
    return await MyFun.serverTryCatch(async () => {
      let { accountID } = json;
      let result: MyType.myMessage = myJSON.message();
      let keyObj = {
        icon: undefined,
        userName: undefined,
        role: undefined,
        extensionNumber: undefined,
        sex: undefined,
        realName: undefined,
        lastChangeTime: undefined
      };

      let obj = await MyFun.objFiltrate(keyObj, json, { lastChangeTime: new Date().toLocaleString() });
      await MyFun.deleteObjNullOrundefined(obj);

      let mySql = new MySql<MyType.myDbFeild>();

      await mySql.MultipleResultTransaction(async (query) => {
        let accountResult = await query.multipleSelect({
          table: MyEnum.dbName[1],
          wherekv: {
            ID: accountID
          },
          fieldkv: [MyEnum.accountInfoField[1], MyEnum.accountInfoField[3], MyEnum.accountInfoField[9], MyEnum.accountInfoField[8], MyEnum.accountInfoField[4]]
        });

        if (accountResult instanceof Array && accountResult.length !== 0) {
          let { icon, password, accountTreeID, affiliatedUnitID, role } = accountResult[0];
          if (new RegExp(info.accountTreeID).test(accountTreeID)) {

            if (json.oldPassword && json.newPassword) {
              if (await myMd5.getMd5(json.oldPassword) == password) {
                obj.password = await myMd5.getMd5(json.newPassword);
              } else {
                result.msg = "旧密码不正确"
                return;
              }
            }

            if (obj.role) {
              if (accountID == info.ID) {
                result.msg = "不能修改账号自身的 role 字段, 请使用上级管理账号修改本账号的 role 字段"
                return;
              } else {
                let unitResult = await query.multipleSelect({
                  table: MyEnum.dbName[0],
                  wherekv: {
                    ID: affiliatedUnitID
                  },
                  fieldkv: [MyEnum.unitBaseField[2], MyEnum.unitBaseField[12]]
                })
                if (unitResult instanceof Array && unitResult.length !== 0) {
                  let { unitType, adminAccountID } = unitResult[0];
                  if (myJSON.unitAddAccountType[MyEnum.unitType[unitType]].find(value => MyEnum.accountType[value] == obj.role) === undefined) {
                    result.msg = "该账号所在公司不支持该类型的账号，请检查 role 字段";
                    return;
                  } else {
                    if ((myJSON.theOnlyAccount.find(value => MyEnum.accountType[value] == obj.role) !== undefined)) {
                      if (adminAccountID) {
                        result.msg = "管理账号已经存在";
                        return;
                      } else {
                        await query.multipleUpdate({
                          table: MyEnum.dbName[0],
                          wherekv: {
                            ID: affiliatedUnitID
                          },
                          kv: {
                            adminAccountID: accountID
                          }
                        })
                      }
                    } else {
                      if (myJSON.theOnlyAccount.find(value => MyEnum.accountType[value] == role) !== undefined) {
                        await query.multipleUpdate({
                          table: MyEnum.dbName[0],
                          wherekv: {
                            ID: affiliatedUnitID
                          },
                          kv: {
                            adminAccountID: undefined,
                            lastChangeTime: new Date().toLocaleString()
                          }
                        })
                      }
                    }
                  }
                }
              }
            }

            let updateResult = await query.multipleUpdate({
              table: MyEnum.dbName[1],
              wherekv: {
                ID: accountID
              },
              kv: obj as MyDb.UserInfoTableField
            });
            let { serverStatus, affectedRows } = updateResult as any;
            if (serverStatus == 2 && affectedRows > 0) {
              if (obj.icon) {
                MyFun.deleteFile(`${StaticValue.publicPath}/${icon}`)
              }
              result.code = true;
              result.msg = "账号更新成功"
            }
            result.data = updateResult

          } else {
            result.msg = "当前账号不支持修改该账号，请使用该账号或上级管理账号修改该账号信息"
          }
        } else {
          result.msg = `accountID = ${accountID}, 该账号不存在`
        }
      })
      return result;
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
      let { unitName, unitType, linkman, TEL, unitAddress, unitEmail, unitURL, remark, parentUnitID, unitTreeID, parentAdminAcountID, logo } = json;
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
      let { unitID, q, page, length, desc, orderField, fasttips, field, minDate, maxDate } = json;
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
            fieldkv: [MyEnum.unitBaseField[11]]
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
        } else if (minDate || maxDate) {
          let whereSql = `\`createTime\` BETWEEN '${minDate ? minDate : new Date(0).toLocaleString()}' AND '${maxDate ? maxDate : new Date().toLocaleString()}'`;
          let option: SelectOptions<MyDb.UnitBaseTableField> = {
            table: MyEnum.dbName[0],
            where: ` ${await mySql.likeSql({
              unitTreeID
            })} AND (${whereSql}) `,
            fieldkv,
            LIMIT,
            ORDERarr
          }
          let unitResults = await query.multipleSelect(option);
          delete option.fieldkv;
          option.field = 'COUNT (`ID`) AS count';
          delete option.LIMIT;
          delete option.ORDERarr;
          let countResult = await query.multipleSelect(option);

          if (countResult instanceof Array && countResult.length !== 0) {
            countResult = countResult[0].count;
          } else {
            countResult = 0;
          }
          result.code = true;
          result.msg = `${minDate} - ${maxDate} 结果`
          result.data = { units: unitResults, count: countResult };
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
          let countResult = await query.multipleQuery(sql, []);
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