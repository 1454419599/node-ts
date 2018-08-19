import fs, { exists } from 'fs';
import path from 'path';
import { MyInterface } from './myInterface';
import MyType from './myType';

namespace MyFun {
  /**
   * 保存文件
   * @param file 保存的文件
   * @param savePath 保存文件路径
   * @param saveFileName 保存文件名，isPrefix为true是为前缀
   * @param isPrefix 是否将saveFileName设为前缀默认为true
   */
  export async function saveFile(file: any, savePath: string, saveFileName?: string, isPrefix: boolean = true) {
    if (file.size != 0) {
      let oldPath = file.path;
      let oldName = file.name;
      let { ext } = path.parse(oldName);
      let name = `${new Date().toLocaleDateString()}_${Math.random().toString().substr(2)}_${oldName}`;
      let newName = `${
        saveFileName
          ? isPrefix ? `${saveFileName}_${name}` : `${saveFileName}${ext}`
          : name
        }`;
      let newPath = `${savePath}/${newName}`;
      return await new Promise((resolve, reject) => {
        fs.rename(oldPath, newPath, err => {
          if (err) {
            deleteFile(oldPath);
            reject(err)
          } else {
            resolve({ code: true, msg: { newName, newPath } });
          }
        })
      })
    } else {
      deleteFile(file.path);
      return { code: false, msg: "文件大小为0，已经删除" }
    }
  }

  /**
   * 文件是否存在
   * @param filePath 文件绝对路径
   */
  export async function fileIsExist(filePath: string) {
    return new Promise((reslove) => {
      fs.exists(filePath, exists => {
        reslove(exists);
      });
    })
  }

  /**
   * 删除文件
   * @param filePath 文件绝对路径
   */
  export async function deleteFile(filePath: string) {
    if (await fileIsExist(filePath)) {
      fs.unlink(filePath, err => {
        if (err) {
          throw err;
        }
      })
    }
    // fs.exists(filePath, exists => {
    //   exists && fs.unlink(filePath, err => {
    //     if (err) {
    //       throw err;
    //     }
    //   })
    // })
  }

  /**
   * controller异常包裹函数
   * @param ctx MyType.myCtx
   * @param callback 回调函数
   * @param errMsg 错误时的返回信息
   */
  export async function controllerTryCatchFinally(ctx: MyType.myCtx, callback: Function, errMsg?: any) {
    let result: MyInterface.MyMessage = { code: false, msg: "信息未初始化" };
    try {
      result = await callback();
    } catch (error) {
      console.error(error)
      result.msg = errMsg ? errMsg : error;
      ctx.state.log.error(error);
    } finally {
      await ctx.state.send.json(result);
    }
  }

  /**
   * server异常包裹函数
   * @param callback 回调函数
   * @param errMsg 错误时的返回信息
   */
  export async function serverTryCatch(callback: Function, errMsg?: any) {
    let result: MyInterface.MyMessage;
    try {
      result = await callback();
      return result;
    } catch (error) {
      throw errMsg ? errMsg : error;
    }
  }

  /**
   * 判断密码是否是由大写小写及数字组成
   * @param password 密码
   */
  export async function verifyPassword(password: string) {
    return /[a-z]/.test(password) && /[A-Z]/.test(password) && /[0-9]/.test(password)
  }
  
  /**
   * 从一个或多个对象中获取所需的键值
   * @param keyObj 提供所需键的对象
   * @param valueObjs 提供键对应值的对象
   */
  export async function objFiltrate(keyObj: MyType.myObject, ...valueObjs: MyType.myObject[]) {
    let obj: MyType.myObject = {};
    if (valueObjs instanceof Array) {
      let valueObj = Object.assign({}, ...valueObjs);
      for (const key in keyObj) {
        if (keyObj.hasOwnProperty(key)) {
         obj[key] = valueObj[key]
        }
      }
    }
    return obj;
  }

  /**
   * 删除对象的空值(null, undefined, '')
   * @param obj 处理对象
   */
  export async function deleteObjNullOrundefined(obj:MyType.myObject) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key] === undefined || obj[key] === null || obj[key] === '') {
          delete obj[key];
        }
      }
    }
    return obj;
  }

  export function isArrayAndDontEmpty(array: any) {
    let bol: boolean = false;
    if (array instanceof Array && array.length !== 0) {
      bol = true;
    }
    return bol;
  }
}

export default MyFun;
