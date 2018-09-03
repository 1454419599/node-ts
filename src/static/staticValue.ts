import mkdir from "../units/mymkdirsSync";

class staticvalue {
  readonly cwd = process.cwd();
  readonly html = `${this.cwd}/views`;
  readonly tmp = `${this.cwd}/tmp`;
  readonly publicPath = `${this.cwd}/public`;

  readonly userFileRelativePath = '/userFile'
  readonly userFileAbsolutePath = `${this.publicPath}${this.userFileRelativePath}`

  readonly logoSaveRelativePath = '/logo';
  readonly logoSaveAbsolutePath = `${this.publicPath}${this.logoSaveRelativePath}`;

  readonly iconSaveRelativePath = `/usericon`;
  readonly iconSaveAbsolutePath = `${this.publicPath}${this.iconSaveRelativePath}`;

  readonly devicePhotoRelativePath = '/devicePhoto';
  readonly devicePhotoAbsolutePath = `${this.publicPath}${this.devicePhotoRelativePath}`;

  readonly deviceAccessoryRelativePath = '/deviceAccessory';
  readonly deviceAccessoryAbsolutePath = `${this.publicPath}${this.deviceAccessoryRelativePath}`;

  readonly hostName = '172.17.203.120';
  readonly port = 80;
}

let sv = new staticvalue();
export function createDir() {
  mkdir(sv.tmp);
  mkdir(sv.iconSaveAbsolutePath);
  mkdir(sv.logoSaveAbsolutePath);
  mkdir(sv.userFileAbsolutePath);
  mkdir(sv.devicePhotoAbsolutePath);
  mkdir(sv.deviceAccessoryAbsolutePath);
}
createDir();
export default sv;