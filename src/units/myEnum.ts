namespace MyEnum {
  export enum dbName { "unit_base_table", "account_info_table" };
  export enum accountInfoField { "ID", "icon", "userName", "password", "role", "extensionNumber", "sex", "realName", "affiliatedUnitID", "accountTreeID", "createTime", "lastChangeTime", "lastLoginTime" };
  export enum unitBaseField { "ID", "unitName", "unitType", "linkman", "TEL", "unitAddress", "unitEmail", "unitURL", "logo", "remark", "parentUnitID", "unitTreeID", "adminAccountID", "parentAdminAcountID", "createTime", "lastChangeTime" }
  export enum unitType { "经销商", "装机厂", "终端", ""};
  export enum accountType { "超级管理员", "高级管理员", "经销商管理员", "组机厂管理员", "终端用户管理员", "工程师", "操作员", "观察员", "普通用户" };
}

export default MyEnum;