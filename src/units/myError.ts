import { Context } from "koa";
import { myLog } from "./mylog";
import MyType from "./myType";

type myNext = MyType.myNext;

export default () => {
  return async (ctx: Context, next: myNext) => {
    try {
      await next();
    } catch (error) {
      console.log("我是顶层抛出的错误", error);
      ctx.state.log.error({responseError: error});
    }
  }
}

interface oCallback {
  (resolve: any, reject: any): void;
}

export function myPromiseCatch(callback: oCallback): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      await callback(resolve, reject);
    } catch (error) {
      reject(error)
    }
  }).catch(e => {
    throw e;
  });
}

export async function myPromiseAll(callbacks: oCallback[]) {
  callbacks = callbacks.map(callback => <any>myPromiseCatch(callback));
  let result = await Promise.all([...callbacks])
  return result;
}
