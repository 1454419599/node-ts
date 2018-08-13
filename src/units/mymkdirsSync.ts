import fs from "fs";
import path from "path";

export default async function a(pathName: string) {
  if (fs.existsSync(pathName)) {
    return true;
  } else if (a(path.dirname(pathName))) {
    fs.mkdirSync(pathName);
    return true;
  }
}