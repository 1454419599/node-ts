import { Context } from "koa";
import { Session } from "../../node_modules/@types/koa-generic-session";
import MyType from "./myType";

interface Send {
  file: Function,
  json: Function,
}

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
  send: Send,
  log: Log,
  reqJson: any,
  files: any,
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


export default interface MyCtx extends Context {
  state: StateInfo;
}
