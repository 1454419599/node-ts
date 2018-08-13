import fs from 'fs';
import getSqlMap from './get_sql_map';

let sqlContentMap:any = {}

/**
 * 读取sql文件内容
 * @param  {string} fileName 文件名称
 * @param  {string} path     文件所在的路径
 * @return {string}          脚本文件内容
 */
function getSqlContent( fileName: string,  path: string ) {
  // console.log(path);
  let content = fs.readFileSync( path, 'utf8' )
  // console.log(content);
  sqlContentMap[ fileName ] = content;
}

/**
 * 封装所有sql文件脚本内容
 * @return {object} 
 */
function getSqlContentMap () {
  let sqlMap = getSqlMap()
  for( let key in sqlMap ) {
    getSqlContent( key, sqlMap[key] )
  }

  return sqlContentMap
}

export default getSqlContentMap;