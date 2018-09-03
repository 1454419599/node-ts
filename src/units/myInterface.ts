import { Context } from 'koa';
import MyEnum from './myEnum';
import MyType from './myType';

export namespace MyInterface {

  export interface lext {
    (): Promise<any>
  }

  export interface MyObject extends Object {
    [field: string]: any;
  }

  export interface MyMessage {
    status: MyType.successAndFailure;
    msg: any;
    data?: any;
    [field: string]: any;
  }
}
