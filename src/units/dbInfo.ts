export namespace MyDb {
  export interface UserInfoTableField {
    ID?: number,
    icon?: string,
    userName?: string,
    password?: string,
    role?: string,
    extensionNumber?: string,
    sex?: string,
    realName?: string,
    affiliatedUnitID?: string | number,
    accountTreeID?: string,
    createTime?: string,
    lastLoginTime?: string,
    lastChangeTime?: string,
  }

  export interface UnitBaseTableField {
    ID?: number,
    unitName?: string,
    unitType?: string,
    linkman?: string,
    TEL?: string,
    parentUnit?: string,
    unitAddress?: string,
    unitEmail?: string,
    unitURL?: string,
    logo?: string,
    remark?: string,
    parentUnitID?: string | number,
    unitTreeID?: string,
    adminAccountID?: string,
    parentAdminAcountID?: string | number,
    createTime?: string,
    lastChangeTime?: string,
  }
}