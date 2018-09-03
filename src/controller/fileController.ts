import path from 'path';
import MyType from './../units/myType';
import fileServer from '../server/fileServer';
import MyFun from '../units/myFun';
import StaticValue from '../static/staticValue';
import myMakdir from '../units/mymkdirsSync';
import myJSON from '../units/myJSON';
import MyEnum from '../units/myEnum';

type myCtx = MyType.myCtx;

export default {
  download: async (ctx: myCtx) => {
    console.log(ctx.url);
    console.log(ctx.params[0]);
    await ctx.state.send.file(ctx.params[0]);
  },

  upload: async (ctx: myCtx) => {
    await MyFun.controllerTryCatchFinally(ctx, async () => {
      let files = ctx.state.files;
      let info = (ctx.session as MyType.mySession).info;
      let { userName } = info;
      let fileSavePath =`${StaticValue.userFileAbsolutePath}/${userName}`;
      let result: MyType.myMessage = myJSON.message();

      let fileUrl: Array<Object> = [];
      let basePath = `${StaticValue.userFileRelativePath}/${userName}`;

      if (await myMakdir(fileSavePath)) {
        let file = files.file;
        if (file instanceof Array && file.length !== 0) {
          for (const fe of file) {
            let fileName =  path.parse(fe.name).name;
            let fileResult = await MyFun.saveFile(fe, fileSavePath, fileName, false, true);
            if ((fileResult as any).code) {
              fileUrl.push({url: `${basePath}/${(fileResult as any).msg.newName}`, type: fe.type})
            }
          }
        } else {
          let fileName = path.parse(file.name).name;
          let fileResult = await MyFun.saveFile(file, fileSavePath, fileName, false, true);
          if ((fileResult as any).code) {
            fileUrl.push({url: `${basePath}/${(fileResult as any).msg.newName}`, type: file.type})
          }
        }
        result.code = true;
        result.msg = '文件上传成功';
        result.data = fileUrl;
      } else {
        result.msg = '文件路径创建失败'
      }
      return result;
    });
  }
}