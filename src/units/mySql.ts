import { MySqlUnit } from "./mySqlUnit";
import { myPromiseCatch } from "./myError";
import MyJson from './myJSON';
import MyType from './myType';
import { PoolConnection } from "../../node_modules/@types/mysql";

type myType = string | number | null | undefined;
type myDbFeild = MyType.myDbFeild;

let db: MySqlUnit.MySqlConfig = {
  database: MyJson.DBName,
  debug: false
};

interface Limit {
  start: number;
  length: number;
}

interface ORDER {
  feild: string[];
  DESC?: boolean;
}

export interface MultipleSql<T extends myDbFeild> {
  multipleInsert: (options: InsertOptions<T>) => {};
  multipleDelete: (options: DeleteOptions<T>) => {};
  multipleUpdate: (options: UpdateOptions<T>) => {};
  multipleSelect: (options: SelectOptions<T>) => {};
}

export interface MultipleTransactionSql<T extends myDbFeild> extends MultipleSql<T> {
  multipleRollback: () => {};
}

interface MultipleResultCallback<T> {
  (query: MultipleSql<T>): any;
}

interface MultipleResultTransactionCallback<T> {
  (query: MultipleTransactionSql<T>): any;
}

export interface InsertOptions<T extends myDbFeild> {
  table: string,
  kv: T,
}

export interface DeleteOptions<T extends myDbFeild> {
  table: string,
  wherekv?: T,
  where?: string,
  BINARY?: boolean,
}

export interface UpdateOptions<T extends myDbFeild> extends InsertOptions<T>, DeleteOptions<T> { }

export interface SelectOptions<T extends myDbFeild> extends DeleteOptions<T> {
  fieldkv?: string[];
  field?: string;
  LIMIT?: Limit;
  ORDER?: string;
  ORDERarr?: ORDER[];
}

function matching<T>(wherekv?: T, where?: string, BINARY?: boolean) {
  let values: any = [];
  let limit: string = '';
  if (wherekv) {
    let keyValue = Object.entries(wherekv).map(([key, value]) => {
      values.push(value);
      return `\`${key}\` = ? `;
    });
    limit = `WHERE ${BINARY ? ' BINARY' : ''} (${keyValue.join(' AND ')})`;
  } else if (where) {
    limit = `WHERE ${BINARY ? ' BINARY' : ''} (${where})`;
  } else {
    limit = '';
  }

  return { limit, values };
}

function jsonParser(strArr: string[]): ORDER[] {
  console.log(strArr);
  let str = strArr.join();
  let arr = str.match(/\{[^\}]+\}/g);
  console.log("arr >>>", arr);
  let oArr = arr ? arr.map(value => {
    let a = JSON.parse(value);
    a.feild = a.feild.split(',');
    return a;
  }) : [];
  console.log(oArr);
  return oArr;
}
export class MySql<T extends myDbFeild> {
  private mySQL: MySqlUnit.Mysql;
  
  constructor(mySQL?: MySqlUnit.MySqlConfig) {
    mySQL = Object.assign(MySqlUnit.mysqlOptions, db, mySQL);
    this.mySQL = new MySqlUnit.Mysql(mySQL);
  }

