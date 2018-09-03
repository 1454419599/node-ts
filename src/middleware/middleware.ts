import Koa from "koa";
import views from "koa-views";
import staticFiles from "koa-static";
import path from "path";
import redisStore from "koa-redis";
import session from "koa-generic-session";
import ip from "ip";
import { App } from 'koa-websocket';
import cors from 'koa2-cors';

import myError from "../units/myError";
import mySend from "../units/mysend";
import { myLog } from "../units/mylog";
import myFormData from "../units/myFormData";
import getdir from "../units/myReadFileName";
import staticValue from "../static/staticValue";
import webSocketSession from '../units/myWebSocketSession';

export default async (app: App) => {
  app.use(myError());

  app.use(myLog.log({
    env: app.env,
    appLogLevel: 'debug',
    dir: 'logs',
    serverIp: ip.address(),
  }));

  let mykeys: string[] = [];
  for (let i = 0; i < 10000; i++) {
    mykeys.push(`${Math.random().toString(16).substr(2)}difyhskh3846yu%^$#@^%*^&$`);
  }
  app.keys = mykeys;

  let sessionConfig = session({
    key: 'user',
    prefix: 'user',
    store: redisStore({
      db: 0,
    }),
    cookie: {
      maxAge: 1000 * 60 * 60,
      httpOnly: true,
      signed: true,
    },
    rolling: true,
  });

  app.use(sessionConfig);

  app.ws.use(sessionConfig);

  app.use(getdir(staticValue.html, ['.html', '.ejs']));
  
  app.use(myFormData());

  app.use(views(path.join(process.cwd(), './views'), {
    extension: 'ejs',
  }));

  app.use(cors({
    credentials: true,
    origin: (ctx) => ctx.header.origin,
  }));

  app.use(mySend());

  app.use(staticFiles(path.resolve(process.cwd(), './icon')));
  app.use(staticFiles(path.resolve(process.cwd(), './public')));
  app.use(staticFiles(path.resolve(process.cwd(), './doc')));
}
