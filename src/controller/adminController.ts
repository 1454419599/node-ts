import { Context } from "koa";
import path from "path";

import viewinit from "../static/viewinit";
import MyType from '../units/myType';
import MyFun from "../units/myFun";
import StaticValue from '../static/staticValue';
import adminServer from "../server/adminServer";
import myJSON from "../units/myJSON";
import MyEnum from "../units/myEnum";

type myNext = MyType.myNext;
type myCtx = MyType.myCtx;
type mySession = MyType.mySession;

export default {
  all: async (ctx: myCtx, next: myNext) => {
    console.log(ctx.state.reqJson, ctx.url, ctx.method);
    console.log(ctx.session)
    if (!(ctx.session as mySession).info) {
      if (ctx.url !== '/login') {
        await ctx.redirect('/login');
      } else {
        await next();
      }
    } else {
      await next();
    }
  },
  /**
   * 
   * @api {POST} /logo 登录
   * @apiName 账号登录接口
   * @apiGroup Logo
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam {String} affiliatedUnit 所属公司
   * @apiParam {String} userName 账号
   * @apiParam {String} password 密码
   * 
   * @apiSuccess (200) {Boolean} code 成功状态
   * @apiSuccess (200) {String} msg 登录描述
   * @apiSuccess (200) {Object} [data] 登录成功后的账号信息
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *     "affiliatedUnit": "重庆铭贝科技有限公司",
   *     "userName": "admin",
   *     "password": "root",
   * }
   * 
   * 
   * @apiSuccessExample {type} Success-Response:
   * {
   *     "code": true,
   *     "msg": "欢迎登录admin",
   *     "data": {
   *        "ID": 1,
   *        "userName": "admin",
   *        "unitName": "重庆铭贝科技有限公司",
   *        "unitType": "",
   *        "role": "超级管理员",
   *        "affiliatedUnitID": 1,
   *        "unitTreeID": "1",
   *        "accountTreeID": "1"
   *      }
   * }
   * 
   * 
   */
  login: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let result: MyType.myMessage = myJSON.message();
      let info = (ctx.session as mySession).info;
      if (!info) {
        result = await adminServer.login(ctx.state.reqJson);
        if (result.code) {
          (ctx.session as MyType.mySession).info = result.data;
        }
      } else {
        result.msg = `当前登录用户${info.userName},请先退出再登录`
      }
      return result;
    }, "登录出错")
  },

  /**
   * 
   * @api {DELETE} /logOut 退出登录
   * @apiName 退出登录
   * @apiGroup Logo
   * @apiVersion  0.1.0
   * 
   * @apiSuccess (200) {Boolean} code 退出状态
   * @apiSuccess (200) {String} msg 描述信息
   * 
   * 
   * @apiSuccessExample {type} Success-Response:
   * {
   *     code: true,
   *     msg: "退出成功"
   * }
   * 
   * 
   */
  logOut: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let result: MyType.myMessage = myJSON.message();
      let info = (ctx.session as MyType.mySession).info;
      if (info) {
        delete (ctx.session as MyType.mySession).info;
        result.code = true;
        result.msg = "退出成功"
      } else {
        result.msg = "当前没有账号登录"
      }
      return result;
    })
  },

  /**
   * 
   * @api {PUT} /addAccunt 添加账号信息
   * @apiName 添加账号
   * @apiGroup ADD
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {Number} affiliatedUnitID 账号直属公司ID
   * @apiParam  {String} userName 账号名
   * @apiParam  {String} password 密码
   * @apiParam  {String} role 账号角色('超级管理员','高级管理员','经销商管理员','组机厂管理员','终端用户管理员','工程师','操作员','观察员','普通用户')
   * @apiParam  {String} [sex = 男] 性别（男,女）
   * @apiParam  {String} realName 真实姓名
   * @apiParam  {String} [extensionNumber] 分机号码
   * @apiParam  {File} [icon] 账号头像
   * 
   * @apiSuccess (200) {Boolean} code 添加账号是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *    affiliatedUnitID: 1,
   *    role: 高级管理员,
   *    userName: admin1,
   *    password: Aa1,
   *    sex: 女,
   *    realName: 小一,
   *    extensionNumber: 12454657878,
   *    icon: 头像图片
   * }
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
   *    code: true,
   *    msg: 添加账号成功
   * }
   * 
   * 
   */
  addAccount: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let icon = ctx.state.files.icon;
      let { affiliatedUnitID, role, userName } = json;
      let result: MyType.myMessage = myJSON.message();
      //保存头像
      json.icon = undefined;
      let iconPath: string = '';
      if (icon) {
        if (icon instanceof Array) {
          icon.forEach(item => {
            MyFun.deleteFile(item.path)
          })
        } else {
          let iconResult: any = await MyFun.saveFile(icon, StaticValue.iconSaveAbsolutePath, userName);
          if (iconResult.code) {
            json.icon = iconResult.msg.newName;
            iconPath = iconResult.msg.newPath;
          }
        }
      }

      //添加账号的逻辑判断
      let selectUnit = await adminServer.selectUnit({ ID: affiliatedUnitID }, ['unitName', 'unitType', 'adminAccountID', 'parentAdminAcountID']);
      //判断该公司是否存在
      if (selectUnit instanceof Array && selectUnit.length !== 0) {
        let { unitName, unitType, adminAccountID, parentAdminAcountID } = selectUnit[0];
        //获取添加账号是否是管理账号
        let isAdminAccount = myJSON.theOnlyAccount.find(item => `${item}` == MyEnum.accountType[role]) !== undefined;
        let selectAccount: any;
        //通过公司管理账号字段来获取公司的管理账号
        adminAccountID && (selectAccount = await adminServer.selectAccount({ ID: adminAccountID }, ['accountTreeID']));
        //判断公司管理账号是否存在
        let unitAdminAccountIsExist = selectAccount instanceof Array && selectAccount.length !== 0;

        if (unitAdminAccountIsExist || isAdminAccount) {
          let accountTreeID: string = '';
          if (unitAdminAccountIsExist) {
            accountTreeID = selectAccount[0].accountTreeID;
          } else {
            selectAccount = await adminServer.selectAccount({ ID: parentAdminAcountID }, ['accountTreeID']);
            if (selectAccount instanceof Array && selectAccount.length !== 0) {
              accountTreeID = selectAccount[0].accountTreeID;
            } else {
              result.msg = "请先添加该公司的直属上级公司的管理账号"
              return;
            }
          }
          //判断该登录账号是否有为该公司添加账号的权限
          if (new RegExp(info.accountTreeID).test(accountTreeID)) {
            //判断该公司是否支持该类型的账号
            if (myJSON.unitAddAccountType[MyEnum.unitType[unitType]].find(item => `${item}` == MyEnum.accountType[role]) !== undefined) {
              if (unitAdminAccountIsExist && isAdminAccount) {
                result.msg = `公司 ${unitName} 的管理账号已经存在`
              } else {
                json.accountTreeID = affiliatedUnitID == 1 ? info.accountTreeID : accountTreeID;
                result = await adminServer.addAccount(json);
              }
            } else {
              result.msg = `公司 ${unitName} 不支持添加该类型的账号`
            }
          } else {
            result.msg = `账号${info.userName}不能为公司${unitName}添加账号， 请使用公司${unitName}的上级管理账号为该公司添加账号`
          }
        } else {
          result.msg = `公司 ${unitName} 的管理账号不存在， 请先添加公司的管理账号`;
        }
      } else {
        result.msg = `该公司不存在, 请检查affiliatedUnitID字段`
      }
      if (!result.code) {
        MyFun.deleteFile(iconPath)
      }
      return result;
    }, "添加账号出错")
  },

  /**
   * 
   * @api {PUT} /addUnit 添加公司信息
   * @apiName 添加公司信息
   * @apiGroup ADD
   * @apiVersion  0.1.1
   * 
   * 
   * @apiParam  {Number} parentUnitID 添加公司的直属上级公司ID
   * @apiParam  {String} unitName 公司名
   * @apiParam  {String} unitType 公司类型(经销商, 装机厂, 终端)
   * @apiParam  {String} linkman 联系人
   * @apiParam  {String} TEL 联系电话
   * @apiParam  {String} [unitAddress] 单位地址
   * @apiParam  {String} [unitEmail] 电子邮箱
   * @apiParam  {String} [unitURL] 单位网址
   * @apiParam  {String} [remark] 备注
   * @apiParam  {File} [logo] 公司LOGO图片文件
   * 
   * @apiSuccess (200) {Boolean} code 添加公司是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *      parentUnitID : 1,
   *      unitName: 子公司,
   *      unitType: 经销商,
   *      linkman: 小一,
   *      TEL: 13866666666,
   *      unitAddress: 公司地址,
   *      unitEmail: 公司邮箱,
   *      unitURL: 公司网址,
   *      remark: 备注,
   *      logo: LOGO图片
   * }
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
   *      code : true,
   *      msg: "公司添加成功"
   * }
   * 
   * 
   */
  addUnit: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let { role, ID, unitTreeID } = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let logo = ctx.state.files.logo;
      let { parentUnitID, unitName, unitType } = json;
      let result: MyType.myMessage = myJSON.message();
      let logoPath: string = '';
      let roleInex = myJSON.allowAddRole.find(value => MyEnum.accountType[value] === role);
      json.logo = undefined;
      if (logo) {
        if (logo instanceof Array) {
          logo.forEach(item => {
            MyFun.deleteFile(item.path)
          })
        } else {
          let logoResult: any = await MyFun.saveFile(logo, StaticValue.logoSaveAbsolutePath, unitName);
          if (logoResult.code) {
            json.logo = logoResult.msg.newName;
            logoPath = logoResult.msg.newPath;
          }
        }
      }
      //判断该账号是否支持添加公司
      if (roleInex !== undefined) {
        //获取上级公司的相关信息
        let selectUnits = await adminServer.selectUnit({ ID: parentUnitID }, ['unitTreeID', 'adminAccountID', 'unitType']);
        //判断公司信息是否存在
        if (selectUnits instanceof Array && selectUnits.length !== 0) {
          if (role === MyEnum.accountType[1]) {
            unitTreeID = `${unitTreeID},${ID}`
          }
          //判断该账号是否能为该公司添加公司
          if (new RegExp(unitTreeID).test(selectUnits[0].unitTreeID) || (role == MyEnum.accountType[1] && parentUnitID == 1)) {
            //判断该公司是否支持添加该类型的公司
            let unitTypeIndex = MyEnum.unitType[selectUnits[0].unitType];
            if (myJSON.unitAddUnit[unitTypeIndex].find(item => `${item}` == MyEnum.unitType[unitType]) !== undefined) {
              json.parentAdminAcountID = parentUnitID == 1 ? ID : selectUnits[0].adminAccountID;
              // json.parentUnit = selectUnits[0].parentUnit;
              json.unitTreeID = parentUnitID == 1 ? unitTreeID : selectUnits[0].unitTreeID;
              if (json.parentAdminAcountID) {
                result = await adminServer.addUnit(json);
              } else {
                result.msg = "请先为上级公司添加管理账号"
              }
            } else {
              result.msg = "该公司不支持添加该类型的子公司"
            }
          } else {
            result.msg = "该账号不能为该公司添加子公司，请使用该公司的上级管理账号";
          }
        } else {
          result.msg = "该上级公司不存在"
        }
      } else {
        result.msg = "该账号不支持添加公司"
      }
      if (!result.code) {
        MyFun.deleteFile(logoPath);
      }
      return result;
    }, "添加公司出错");
  },

  /**
   * 
   * @api {GET} /getUnit 获取公司
   * @apiName 获取公司信息
   * @apiGroup GET
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {Number} [unitID] 公司ID,如果指定则查看该公司的直属下级公司
   * @apiParam  {string} [q] 用户搜索值
   * @apiParam  {Number} [page = 1] 显示页数
   * @apiParam  {Number} [length = 30] 单页显示条数
   * @apiParam  {Number} [desc = 0] 可选值（0,1），是否降序排列（1为降序，0为升序）
   * @apiParam  {String} [orderField] 排序所参照的字段，所选值取决于查询的字段
   * @apiParam  {Number} [fasttips = 1] 可选值（0,1），是否快速查询（1为快速查询，0为内置字段模糊查询）
   * @apiParam  {String} [field] 限制 q参数 的搜索字段，所取值受限于表字段
   * @apiParam  {String} [minDate] 创建公司的最小时间
   * @apiParam  {String} [maxDate] 创建公司的最大时间
   * 
   * @apiSuccess (200) {Boolean} code 查询公司是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * @apiSuccess (200) {json} data 信息
   * @apiSuccess (200) {Array} data.units 查询公司列表具体信息
   * @apiSuccess (200) {Number} data.count 查询公司列表总数
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *    unitID: 1,
   *    page: 1,
   *    length: 10,
   *    desc: 1,
   *    orderField: ID
   * }
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *    field: unitName,
   *    q: 铭贝科技,
   *    fasttips: 0,
   *    page: 1,
   *    length: 10,
   *    desc: 1,
   *    orderField: ID
   * }
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *    minDate: 2018/8/15 12:00:00,
   *    maxDate: 2018-8-16 13:37:39,
   *    page: 1,
   *    length: 10,
   *    desc: 1,
   *    orderField: ID
   * }
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "code": true,
   *    "msg": "unitID = 1 查询成功",
   *    "data": {
   *        "units": [
   *            {
   *                "ID": 2,
   *                "unitName": "aaa1",
   *                "unitType": "经销商",
   *                "linkman": "asd",
   *                "TEL": "2324",
   *                "unitEmail": "asd",
   *                "unitURL": "sdfg",
   *                "logo": "/logo/aaa1_8-19-2018_29333284864167153_sky_lanterns_by_wlop-d7b5nfg.jpg",
   *                "remark": "asddfsdf",
   *                "parentUnitID": 1,
   *                "unitTreeID": "1,2"
   *            },
   *            {
   *                "ID": 1,
   *                "unitName": "重庆铭贝科技有限公司",
   *                "unitType": "",
   *                "linkman": "余小勇",
   *                "TEL": "4006117011",
   *                "unitEmail": "unitEmail",
   *                "unitURL": "unitURL",
   *                "logo": "logo",
   *                "remark": "remark",
   *                "parentUnitID": 1,
   *                "unitTreeID": "1"
   *            }
   *        ],
   *        "count": 2
   *    }
   * }
   * 
   * 
   */
  getUnit: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let { unitID, q, minDate, maxDate } = json;
      let result: MyType.myMessage = myJSON.message();

      if ((unitID && typeof parseInt(unitID) === 'number' && !isNaN(parseInt(unitID))) || q || minDate || maxDate) {
        result = await adminServer.getUnit(json, info);
      } else {
        result.data = await adminServer.selectUnit({ ID: info.affiliatedUnitID }, myJSON.unitField);
        result.msg = "默认返回登录账号所属公司";
        result.code = true;
      }
      return result;
    })
  },

  /**
   * 
   * @api {GET} /getUnitLogoUrl 获取公司的LOGO
   * @apiName 获取公司的LOGO
   * @apiGroup GET
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {Number} [unitID] 公司ID
   * 
   * @apiSuccess (200) {Boolean} code 查询公司LOGO是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * @apiSuccess (200) {String} [data] LOGO URL
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *     unitID: 2
   * }
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "code": true,
   *     "msg": "查询成功",
   *     "data": "/logo/qqq2342_2018-8-17_12492779049707181_MainActivity.java"
   * }
   * 
   * 
   */
  getUnitLogoUrl: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;

      let result = await adminServer.getUnitLogoUrl(json, info);

      return result;
    })
  },

  /**
   * 
   * @api {GET} /getAccount 获取账号信息
   * @apiName 获取账号
   * @apiGroup GET
   * @apiVersion 0.1.0
   * 
   * 
   * @apiParam {Number} [unitID] 公司ID
   * @apiParam {String} [q] 用户搜索信息
   * @apiParam {Number} [page = 1] 页数
   * @apiParam {Number} [length = 30] 单页显示条目数
   * @apiParam {String} [orderField] 排序字段
   * @apiParam {Number} [desc = 0] 候选值（0,1），1为降序，0为升序
   * @apiParam {Number} [fasttips = 1] 候选值（0,1），是否快速查询，1为快速查询
   * @apiParam {String} [field] 当 q参数 存在时生效，限制q的搜索字段
   * @apiParam {String} [minDate] 创建账号的最小时间
   * @apiParam {String} [maxDate] 创建账号的最大时间
   * 
   * @apiSuccess (200) {Boolean} code 查询账号是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * @apiSuccess (200) {Objec} [data] code = true 时存在，账号信息对象
   * @apiSuccess (200) {Array} [data.accounts] data.accounts 账号信息数据
   * @apiSuccess (200) {Objec} [data.count] 账号信息数据总数
   * 
   * @apiParamExample {json} Request-Example:
   * {
   *    unitID: 1,
   *    page: 1,
   *    length: 10,
   *    orderField: ID,
   *    desc: 1
   * }
   * 
   * @apiParamExample {json} Request-Example:
   * {
   *    q: ppp,
   *    field: userName,
   *    fasttips: 0,
   *    page: 1,
   *    length: 10,
   *    orderField: ID,
   *    desc: 1
   * }
   * 
   * @apiParamExample {json} Request-Example:
   * {
   *    minDate: 2018/8/15 12:00:00,
   *    maxDate: 2018/8/16 12:00:00,
   *    page: 1,
   *    length: 10,
   *    orderField: ID,
   *    desc: 1
   * }
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
   *     "code": true,
   *     "msg": "unitID查询成功",
   *     "data": {
   *         "accounts": [
   *             {
   *                 "ID": 1,
   *                 "icon": "/usericon/favicon.ico",
   *                 "userName": "admin",
   *                 "role": "超级管理员",
   *                 "extensionNumber": "8001",
   *                 "sex": "男",
   *                 "realName": "Administrator",
   *                 "affiliatedUnitID": 1
   *             },
   *             {
   *                 "ID": 2,
   *                 "icon": "/usericon/admin1_8-19-2018_14104029341639146_sky_lanterns_by_wlop-d7b5nfg.jpg",
   *                 "userName": "admin1",
   *                 "role": "高级管理员",
   *                 "extensionNumber": "12454657878",
   *                 "sex": "女",
   *                 "realName": "小一",
   *                 "affiliatedUnitID": 1
   *             }
   *         ],
   *         "count": 2
   *     }
   * }
   * 
   */
  getAccount: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let { unitID, q, minDate, maxDate } = json;
      let result: MyType.myMessage = myJSON.message();

      if (q || unitID || minDate || maxDate) {
        result = await adminServer.getAccount(json, info);
      } else {
        result.data = await adminServer.selectAccount({ID: info.ID}, myJSON.accountField);
        result.code = true;
        result.msg = '查询成功'
      }

      return result;
    });
  },

  /**
   * 
   * @api {PUT} /updateUnit 更新公司信息
   * @apiName 更新公司
   * @apiGroup Update
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {Number} unitID 公司ID
   * @apiParam  {File} [logo] 公司LOGO图片文件
   * @apiParam  {String} [unitName] 公司名
   * @apiParam  {String} [unitType] 公司类型（经销商','装机厂','终端'）
   * @apiParam  {String} [linkman] 联系人
   * @apiParam  {String} [TEL] 联系电话
   * @apiParam  {String} [unitAddress] 单位地址
   * @apiParam  {String} [unitEmail] 电子邮箱
   * @apiParam  {String} [unitURL] 单位网址
   * @apiParam  {String} [remark] 备注
   * 
   * @apiSuccess (200) {Boolean} code 修改公司是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * @apiSuccess (200) {Object} [data] 数据库返回信息
   * 
   * @apiParamExample  {type} Request-Example:
   * {
   *    unitID: 2,
   *    unitName: 公司2
   * }
   * 
   * 
   * @apiSuccessExample {type} Success-Response:
   * {
   *    "code": true,
   *    "msg": "修改成功",
   *    "data": {
   *        "fieldCount": 0,
   *        "affectedRows": 1,
   *        "insertId": 0,
   *        "serverStatus": 2,
   *        "warningCount": 0,
   *        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
   *        "protocol41": true,
   *        "changedRows": 1
   *    }
   * }
   * 
   * 
   */
  updateUnit: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let logo = ctx.state.files.logo;
      let { unitID } = json;
      let result: MyType.myMessage = myJSON.message();
      let newLogoPath = undefined;

      if (logo && !(logo instanceof Array)) {
        let logoResult = await MyFun.saveFile(logo, StaticValue.logoSaveAbsolutePath, unitID);
        if ((logoResult as MyType.myMessage).code) {
          let msg = (logoResult as MyType.myMessage).msg;
          json.logo = `${StaticValue.logoSaveRelativePath}/${msg.newName}`;
          newLogoPath = msg.newPath;
        } else {
          json.logo = undefined;
        }
      } else {
        if (logo instanceof Array && logo.length !== 0) {
          logo.forEach(element => {
            MyFun.deleteFile(element.path)
          });
        }
        json.logo = undefined;
      }

      if (unitID) {
        result = await adminServer.updateUnit(json, info);
      } else {
        result.msg = "请指定修改公司的ID, 字段unitID"
      }

      if (newLogoPath && !result.code) {
        MyFun.deleteFile(newLogoPath);
      }
      return result;
    });
  },

  /**
   * 
   * @api {PUT} /updateAccount 更新账号信息
   * @apiName 更新账号信息
   * @apiGroup Update
   * @apiVersion  0.1.0
   * 
   * 
   * @apiParam  {String} [accountID] 账号ID，该参数不存在时修改登录账号
   * @apiParam  {File} [icon] 账号头像
   * @apiParam  {String} [userName] 账号名
   * @apiParam  {String} [role] 账户类型('高级管理员','经销商管理员','组机厂管理员','终端用户管理员','工程师','操作员','观察员','普通用户')
   * @apiParam  {String} [extensionNumber] 分机号码
   * @apiParam  {String} [sex] 性别
   * @apiParam  {String} [realName] 真实姓名
   * @apiParam  {String} [oldPassword] 旧密码
   * @apiParam  {String} [newPassword] 新密码
   * 
   * @apiSuccess (200) {Boolean} code 修改账号是否成功
   * @apiSuccess (200) {String} msg 描述信息
   * @apiSuccess (200) {Object} [data] 数据库返回信息
   * 
   * @apiParamExample  {json} Request-Example:
   * {
   *    accountID: 2,
   *    userName: userName2,
   *    sex: 女
   * }
   * 
   * 
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "code": true,
   *    "msg": "账号更新成功",
   *    "data": {
   *        "fieldCount": 0,
   *        "affectedRows": 1,
   *        "insertId": 0,
   *        "serverStatus": 2,
   *        "warningCount": 0,
   *        "message": "(Rows matched: 1  Changed: 1  Warnings: 0",
   *        "protocol41": true,
   *        "changedRows": 1
   *    }
   * }
   * 
   * 
   */
  updateAccount: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let icon = ctx.state.files.icon;
      let { accountID } = json;
      let result: MyType.myMessage = myJSON.message();
      let newIconPath = undefined;
      if (!accountID) {
        json.accountID = info.ID;
      }

      if (icon && !(icon instanceof Array)) {
        let iconResult = await MyFun.saveFile(icon, StaticValue.iconSaveAbsolutePath, json.accountID);
        let { code, msg } = iconResult as any;

        if (code) {
          let { newName, newPath } = msg;
          json.icon = `${StaticValue.iconSaverelativePath}/${newName}`;
          newIconPath = newPath;
        } else {
          json.icon = undefined;
        }

      } else {
        if (icon instanceof Array && icon.length !== 0) {
          icon.forEach(element => {
            MyFun.deleteFile(element.path)
          });
        }
        json.icon = undefined;
      }

      result = await adminServer.updateAccout(json, info);

      if (newIconPath && !result.code) {
        MyFun.deleteFile(newIconPath);
      }
      return result;
    });
  },

  transferUnit: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      
    });
  },

  api: async (ctx: myCtx) => {
    console.log('aa')
    await ctx.render('index.html', {});
  },

  getView: async (ctx: Context, next: myNext) => {
    let views = (ctx.state.staticFiles.exts as string[]).map(value => path.parse(value).name);
    let viewName = path.parse(ctx.params.viewName).name;
    let htmlName = views.find((value) => value === viewName);
    if (htmlName) {
      if (await MyFun.fileIsExist(`${StaticValue.html}/${htmlName}.ejs`)) {
        await ctx.render(htmlName, (viewinit as any)[viewName]);
      } else {
        await ctx.render(`${htmlName}.html`, (viewinit as any)[viewName]);
      }
    } else {
      await ctx.render("404", {});
    }
  },

  test: async (ctx: myCtx) => {
    await ctx.state.send.json({ code: false });
  }

}
