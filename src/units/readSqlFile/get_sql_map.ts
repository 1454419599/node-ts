import fs from 'fs';
import walkFile from './walk_file';

/**
 * 获取sql目录下的文件目录数据
 * @return {object} 
 */
function getSqlMap() {
    let basePath = process.cwd();
    // console.log(basePath);
    basePath = basePath.replace(/\\/g, '\/');
    // console.log(basePath);
    let pathArr = basePath.split('\/');
    // console.log(pathArr);
    // pathArr = pathArr.splice(0, pathArr.length - 1);
    // pathArr.pop();
    // console.log(pathArr);
    basePath = pathArr.join('/') + '/sql/';
    // console.log(basePath);
    let fileList = walkFile(basePath, 'sql');
    // console.log(fileList)
    return fileList;
}

export default getSqlMap;