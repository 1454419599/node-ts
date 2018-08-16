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
        let selectUnits = await adminServer.selectUnit({ ID: parentUnitID }, ['parentUnit', 'unitTreeID', 'adminAccountID', 'unitType']);
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
              json.parentUnit = selectUnits[0].parentUnit;
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

  getUnit: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let { unitID, q } = json;
      let result: MyType.myMessage = myJSON.message();

      if ((unitID && typeof parseInt(unitID) === 'number') || q) {
        result = await adminServer.getUnit(json, info);
      } else {
        result.data = await adminServer.selectUnit({ ID: info.affiliatedUnitID }, myJSON.unitField);
        result.msg = "默认返回登录账号所属公司";
        result.code = true;
      }
      return result;
    })
  },

  getUnitLogoUrl: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;

      let result = await adminServer.getUnitLogoUrl(json, info);
      return result;
    })
  },

  getAccount: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let info = (ctx.session as MyType.mySession).info;
      let json = ctx.state.reqJson;
      let { unitID, q } = json;
      let result = myJSON.message();

      result = await adminServer.getAccount(json, info);

      return result;
    });
  },

  updateUnit: async (ctx: myCtx) => {

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
