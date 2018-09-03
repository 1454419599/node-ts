import { App } from "koa-websocket";

import MyCtx from "./ctxStateInfo";
import MyType from "./myType";
import middleware from "../middleware/middleware";
function webSocketSession() {
  
  return async (wctx: MyType.myCtx, next: MyType.myNext) => {
    await next();
  }
}

export default webSocketSession;