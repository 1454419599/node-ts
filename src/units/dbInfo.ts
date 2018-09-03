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

  export interface DeviceDetailTableField {
    ID?: number;
    DTUId?: string;
    DTUModel?: string;
    siteName?: string;
    controllerModel?: string;
    communicationNumber?: string;
    registrationDate?: string;
    licenseExpirationDate?: string;
    uploadPhoto?: string;
    controllerBrand?: string;
    controllerType?: string;
    operatorORengineer?: string;
    licensePeriod?: string;
    deviceStatus?: string;
    other?: string;
    unitModel?: string;
    engineModel?: string;
    speedControlType?: string;
    speedControlBoardModel?: string;
    pressureRegulatorType?: string;
    manufacturer?: string;
    electricGeneratorModel?: string;
    actuatorType?: string;
    fuelTankCapacity?: string;
    reference?: string;
    accessory?: string;
    electronicFenceStatus?: string;
    electronicFenceScope?: string;
    createTime?: string;
  }

  export interface DeviceMaintenanceTable {
    ID?: number;
    DTU?: string;
    controllerType?: string;
    maintenanceOrganization?: string;
    maintenancePersonnel?: string;
    maintenanceCost?: string;
    maintenanceTime?: string;
    maintenanceContent?: string;
    createTime?: string;
  }
  
  export interface DeviceUpkeepTableField {
    ID?: number;
    DTU?: string;
    controllerType?: string;
    upkeepPersonnel?: string;
    upkeepEstablishment?: string;
    upkeepCost?: string;
    upkeepTime?: string;
    nextUpkeepDate?: string;
    upkeepContent?: string;
    createTime?: string;
  }
}
