import { Context } from "koa";
import sendFile from "koa-send";
import Path from "path";
import MyFun from "./myFun";


export interface mySend {
  file: (path: string, stats?: sendFile.SendOptions) => Promise<any>,
  json: (json: JSON | Object) => Promise<any>,
  [propName: string]: any,
}

class Send implements mySend {
  file = async function (this: Context, path: string, stats?: sendFile.SendOptions): Promise<any> {
    let fileSess = Path.parse(path);
    this.path = this.path.replace(/^\/download/, '');
    path = path ? path : this.path;
    stats = stats ? stats : { root: `${process.cwd()}/public` }
    if (await MyFun.fileIsExist(`${stats.root}/${path}`)) {
      this.res.setHeader('Content-Type', 'application/force-download');
      this.res.setHeader('Content-Disposition', `attachment; filename=${fileSess.base}`);
      await sendFile(this, path, stats);
    } else {
      this.body = JSON.stringify({code: false, msg: '文件不存在'});
    }
  }

  json = async function (this: Context, json: JSON | Object) {
    this.set("Content-Type", "application/json");
    this.body = JSON.stringify(json);
  }
}

export default () => {

  return async (ctx: Context, next: () => Promise<any>) => {
    let contextSend: mySend = new Send();
    for (let [key, value] of Object.entries(contextSend)) {
      contextSend[key] = value.bind(ctx);
    }
    ctx.state.send = contextSend;

    await next();
  }
}

