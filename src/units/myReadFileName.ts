import { Context } from 'koa';
import fs from "fs";
import path from 'path';

// export default async function read(pathName: string, ext: string = '.html') {
//   let dirs: string[] = [];
//   let oFiles: string[] = [];
//   let oExtFiles: string[] = [];
//   let fns: Promise<any>[] = [];

//   async function readDir(pathName: string) {
//     return new Promise(async (resolve, reject) => {
//       await fs.readdir(pathName, (err, files) => {
//         if (err)
//           throw err;
//         resolve(files);
//       });
//     });
//   }

//   async function filtrate(files: Array<string>) {
//     (files as Array<string>).map(async value => {
//       fns.push(new Promise((resolve, reject) => {
//         fs.stat(path.resolve(pathName, value), (err, stats) => {
//           if (err) reject(err);
//           if (stats.isFile()) {
//             oFiles.push(value);
//             if (path.extname(value) === ext) {
//               oExtFiles.push(value);
//             }
//           } else {
//             dirs.push(value);
//           }
//           resolve();
//         })
//       }))
//     });
//   }

//   async function oReadDir(pathName: string, files: Array<string>) {
//     (files as Array<string>).map(async value => {
//       fns.push(new Promise((resolve, reject) => {
//         fs.readdir(path.resolve(pathName, value), (err, oFiles) => {
//           if (err) throw err;
//           resolve(JSON.stringify({[value]: oFiles}));
//         })
//       }))
//     });
//     let dir = await Promise.all([...fns]);
//     return dir;
//   }

//   let files_0 = await readDir(pathName);
//   await filtrate(files_0 as Array<string>);
//   await Promise.all([...fns]);
//   fns = [];
//   let dir = await oReadDir(pathName, dirs);

//   return { dirs, oExtFiles, oFiles, dir};
// }
let files: string[] = [];
let dirs: string[] = [];
let exts: string[] = [];
function isExists(arr: any[], str: any) {
  for (let i in arr) {
    if (arr[i] === str) return true;
  }
  return false;
}
export function getDirSync(pathName: string, ext: string) {
  let fds = fs.readdirSync(pathName);
  fds.forEach(value => {
    let state = fs.statSync(path.resolve(`${pathName}/${value}`));
    if (state.isDirectory()) {
      dirs.push(value);
      getDirSync(path.resolve(`${pathName}/${value}`), ext);
    }
    if (state.isFile()) {
      files.push(value);
      if (path.extname(value) === ext) {
        exts.push(value);
      }
    }
  });
  return { files, dirs, exts };
}

export async function test(pathName: string, ext: string) {
  await new Promise((resolve, reject) => {
    fs.readdir(pathName, (err, stats) => {
      stats.forEach(value => {
        let state = fs.stat(path.resolve(`${pathName}/${value}`), (err, stat) => {
          if (stat.isDirectory()) {
            dirs.push(value);
            test(path.resolve(`${pathName}/${value}`), ext);
          }
          if (stat.isFile()) {
            files.push(value);
            if (path.extname(value) === ext) {
              exts.push(value);
            }
          }
          resolve();
        });
      });
    });
  })
  return { files, dirs, exts };
}

export async function getDir(pathName: string, ext: string[]) {
  let fds = await new Promise((resolve, reject) => {
    fs.readdir(pathName, (err, files) => {
      if (err) reject(err);
      resolve(files);
    })
  });
  let fns: Function[] = [];
  for (let value of Object.values(fds)) {
    fns.push(async () => {
      let stat = await new Promise((resolve, reject) => {
        fs.stat(path.resolve(`${pathName}/${value}`), (err, stats) => {
          if (err) reject(err);
          resolve(stats);
        })
      });

      if ((stat as fs.Stats).isDirectory()) {
        dirs.push(value);
        await getDir(path.resolve(`${pathName}/${value}`), ext);
      }

      if ((stat as fs.Stats).isFile()) {
        files.push(value);
        if (isExists(ext, path.extname(value))) {
          exts.push(value);
        }
      }
    })
  }
  await Promise.all(fns.map(async value => await value()));

  return { dirs, files, exts };

}

export default (pathName: string, ext: string[]) => {
  let file = getDir(pathName, ext);
  return async (ctx: Context, next: () => Promise<any>) => {
    ctx.state.staticFiles = await file;

    await next();
  }
}