  insertSql(options: InsertOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { table, kv } = options;
      let keys: string[] = [];
      let values: myType[] = [];
      for (let [key, value] of Object.entries(kv)) {
        keys.push(`\`${key}\``);
        values.push(value);
      }
      let sql = `INSERT INTO \`${table}\` (${keys.join(',')}) VALUES (${keys.fill('?').join(',')})`;
      console.log(sql, values);
      resolve({ sql, values });
    })
  }

  deleteSql(options: DeleteOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { table, where, wherekv, BINARY = false } = options;
      let { limit, values } = matching<T>(wherekv, where, BINARY);

      let sql = `DELETE FROM \`${table}\` ${limit}`;
      console.log(sql, values);
      resolve({ sql, values });
    })
  }

  updateSql(options: UpdateOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { table, kv, where, wherekv, BINARY = false } = options;
      let { limit, values } = matching<T>(wherekv, where, BINARY);

      let keys = Object.keys(kv).map(key => `\`${key}\` = ?`);
      values = [...Object.values(kv).map(value => value), ...values];

      let sql = `UPDATE \`${table}\` SET ${keys} ${limit}`
      console.log(sql, values);
      resolve({ sql, values });
    })
  }

  selectSql(options: SelectOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { table, fieldkv = [], field, where, wherekv, BINARY = false, LIMIT, ORDERarr = [], ORDER } = options;
      let { limit, values } = matching<T>(wherekv, where, BINARY);
      let ORDERFeilds: string;
      let columnName: string;
      let oLIMIT: string;

      columnName = field ? field : fieldkv.length === 0 ? '*' : fieldkv.map(value => `\`${value}\``).join(', ');

      oLIMIT = LIMIT ? `LIMIT ${LIMIT.start}, ${LIMIT.length}` : '';

      ORDERFeilds = ORDER ? `ORDER BY ${ORDER}` : ORDERarr.length > 0 ? `ORDER BY ${jsonParser([ORDERarr.join()]).map(obj => {
        let { feild, DESC } = obj;
        return DESC ? feild.map(value => `\`${value}\` DESC`).join(', ') : feild.map(value => `\`${value}\` ASC`).join(', ');
      }).join(', ')}` : '';

      let sql = `SELECT ${columnName} FROM \`${table}\` ${limit} ${ORDERFeilds} ${oLIMIT}`;
      console.log(sql, values);
      resolve({ sql, values });
    })
  }

  insert(options: InsertOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      // let { table, kv } = options;
      // let keys: string[] = [];
      // let values: myType[] = [];
      // for (let [key, value] of Object.entries(kv)) {
      //   keys.push(`\`${key}\``);
      //   values.push(value);
      // }
      // this.INSERT = `INSERT INTO \`${table}\` (${keys.join(',')}) VALUES (${keys.fill('?').join(',')})`;
      let { sql, values } = await this.insertSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);
      resolve(result);
    });
  }

  delete(options: DeleteOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      // let { table, where, wherekv, BINARY = false } = options;
      // let { limit, values } = matching<T>(wherekv, where, BINARY);

      // this.DELETE = `DELETE FROM \`${table}\` ${limit}`;
      // console.log(this.DELETE, values);
      let { sql, values } = await this.deleteSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);
      resolve(result);
    });
  }

  update(options: UpdateOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      // let { table, kv, where, wherekv, BINARY = false } = options;
      // let { limit, values } = matching<T>(wherekv, where, BINARY);

      // let keys = Object.keys(kv).map(key => `\`${key}\` = ?`);
      // values = [...Object.values(kv).map(value => value), ...values];

      // this.UPDATE = `UPDATE \`${table}\` SET ${keys} ${limit}`
      // console.log(this.UPDATE, values);

      let { sql, values } = await this.updateSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);

      resolve(result);
    });
  }

  select(options: SelectOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      // let { table, fieldkv = [], feild, where, wherekv, BINARY = false, LIMIT, ORDERarr = [], ORDER } = options;
      // let { limit, values } = matching<T>(wherekv, where, BINARY);
      // let ORDERFeilds: string;
      // let columnName: string;
      // let oLIMIT: string;

      // columnName = feild ? feild : fieldkv.length === 0 ? '*' : fieldkv.map(value => `\`${value}\``).join(', ');

      // oLIMIT = LIMIT ? `LIMIT ${LIMIT.start}, ${LIMIT.length}` : '';

      // ORDERFeilds = ORDER ? `ORDER BY ${ORDER}` : ORDERarr.length > 0 ? `ORDER BY ${jsonParser([ORDERarr.join()]).map(obj => {
      //   let { feild, DESC } = obj;
      //   return DESC ? feild.map(value => `\`${value}\` DESC`).join(', ') : feild.map(value => `\`${value}\` ASC`).join(', ');
      // }).join(', ')}` : '';

      // this.SELECT = `SELECT ${columnName} FROM \`${table}\` ${limit} ${ORDERFeilds} ${oLIMIT}`;
      // console.log(this.SELECT, values);
      let { sql, values } = await this.selectSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);
      resolve(result);
    });

  }

  private multipleInsert(conn: PoolConnection) {
    return async (options: InsertOptions<T>) => {
      let { sql, values } = await this.insertSql(options);
      let result = await this.mySQL.query(conn, sql, values);
      return result;
    }
  }

  private multipleDelete(conn: PoolConnection) {
    return async (options: DeleteOptions<T>) => {
      let { sql, values } = await this.deleteSql(options);
      let result = await this.mySQL.query(conn, sql, values);
      return result;
    }
  }

  private multipleUpdate(conn: PoolConnection) {
    return async (options: UpdateOptions<T>) => {
      let { sql, values } = await this.updateSql(options);
      let result = await this.mySQL.query(conn, sql, values);
      return result;
    }
  }

  private multipleSelect(conn: PoolConnection) {
    return async (options: SelectOptions<T>) => {
      let { sql, values } = await this.selectSql(options);
      let result = await this.mySQL.query(conn, sql, values);
      return result;
    }
  }

  private multipleRollback(conn: PoolConnection) {
    return async () => {
      await conn.rollback();
    }
  }

  multipleResult(callback: MultipleResultCallback<T>) {
    return new Promise(async (resolve, reject) => {
      let conn: PoolConnection = await this.mySQL.getConnection();
      try {
        let multipleInsert = this.multipleInsert(conn);
        let multipleDelete = this.multipleDelete(conn);
        let multipleUpdate = this.multipleUpdate(conn);
        let multipleSelect = this.multipleSelect(conn);

        let query: MultipleSql<T> = { multipleInsert, multipleDelete, multipleUpdate, multipleSelect };

        let result = await callback(query);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        this.mySQL.release(conn);
      }
    })
  }

  MultipleResultTransaction(callback: MultipleResultTransactionCallback<T>) {
    return new Promise(async (resolve, reject) => {
      let conn: PoolConnection = await this.mySQL.getConnection();
      try {
        let multipleInsert = this.multipleInsert(conn);
        let multipleDelete = this.multipleDelete(conn);
        let multipleUpdate = this.multipleUpdate(conn);
        let multipleSelect = this.multipleSelect(conn);
        let multipleRollback = this.multipleRollback(conn);
        let query: MultipleTransactionSql<T> = { multipleInsert, multipleDelete, multipleUpdate, multipleSelect, multipleRollback };
        let result = await callback(query);
        this.mySQL.commit(conn);
        resolve(result);
      } catch (error) {
        conn.rollback();
        reject(error);
      } finally {
        this.mySQL.release(conn);
      }
    })
  }

}
