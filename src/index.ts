import Koa from 'koa';

import middleware from "./middleware/middleware";
import router from './router/index';

const app = new Koa();

middleware(app);

router(app);

app.listen(80, '172.17.203.120', () => {
  console.log('172.17.203.120');
});

