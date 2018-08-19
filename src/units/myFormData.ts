import { Context } from "koa"
import formidable from "formidable";
import util from "util";

import MyType from '../units/myType';
import staticValue from "../static/staticValue";

type myNext = MyType.myNext;
async function post(ctx: Context, next: myNext) {
  let post: any = {};
  let files: any = {};
  let form: formidable.IncomingForm;

  await new Promise((resolve, reject) => {
    form = new formidable.IncomingForm();
    form.uploadDir = staticValue.tmp;
    form.keepExtensions = true;
    form.maxFileSize = 200 * 1024 * 1024;
    form.on('field', (field, value) => {
      if (form.type === 'multipart') {
        if (field in post) {
          if (util.isArray(post[field]) === false) {
            post[field] = [post[field]]
          }
          post[field].push(value);
          return false;
        }
      }
      post[field] = value;
    }).on('file', (field, file) => {
      if (field in files) {
        if (util.isArray(files[field]) === false) {
          files[field] = [files[field]]
        }
        files[field].push(file);
        return false;
      }
      files[field] = file;
    }).on('end', async () => {
      Object.assign(ctx.state.reqJson, post, ctx.state.reqJson);
      // ctx.state.reqJson = post;
      ctx.state.files = files;
      resolve();
    }).on('error', err => {
      console.log("我是内置ERROR", err);
      reject();
      throw Error(err);
    });
    form.parse(ctx.req);
  });
}

async function get(ctx: Context, next: myNext) {
  ctx.state.reqJson = ctx.query;
  return;
}


export default function myFormData() {
  return async (ctx: Context, next: myNext) => {
    let method = ctx.method.toLocaleUpperCase();
    switch (method) {
      case 'GET':
        await get(ctx, next);
        break;
      case 'PUT':
      case 'DELETE':
      case 'POST':
        await get(ctx, next);
        await post(ctx, next);
        break;
      default:
        console.log("未知 method", method);
    }
    await next();
  }
}
