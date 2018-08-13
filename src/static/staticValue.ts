import mkdir from "../units/mymkdirsSync";


class staticvalue {
  readonly html = `${process.cwd()}/views`;
  readonly tmp = `${process.cwd()}/tmp`;
  readonly publicPath = `${process.cwd()}/public`;
  readonly logoSaveAbsolutePath = `${process.cwd()}/public/logo`;
  readonly logoSaveRelativePath = '/logo';
  readonly iconSaveAbsolutePath = `${process.cwd()}/public/usericon`;
  readonly iconSaverelativePath = `/usericon`;
}

let sv = new staticvalue();
export function createDir() {
  mkdir(sv.tmp);
  mkdir(sv.iconSaveAbsolutePath);
  mkdir(sv.logoSaveAbsolutePath);
}
createDir();
export default sv;