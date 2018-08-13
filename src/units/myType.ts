import { MyInterface } from '../units/myInterface';
import { MyDb } from './dbInfo';
import MyCtx, { MySession, Info } from './ctxStateInfo';
import { MultipleSql, MultipleTransactionSql } from './mySql';

namespace MyType {
  export type myCtx = MyCtx;
  export type mySession = MySession;
  export type mySessionInfo = Info;
  export type myNext = MyInterface.lext;
  export type myMessage = MyInterface.MyMessage;
  export type myDbFeild = MyDb.UserInfoTableField | MyDb.UnitBaseTableField;
  export type myMultipleResult = MultipleSql<myDbFeild>;
  export type myMultipleTransactionSql = MultipleTransactionSql<myDbFeild>;
}

export default MyType;