let api = [
  {
    "login": {
      "title": "用户登录",
      "url": "http://172.17.203.113/admin/login",
      "method": "post",
      "para": {
        "user": "",
        "password": "",
        "affiliatedUnit": "",
      },
      "return": [{
        "code": "true, false",
        "message": "xxx",
      }],
      "description": "失败返回，成功跳转",
    }
  },
  {
    "addUnit": {
      "title": "用户登录",
      "url": "http://172.17.203.113/addUnit",
      "method": "post",
      "para": {
        "parentUnitID": "",
        "unitName": "",
        "unitType": "'经销商','装机厂','终端'",
        "linkman": "",
        "TEL": "",
        "unitAddress": "",
        "unitEmail": "",
        "unitURL": "",
        "remark": "",
      },
      "return": [{
        "code": "true, false",
        "message": "xxx",
      }],
      "description": "失败返回，成功跳转",
    }
  },
]
export { api };