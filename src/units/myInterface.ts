import { Context } from 'koa';

export namespace MyInterface {

  export interface lext {
    (): Promise<any>
  }

  export interface MyMessage {
    code: boolean;
    msg: any;
    data?: any;
    [field: string]: any;
  }
}