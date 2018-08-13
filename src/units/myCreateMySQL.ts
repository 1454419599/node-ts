import { MySqlUnit } from "../units/mySqlUnit";
import getSqlContentMap from "./readSqlFile/get_sql_content_map";

import MyJSON from './myJSON';
const eventLog = (err: any, sqlFile: any, index: any) => {
  if (err) {
    console.log(`[ERROR] sql脚本文件: ${sqlFile} 第${parseInt(index) + 1}条脚本 执行失败 o(╯□╰)o ！`);
  } else {
    console.log(`[SUCCESS] sql脚本文件: ${sqlFile} 第${parseInt(index) + 1}条脚本 执行成功 O(∩_∩)O !`);
  }
}

const createAllTables = async () => {
  let sqlContentMap = getSqlContentMap();
  for (let key in sqlContentMap) {
    let mysql: any;
    if (key === 'createDatabase.sql') {
      mysql = new MySqlUnit.Mysql({ debug: false });
    } else {
      mysql = new MySqlUnit.Mysql({
        database: MyJSON.DBName,
        debug: false,
      });
    }
    let sqlShell = sqlContentMap[key];
    let sqlShellList = sqlShell.split(';');
    for (let i in sqlShellList) {
      let shell = sqlShellList[i];
      if (shell.trim()) {
        let result: any = await mysql.resultTransaction(shell.trim());
        if (result.serverStatus * 1 === 2 || result.serverStatus * 1 === 3) {
          eventLog(null, key, i);
        } else {
          eventLog(true, key, i);
        }
      }
    }
    // sqlShellList.forEach( async (shell: any, i: number) => {
    //   console.log(i, shell.trim())
    //   if (shell.trim()) {
    //     let result: any = await mysql.resultTransaction(shell.trim());
    //     if (result.serverStatus * 1 === 2 || result.serverStatus * 1 === 3) {
    //       eventLog(null, key, i);
    //     } else {
    //       eventLog(true, key, i);
    //     }
    //   }
    // });
  }
}
// createAllTables();
export default createAllTables;
