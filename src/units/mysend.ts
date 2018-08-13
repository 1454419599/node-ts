import { Context } from "koa";
import sendFile from "koa-send";
import Path from "path";


interface mySend {
  file: (path: string, stats: sendFile.SendOptions) => Promise<any>,
  json: (json: JSON) => Promise<any>,
  [propName: string]: any,
}

class Send<Tkey, Tvalue> implements mySend {
  file = async function (this: Context, path: string, stats: sendFile.SendOptions): Promise<any> {
    let fileSess = Path.parse(this.path);
    this.path = this.path.replace(/^\/download/, '');
    path = path ? path : this.path;
    stats = stats ? stats : { root: `${process.cwd()}/public` }
    this.res.writeHead(200, {
      'Content-Type': 'application/force-download',
      'Content-Disposition': `attachment; filename=${fileSess.base}`
    });
    await sendFile(this, path, stats);
  }

  json = async function (this: Context, json: JSON) {
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

