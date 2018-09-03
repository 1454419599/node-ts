import Koa from 'koa';
import koaWebsockify from 'koa-websocket';
// import WebSocket from 'ws';

import middleware from "./middleware/middleware";
import router from './router/index';

// const app = new Koa();
const app = koaWebsockify(new Koa(), {
  perMessageDeflate: false
});

middleware(app);

router(app);

const ip = '172.17.203.125';

app.listen(80, ip, () => {
  console.log(ip);
});

// let wss = new WebSocket.Server({
//   server
// });
