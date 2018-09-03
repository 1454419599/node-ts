import KoaWebsocket, { App } from 'koa-websocket';
import * as ws from 'ws';
import { Context } from "koa";
import { Session } from "../../node_modules/@types/koa-generic-session";
import MyType from "./myType";
import { IRouterContext } from "koa-router";
import { MiddlewareContext } from "koa-websocket";
import { mySend } from './mysend';



interface Log {
  trace: Function,
  debug: Function,
  info: Function,
  warn: Function,
  error: Function,
  fatal: Function,
  mark: Function,
}

interface StateInfo {
  send: mySend,
  log: Log,
  reqJson: any,
  files: any,
  websocket: any,
}

export interface Info {
  ID: number;
  userName: string;
  unitName: string;
  unitType: string;
  unitTreeID: string;
  role: string;
  affiliatedUnitID: number | string;
  accountTreeID: string;
}

export interface MySession extends Session {
  info: Info;
}

interface MyCtx extends Context {
  state: StateInfo;
}

export interface MyWSCtx extends MyCtx {
  websocket: ws;
}

type Middleware<T> = (context: T, next: () => Promise<any>) => any;
type MyMiddleware = (this: MyWSCtx, context: MyWSCtx, next: () => Promise<any>) => any;

interface MyServer extends KoaWebsocket.Server {
  middleware: Middleware<Context>[];
  use(middleware: MyMiddleware): this;
}

export interface MyApp extends KoaWebsocket.App {
  ws: MyServer;
}

export default MyCtx;
