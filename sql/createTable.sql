CREATE TABLE IF NOT EXISTS `unit_base_table` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `unitName` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '单位名称',
  `unitType` enum('经销商','装机厂','终端','') CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '单位类型',
  `linkman` varchar(16) NOT NULL COMMENT '联系人',
  `TEL` varchar(11) NOT NULL COMMENT '联系电话',
  `unitAddress` varchar(128) DEFAULT NULL COMMENT '单位地址',
  `unitEmail` varchar(64) DEFAULT NULL COMMENT '电子邮箱',
  `unitURL` varchar(32) DEFAULT NULL COMMENT '单位网址',
  `logo` varchar(128) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'logo',
  `remark` text COMMENT '备注',
  `parentUnitID` int(11) unsigned DEFAULT NULL COMMENT '上级单位ID',
  `unitTreeID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '所有上级单位ID',
  `adminAccountID` int(11) unsigned DEFAULT NULL COMMENT '单位管理员账户ID',
  `parentAdminAcountID` int(11) unsigned DEFAULT NULL COMMENT '上级管理员账户ID',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `lastChangeTime` datetime DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unitName` (`unitName`) USING BTREE,
  KEY `ID` (`ID`),
  KEY `ID_2` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `account_info_table` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `icon` varchar(128) DEFAULT NULL COMMENT 'logo',
  `userName` varchar(64) NOT NULL COMMENT '用户名',
  `password` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `role` enum('超级管理员','高级管理员','经销商管理员','组机厂管理员','终端用户管理员','工程师','操作员','观察员','普通用户') NOT NULL DEFAULT '普通用户' COMMENT '所属角色',
  `extensionNumber` varchar(16) DEFAULT NULL COMMENT '分机号码',
  `sex` enum('男','女') NOT NULL DEFAULT '男' COMMENT '性别',
  `realName` varchar(16) NOT NULL COMMENT '真实姓名',
  `email` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT 'E-mail',
  `affiliatedUnitID` int(11) unsigned NOT NULL COMMENT '所属单位ID',
  `accountTreeID` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '所有上级账号ID',
  `createTime` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `lastChangeTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次更改时间',
  `lastLoginTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '最后一次登录时间',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `userName` (`userName`) USING BTREE,
  KEY `affiliatedUnitID` (`affiliatedUnitID`),
  KEY `realName` (`realName`) USING BTREE,
  KEY `extensionNumber` (`extensionNumber`) USING BTREE,
  CONSTRAINT `account_info_table_ibfk_1` FOREIGN KEY (`affiliatedUnitID`) REFERENCES `unit_base_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `device_detail_table` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `DTUId` varchar(32) NOT NULL COMMENT 'DTU编号',
  `DTUModel` varchar(16) DEFAULT NULL COMMENT 'DTU型号',
  `siteName` varchar(64) NOT NULL COMMENT '站点名称',
  `controllerModel` varchar(64) DEFAULT NULL COMMENT '控制器型号',
  `communicationNumber` varchar(32) NOT NULL COMMENT '通信号码',
  `registrationDate` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '注册日期',
  `licenseExpirationDate` datetime NOT NULL COMMENT '许可到期日',
  `uploadPhoto` varchar(128) DEFAULT NULL COMMENT '照片上传',
  `controllerBrand` varchar(64) DEFAULT NULL COMMENT '控制器品牌',
  `controllerType` enum('控制器类型1','控制器类型2') NOT NULL COMMENT '控制器类型',
  `operatorORengineer` varchar(64) NOT NULL COMMENT '操作员/工程师',
  `licensePeriod` varchar(255) NOT NULL COMMENT '许可周期',
  `deviceStatus` enum('运行','待机','离线','报警') NOT NULL COMMENT '设备状态',
  `other` text COMMENT '其他',
  `unitModel` varchar(64) NOT NULL COMMENT '机组型号',
  `engineModel` varchar(64) NOT NULL COMMENT '发动机型号',
  `speedControlType` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '调速类型',
  `speedControlBoardModel` varchar(64) DEFAULT NULL COMMENT '调速板型号',
  `pressureRegulatorType` varchar(64) DEFAULT NULL COMMENT '调压器类型',
  `manufacturer` varchar(64) DEFAULT NULL COMMENT '生产厂家',
  `electricGeneratorModel` varchar(64) NOT NULL COMMENT '发电机型号',
  `actuatorType` varchar(64) DEFAULT NULL COMMENT '执行器类型',
  `fuelTankCapacity` float NOT NULL COMMENT '油箱容量',
  `reference` text COMMENT '备注',
  `accessory` varchar(128) DEFAULT NULL COMMENT '附件',
  `electronicFenceStatus` enum('否','是') NOT NULL DEFAULT '否' COMMENT '电子围栏状态',
  `electronicFenceScope` varchar(255) DEFAULT NULL COMMENT '围栏范围设置',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  PRIMARY KEY (`ID`),
  UNIQUE KEY `DTUId` (`DTUId`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `device_maintenance_table` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `DTU` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'DTU',
  `controllerType` varchar(64) DEFAULT NULL COMMENT '控制器类型',
  `maintenanceOrganization` varchar(64) NOT NULL COMMENT '维修机构',
  `maintenancePersonnel` varchar(64) NOT NULL COMMENT '维修人员',
  `maintenanceCost` decimal(10,2) NOT NULL COMMENT '维修费用',
  `maintenanceTime` datetime NOT NULL COMMENT '维修时间',
  `maintenanceContent` text NOT NULL COMMENT '维修内容',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `device_upkeep_table` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `DTU` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT 'DTU',
  `controllerType` varchar(64) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '控制器类型',
  `upkeepPersonnel` varchar(255) NOT NULL COMMENT '保养人员',
  `upkeepEstablishment` varchar(64) NOT NULL COMMENT '保养机构',
  `upkeepCost` decimal(10,2) NOT NULL COMMENT '保养费用',
  `upkeepTime` datetime NOT NULL COMMENT '保养时间',
  `nextUpkeepDate` datetime NOT NULL COMMENT '下次保养日期',
  `upkeepContent` text NOT NULL COMMENT '保养内容',
  `createTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `unit_base_table` (`unitName`,`unitType`,`linkman`,`TEL`,,`unitAddress`,`unitEmail`,`unitURL`,`logo`,`remark`,`parentUnitID`,`unitTreeID`,`adminAccountID`,`parentAdminAcountID`)
VALUES ("重庆铭贝科技有限公司", "", "余小勇", "4006117011", "unitAddress", "unitEmail", "unitURL", "logo", "remark", 1, "1", "1", "1");

INSERT INTO `account_info_table` (`icon`,`userName`,`password`,`role`,`extensionNumber`,`sex`,`realName`,`email`,`affiliatedUnitID`,`accountTreeID`)
VALUES ("/usericon/favicon.ico","admin","9db186ebe0e665604441f1d65763fa31","超级管理员","8001","男","Administrator","cqmb@aa.com","1","1");