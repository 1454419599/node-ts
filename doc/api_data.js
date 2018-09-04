define({ "api": [
  {
    "type": "POST",
    "url": "/accunt",
    "title": "添加账号信息",
    "name": "____",
    "group": "ADD",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "affiliatedUnitID",
            "description": "<p>账号直属公司ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>账号名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "role",
            "description": "<p>账号角色('超级管理员','高级管理员','经销商管理员','组机厂管理员','终端用户管理员','工程师','操作员','观察员','普通用户')</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sex",
            "defaultValue": "男",
            "description": "<p>性别（男,女）</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "realName",
            "description": "<p>真实姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "extensionNumber",
            "description": "<p>分机号码</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "icon",
            "description": "<p>账号头像</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"affiliatedUnitID\": 1,\n   \"role\": \"高级管理员\",\n   \"userName\": \"admin1\",\n   \"password\": \"Aa1\",\n   \"sex\": \"女\",\n   \"realName\": \"小一\",\n   \"extensionNumber\": \"12454657878\",\n   \"icon\": \"头像图片\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>添加账号是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": 1,\n   \"msg\": \"添加账号成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "ADD"
  },
  {
    "type": "POST",
    "url": "/unit",
    "title": "添加公司信息",
    "name": "______",
    "group": "ADD",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "parentUnitID",
            "description": "<p>添加公司的直属上级公司ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unitName",
            "description": "<p>公司名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "unitType",
            "description": "<p>公司类型(经销商, 装机厂, 终端)</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "linkman",
            "description": "<p>联系人</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "TEL",
            "description": "<p>联系电话</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitAddress",
            "description": "<p>单位地址</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitEmail",
            "description": "<p>电子邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitURL",
            "description": "<p>单位网址</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "remark",
            "description": "<p>备注</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "logo",
            "description": "<p>公司LOGO图片文件</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n     \"parentUnitID\" : 1,\n     \"unitName\": \"子公司\",\n     \"unitType\": \"经销商\",\n     \"linkman\": \"小一\",\n     \"TEL\": \"13866666666\",\n     \"unitAddress\": \"公司地址\",\n     \"unitEmail\": \"公司邮箱\",\n     \"unitURL\": \"公司网址\",\n     \"remark\": \"备注\",\n     \"logo\": \"LOGO图片\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>添加公司是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n     \"status\" : 1,\n     \"msg\": \"公司添加成功\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "ADD"
  },
  {
    "type": "GET",
    "url": "/account/:unitID",
    "title": "获取账号信息",
    "name": "____",
    "group": "GET",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "unitID",
            "description": "<p>公司ID</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "q",
            "description": "<p>用户搜索信息</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>页数</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "length",
            "defaultValue": "30",
            "description": "<p>单页显示条目数</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "orderField",
            "description": "<p>排序字段</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "desc",
            "defaultValue": "0",
            "description": "<p>候选值（0,1），1为降序，0为升序</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "fasttips",
            "defaultValue": "1",
            "description": "<p>候选值（0,1），是否快速查询，1为快速查询</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "field",
            "description": "<p>当 q参数 存在时生效，限制q的搜索字段</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "minDate",
            "description": "<p>创建账号的最小时间</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "maxDate",
            "description": "<p>创建账号的最大时间</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "url: http://39.108.114.59/account/1\n{\n   \"page\": 1,\n   \"length\": 10,\n   \"orderField\": \"ID\",\n   \"desc\": 1\n}",
          "type": "json"
        },
        {
          "title": "Request-Example:",
          "content": "url: http://39.108.114.59/account\n{\n   \"q\": \"ppp\",\n   \"field\": \"userName\",\n   \"fasttips\": 0,\n   \"page\": 1,\n   \"length\": 10,\n   \"orderField\": \"ID\",\n   \"desc\": 1\n}",
          "type": "json"
        },
        {
          "title": "Request-Example:",
          "content": "url: http://39.108.114.59/account\n{\n   \"minDate\": \"2018/8/15 12:00:00\",\n   \"maxDate\": \"2018/8/16 12:00:00\",\n   \"page\": 1,\n   \"length\": 10,\n   \"orderField\": \"ID\",\n   \"desc\": 1\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>查询账号是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          },
          {
            "group": "200",
            "type": "Objec",
            "optional": true,
            "field": "data",
            "description": "<p>code = true 时存在，账号信息对象</p>"
          },
          {
            "group": "200",
            "type": "Array",
            "optional": true,
            "field": "data.accounts",
            "description": "<p>data.accounts 账号信息数据</p>"
          },
          {
            "group": "200",
            "type": "Objec",
            "optional": true,
            "field": "data.count",
            "description": "<p>账号信息数据总数</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"status\": 1,\n    \"msg\": \"unitID查询成功\",\n    \"data\": {\n        \"accounts\": [\n            {\n                \"ID\": 1,\n                \"icon\": \"/usericon/favicon.ico\",\n                \"email\": \"aaa.@aaa.com\",\n                \"userName\": \"admin\",\n                \"role\": \"超级管理员\",\n                \"extensionNumber\": \"8001\",\n                \"sex\": \"男\",\n                \"realName\": \"Administrator\",\n                \"affiliatedUnitID\": 1\n            },\n            {\n                \"ID\": 2,\n                \"icon\": \"/usericon/admin1_8-19-2018_14104029341639146_sky_lanterns_by_wlop-d7b5nfg.jpg\",\n                \"email\": \"aaa.@aaa.com\",\n                \"userName\": \"admin1\",\n                \"role\": \"高级管理员\",\n                \"extensionNumber\": \"12454657878\",\n                \"sex\": \"女\",\n                \"realName\": \"小一\",\n                \"affiliatedUnitID\": 1\n            }\n        ],\n        \"count\": 2\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "GET"
  },
  {
    "type": "GET",
    "url": "/unitLogoUrl/:unitID",
    "title": "获取公司的LOGO",
    "name": "_____LOGO",
    "group": "GET",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "unitID",
            "description": "<p>公司ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n     \"http://39.108.114.59/unitLogoUrl/:unitID\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>查询公司LOGO是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": true,
            "field": "data",
            "description": "<p>LOGO URL</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"status\": 1,\n    \"msg\": \"查询成功\",\n    \"data\": \"/logo/qqq2342_2018-8-17_12492779049707181_MainActivity.java\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "GET"
  },
  {
    "type": "GET",
    "url": "/unit/:unitID",
    "title": "获取公司",
    "name": "______",
    "group": "GET",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "unitID",
            "description": "<p>公司ID,如果指定则查看该公司的直属下级公司</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "q",
            "description": "<p>用户搜索值</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "page",
            "defaultValue": "1",
            "description": "<p>显示页数</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "length",
            "defaultValue": "30",
            "description": "<p>单页显示条数</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "desc",
            "defaultValue": "0",
            "description": "<p>可选值（0,1），是否降序排列（1为降序，0为升序）</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "orderField",
            "description": "<p>排序所参照的字段，所选值取决于查询的字段</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "fasttips",
            "defaultValue": "1",
            "description": "<p>可选值（0,1），是否快速查询（1为快速查询，0为内置字段模糊查询）</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "field",
            "description": "<p>限制 q参数 的搜索字段，所取值受限于表字段</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "minDate",
            "description": "<p>创建公司的最小时间</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "maxDate",
            "description": "<p>创建公司的最大时间</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "url: http://39.108.114.59/unit/1\n{\n   \"page\": 1,\n   \"length\": 10,\n   \"desc\": 1,\n   \"orderField\": \"ID\"\n}",
          "type": "json"
        },
        {
          "title": "Request-Example:",
          "content": "url: http://39.108.114.59/unit\n{\n   \"field\": \"unitName\",\n   \"q\": \"铭贝科技\",\n   \"fasttips\": 0,\n   \"page\": 1,\n   \"length\": 10,\n   \"desc\": 1,\n   \"orderField\": \"ID\"\n}",
          "type": "json"
        },
        {
          "title": "Request-Example:",
          "content": "url: http://39.108.114.59/unit\n{\n   \"minDate\": \"2018/8/15 12:00:00\",\n   \"maxDate\": \"2018-8-16 13:37:39\",\n   \"page\": 1,\n   \"length\": 10,\n   \"desc\": 1,\n   \"orderField\": \"ID\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>查询公司是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          },
          {
            "group": "200",
            "type": "json",
            "optional": false,
            "field": "data",
            "description": "<p>信息</p>"
          },
          {
            "group": "200",
            "type": "Array",
            "optional": false,
            "field": "data.units",
            "description": "<p>查询公司列表具体信息</p>"
          },
          {
            "group": "200",
            "type": "Number",
            "optional": false,
            "field": "data.count",
            "description": "<p>查询公司列表总数</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": 1,\n   \"msg\": \"unitID = 1 查询成功\",\n   \"data\": {\n       \"units\": [\n           {\n               \"ID\": 2,\n               \"unitName\": \"aaa1\",\n               \"unitType\": \"经销商\",\n               \"linkman\": \"asd\",\n               \"TEL\": \"2324\",\n               \"unitEmail\": \"asd\",\n               \"unitURL\": \"sdfg\",\n               \"logo\": \"/logo/aaa1_8-19-2018_29333284864167153_sky_lanterns_by_wlop-d7b5nfg.jpg\",\n               \"remark\": \"asddfsdf\",\n               \"parentUnitID\": 1,\n               \"unitTreeID\": \"1,2\"\n           },\n           {\n               \"ID\": 1,\n               \"unitName\": \"重庆铭贝科技有限公司\",\n               \"unitType\": \"\",\n               \"linkman\": \"余小勇\",\n               \"TEL\": \"4006117011\",\n               \"unitEmail\": \"unitEmail\",\n               \"unitURL\": \"unitURL\",\n               \"logo\": \"logo\",\n               \"remark\": \"remark\",\n               \"parentUnitID\": 1,\n               \"unitTreeID\": \"1\"\n           }\n       ],\n       \"count\": 2\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "GET"
  },
  {
    "type": "DELETE",
    "url": "/logOut",
    "title": "退出登录",
    "name": "____",
    "group": "Login",
    "version": "0.1.0",
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>成功状态(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"status\": 1,\n    \"msg\": \"退出成功\"\n}",
          "type": "type"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "Login"
  },
  {
    "type": "POST",
    "url": "/login",
    "title": "登录",
    "name": "______",
    "group": "Login",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "affiliatedUnit",
            "description": "<p>所属公司</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "userName",
            "description": "<p>账号</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "password",
            "description": "<p>密码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n    \"affiliatedUnit\": \"重庆铭贝科技有限公司\",\n    \"userName\": \"admin\",\n    \"password\": \"root\",\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>成功状态(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>登录描述</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": true,
            "field": "data",
            "description": "<p>登录成功后的账号信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n    \"status\": 1,\n    \"msg\": \"欢迎登录admin\",\n    \"data\": {\n       \"ID\": 1,\n       \"userName\": \"admin\",\n       \"unitName\": \"重庆铭贝科技有限公司\",\n       \"unitType\": \"\",\n       \"role\": \"超级管理员\",\n       \"affiliatedUnitID\": 1,\n       \"unitTreeID\": \"1\",\n       \"accountTreeID\": \"1\"\n     }\n}",
          "type": "type"
        }
      ]
    },
    "sampleRequest": [
      {
        "url": "http://39.108.114.59/login"
      }
    ],
    "filename": "src/controller/adminController.ts",
    "groupTitle": "Login"
  },
  {
    "type": "PUT",
    "url": "/unit",
    "title": "更新公司信息",
    "name": "____",
    "group": "Update",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "unitID",
            "description": "<p>公司ID</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "logo",
            "description": "<p>公司LOGO图片文件</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitName",
            "description": "<p>公司名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitType",
            "description": "<p>公司类型（经销商','装机厂','终端'）</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "linkman",
            "description": "<p>联系人</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "TEL",
            "description": "<p>联系电话</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitAddress",
            "description": "<p>单位地址</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitEmail",
            "description": "<p>电子邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "unitURL",
            "description": "<p>单位网址</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "remark",
            "description": "<p>备注</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"unitID\": 2,\n   \"unitName\": \"公司2\"\n}",
          "type": "type"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>修改公司是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": true,
            "field": "data",
            "description": "<p>数据库返回信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": 1,\n   \"msg\": \"修改成功\",\n   \"data\": {\n       \"fieldCount\": 0,\n       \"affectedRows\": 1,\n       \"insertId\": 0,\n       \"serverStatus\": 2,\n       \"warningCount\": 0,\n       \"message\": \"(Rows matched: 1  Changed: 1  Warnings: 0\",\n       \"protocol41\": true,\n       \"changedRows\": 1\n   }\n}",
          "type": "type"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "Update"
  },
  {
    "type": "PUT",
    "url": "/packToTransfer",
    "title": "打包转移",
    "name": "____1",
    "group": "Update",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "sourceUnitID",
            "description": "<p>源公司ID，需要打包转移的公司ID</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "targetSeniorAccountID",
            "description": "<p>目标账号ID，打包转移至高级管理账号的ID</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"sourceUnitID\": 2,\n   \"targetSeniorAccountID\": 3\n}",
          "type": "type"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>打包转移是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": 1,\n   \"msg\": \"打包转移成功，公司共:2条,账号共：4条\"\n}",
          "type": "type"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "Update"
  },
  {
    "type": "PUT",
    "url": "/account",
    "title": "更新账号信息",
    "name": "______",
    "group": "Update",
    "version": "0.1.0",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "accountID",
            "description": "<p>账号ID，该参数不存在时修改登录账号</p>"
          },
          {
            "group": "Parameter",
            "type": "File",
            "optional": true,
            "field": "icon",
            "description": "<p>账号头像</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "userName",
            "description": "<p>账号名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "email",
            "description": "<p>邮箱</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "role",
            "description": "<p>账户类型('高级管理员','经销商管理员','组机厂管理员','终端用户管理员','工程师','操作员','观察员','普通用户')</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "extensionNumber",
            "description": "<p>分机号码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sex",
            "description": "<p>性别</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "realName",
            "description": "<p>真实姓名</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "oldPassword",
            "description": "<p>旧密码</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "newPassword",
            "description": "<p>新密码</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Request-Example:",
          "content": "{\n   \"accountID\": 2,\n   \"userName\": \"userName2\",\n   \"sex\": \"女\"\n}",
          "type": "json"
        }
      ]
    },
    "success": {
      "fields": {
        "200": [
          {
            "group": "200",
            "type": "Int",
            "optional": false,
            "field": "status",
            "description": "<p>修改账号是否成功(0,1)</p>"
          },
          {
            "group": "200",
            "type": "String",
            "optional": false,
            "field": "msg",
            "description": "<p>描述信息</p>"
          },
          {
            "group": "200",
            "type": "Object",
            "optional": true,
            "field": "data",
            "description": "<p>数据库返回信息</p>"
          }
        ]
      },
      "examples": [
        {
          "title": "Success-Response:",
          "content": "{\n   \"status\": true,\n   \"msg\": \"账号更新成功\",\n   \"data\": {\n       \"fieldCount\": 0,\n       \"affectedRows\": 1,\n       \"insertId\": 0,\n       \"serverStatus\": 2,\n       \"warningCount\": 0,\n       \"message\": \"(Rows matched: 1  Changed: 1  Warnings: 0\",\n       \"protocol41\": true,\n       \"changedRows\": 1\n   }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "src/controller/adminController.ts",
    "groupTitle": "Update"
  }
] });
