import { MyInterface } from '../units/myInterface';
import { MyDb } from './dbInfo';
import MyCtx, { MySession, Info, MyWSCtx } from './ctxStateInfo';
import { MultipleSql, MultipleTransactionSql } from './mySql';

namespace MyType {
  export type successAndFailure = 0 | 1;
  export type myCtx = MyCtx;
  export type myWSCtx = MyWSCtx;
  export type mySession = MySession;
  export type myObject = MyInterface.MyObject
  export type mySessionInfo = Info;
  export type myNext = MyInterface.lext;
  export type myMessage = MyInterface.MyMessage;
  export type myDbFeild = MyDb.UserInfoTableField | MyDb.UnitBaseTableField | MyDb.DeviceDetailTableField | MyDb.DeviceUpkeepTableField | MyDb.DeviceMaintenanceTable;
  export type myMultipleResult = MultipleSql<myDbFeild>;
  export type myMultipleTransactionSql = MultipleTransactionSql<myDbFeild>;
}

export default MyType;