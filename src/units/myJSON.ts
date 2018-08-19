import MyEnum from "./myEnum";

interface IArray {
  [index: number]: Array<number>;
  [index: string]: Array<number>;
}
export default {
  DBName: "electricity",
  notLogin: { code: false, message: "请先登录" },
  message: () => { return { code: false, msg: '未初始化信息' } },

  //获取公司时默认查看的字段
  unitField: [MyEnum.unitBaseField[0], MyEnum.unitBaseField[1], MyEnum.unitBaseField[2], MyEnum.unitBaseField[3], MyEnum.unitBaseField[4],
    MyEnum.unitBaseField[6], MyEnum.unitBaseField[7], MyEnum.unitBaseField[8], MyEnum.unitBaseField[9], MyEnum.unitBaseField[10], MyEnum.unitBaseField[11]],

  //获取账号时默认查看的字段
  accountField: [MyEnum.accountInfoField[0], MyEnum.accountInfoField[1], MyEnum.accountInfoField[2], MyEnum.accountInfoField[4],
    MyEnum.accountInfoField[5], MyEnum.accountInfoField[6], MyEnum.accountInfoField[7], MyEnum.accountInfoField[8]],
  //允许添加公司及账号的角色
  allowAddRole: [
    MyEnum.accountType.超级管理员,
    MyEnum.accountType.高级管理员,
    MyEnum.accountType.经销商管理员,
    MyEnum.accountType.终端用户管理员,
    MyEnum.accountType.组机厂管理员
  ],

  //不同角色添加对应的公司类型
  roleAddUnitType: {
    [MyEnum.accountType.超级管理员]: [MyEnum.unitType.终端, MyEnum.unitType.经销商, MyEnum.unitType.装机厂],
    [MyEnum.accountType.高级管理员]: [MyEnum.unitType.终端, MyEnum.unitType.经销商, MyEnum.unitType.装机厂],
    [MyEnum.accountType.经销商管理员]: [MyEnum.unitType.经销商],
    [MyEnum.accountType.组机厂管理员]: [MyEnum.unitType.装机厂],
    [MyEnum.accountType.终端用户管理员]: [MyEnum.unitType.终端],
  } as IArray,

  //不同公司对应的子公司类型
  unitAddUnit: {
    [MyEnum.unitType.终端]: [MyEnum.unitType.终端],
    [MyEnum.unitType.经销商]: [MyEnum.unitType.经销商],
    [MyEnum.unitType.装机厂]: [MyEnum.unitType.装机厂],
    [MyEnum.unitType[""]]: [MyEnum.unitType.终端, MyEnum.unitType.经销商, MyEnum.unitType.装机厂]
  } as IArray,

  //每个单位的唯一账号类型
  theOnlyAccount: [
    MyEnum.accountType.终端用户管理员,
    MyEnum.accountType.经销商管理员,
    MyEnum.accountType.组机厂管理员
  ],

  //不同类型的公司添加对应的账号类型
  unitAddAccountType: {
    [MyEnum.unitType.终端]: [
      MyEnum.accountType.终端用户管理员,
      MyEnum.accountType.观察员,
      MyEnum.accountType.操作员,
      MyEnum.accountType.工程师,
      MyEnum.accountType.普通用户
    ],
    [MyEnum.unitType.经销商]: [
      MyEnum.accountType.经销商管理员,
      MyEnum.accountType.观察员,
      MyEnum.accountType.操作员,
      MyEnum.accountType.工程师,
      MyEnum.accountType.普通用户
    ],
    [MyEnum.unitType.装机厂]: [
      MyEnum.accountType.组机厂管理员,
      MyEnum.accountType.观察员,
      MyEnum.accountType.操作员,
      MyEnum.accountType.工程师,
      MyEnum.accountType.普通用户
    ],
    [MyEnum.unitType[""]]: [
      MyEnum.accountType.高级管理员,
      MyEnum.accountType.终端用户管理员,
      MyEnum.accountType.经销商管理员,
      MyEnum.accountType.组机厂管理员,
      MyEnum.accountType.观察员,
      MyEnum.accountType.操作员,
      MyEnum.accountType.工程师,
      MyEnum.accountType.普通用户
    ],
  } as IArray,
}
