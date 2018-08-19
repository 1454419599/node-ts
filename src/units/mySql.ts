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
  field: string[];
  DESC?: boolean;
}

export interface Where<T> {
  fields: T;
  isPrefix?: boolean;
  isOR?: boolean;
}

export interface MultipleSql<T extends myDbFeild> {
  conn: PoolConnection;
  multipleInsert: (options: InsertOptions<T>) => {};
  multipleDelete: (options: DeleteOptions<T>) => {};
  multipleUpdate: (options: UpdateOptions<T>) => {};
  multipleSelect: (options: SelectOptions<T>) => {};
  multipleQuery: (sql: string, values: Array<any>) => {};
  multipleUnionSelect: (options: SelectOptions<T>[], isAll?: boolean, limitOrder?: LimitOrder) => {};
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
  where?: Where<T> | string,
  BINARY?: boolean,
}

export interface UpdateOptions<T extends myDbFeild> extends InsertOptions<T>, DeleteOptions<T> { }

interface LimitOrder {
  LIMIT?: Limit;
  ORDER?: string;
  ORDERarr?: ORDER[];
}

export interface SelectOptions<T extends myDbFeild> extends DeleteOptions<T>, LimitOrder {
  fieldkv?: string[];
  field?: string;
}

export class MySql<T extends myDbFeild> {
  private mySQL: MySqlUnit.Mysql;
  
  constructor(mySQL?: MySqlUnit.MySqlConfig) {
    mySQL = Object.assign(MySqlUnit.mysqlOptions, db, mySQL);
    this.mySQL = new MySqlUnit.Mysql(mySQL);
  }

  query(conn: PoolConnection, sql: string, values: Array<any>) {
    return myPromiseCatch(async (resolve) => {
      let result = this.mySQL.query(conn, sql, values);
      resolve(result);
    })
  }

  private matching<T>(wherekv?: T, whereObj?: string | Where<T>, BINARY?: boolean) {
    return myPromiseCatch(async (resolve) => {
      let values: any = [];
      let limit: string = '';
      if (wherekv) {
        let keyValue = Object.entries(wherekv).map(([key, value]) => {
          values.push(value);
          return `\`${key}\` = ? `;
        });
        limit = `WHERE ${BINARY ? ' BINARY' : ''} (${keyValue.join(' AND ')})`;
      } else if (whereObj) {
        let w = whereObj;
        if (whereObj instanceof Object) {
          let { fields, isOR, isPrefix } = whereObj as Where<T>;
          w = await this.likeSql(fields as any, isPrefix, isOR);
        }
        limit = `WHERE ${BINARY ? ' BINARY' : ''} (${w})`;
      } else {
        limit = '';
      }
      resolve({ limit, values });
    })
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
      let { limit, values } = await this.matching<T>(wherekv, where, BINARY);

      let sql = `DELETE FROM \`${table}\` ${limit}`;
      console.log(sql, values);
      resolve({ sql, values });
    })
  }

  updateSql(options: UpdateOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { table, kv, where, wherekv, BINARY = false } = options;
      let { limit, values } = await this.matching<T>(wherekv, where, BINARY);

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
      let { limit, values } = await this.matching<T>(wherekv, where, BINARY);
      let ORDERFeilds: string;
      let columnName: string;
      let oLIMIT: string;

      columnName = field ? field : fieldkv.length === 0 ? '*' : fieldkv.map(value => `\`${value}\``).join(', ');

      oLIMIT = LIMIT ? `LIMIT ${LIMIT.start}, ${LIMIT.length}` : '';

      // ORDERFeilds = ORDER ? `ORDER BY ${ORDER}` : ORDERarr.length > 0 ? `ORDER BY ${jsonParser([ORDERarr.join()]).map(obj => {
      //   let { feild, DESC } = obj;
      //   return DESC ? feild.map(value => `\`${value}\` DESC`).join(', ') : feild.map(value => `\`${value}\` ASC`).join(', ');
      // }).join(', ')}` : '';
      let oredrStr = ORDERarr instanceof Array && ORDERarr.length > 0 ? ORDERarr.map(orders => {
        let { field, DESC } = orders;
        let fields: string[] = [];
        if (field instanceof Array && field.length != 0) {
          fields = field.map(values => `\`${values}\`${DESC ? ' DESC ' : ''}`)
        }
        return fields.join(', ');
      }).join(', ').trim() : '';

      ORDERFeilds = ORDER ? `ORDER BY ${ORDER}` : oredrStr ? `ORDER BY ${oredrStr}` : ``;

      let sql = `SELECT ${columnName} FROM \`${table}\` ${limit} ${ORDERFeilds} ${oLIMIT}`;
      console.log(sql, values);
      resolve({ sql, values });
    })
  }

  unionSelectSql(options: SelectOptions<T>[], isAll: boolean = false, limitOrder: LimitOrder = {}) {
    return myPromiseCatch(async (resolve) => {
      let sql: string = '';
      let values: Array<any> = [];
      if (options instanceof Array && options.length !== 0) {
        let sqls: string[] = [];
        let value: Array<any> = [];
        for (const option of options) {
          let { sql, values } = await this.selectSql(option);
          sqls.push(`(${sql})`);
          value.push(...values);
        }
        sql = isAll ? sqls.join(' UNION ALL ') : sqls.join(' UNION ');
        let { LIMIT, ORDERarr, ORDER } = limitOrder;
        let oLIMIT = LIMIT ? ` LIMIT ${LIMIT.start}, ${LIMIT.length}` : '';
        let oredrStr = ORDERarr instanceof Array && ORDERarr.length > 0 ? ORDERarr.map(orders => {
          let { field, DESC } = orders;
          let fields: string[] = [];
          if (field instanceof Array && field.length != 0) {
            fields = field.map(values => `\`${values}\`${DESC ? ' DESC ' : ''}`)
          }
          return fields.join(', ');
        }).join(', ').trim() : '';

        let ORDERFeilds = ORDER ? ` ORDER BY ${ORDER}` : oredrStr ? ` ORDER BY ${oredrStr}` : ``;
        sql = `${sql}${ORDERFeilds}${oLIMIT}`
      }
      console.log(sql, values)
      resolve({ sql, values });
    })
  }

  likeSql(wherekv: T, isPrefix: boolean = false, isOR: boolean = false) {
    return myPromiseCatch(async (resolve) => {
      let sql: string = '';
      if (wherekv instanceof Object) {
        let sqls: string[] = [];
        for (const [key, value] of Object.entries(wherekv)) {
          let sql = `\`${key}\` LIKE '${isPrefix ? '%' : ''}${value}%'`
          sqls.push(sql);
        }
        sql = sqls.join(isOR ? ' OR ' : ' AND ');
      }
      resolve(sql);
    });
  }

  insert(options: InsertOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { sql, values } = await this.insertSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);
      resolve(result);
    });
  }

  delete(options: DeleteOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
      let { sql, values } = await this.deleteSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);
      resolve(result);
    });
  }

  update(options: UpdateOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {

      let { sql, values } = await this.updateSql(options);
      let result = await this.mySQL.resultTransaction(sql, values);

      resolve(result);
    });
  }

  select(options: SelectOptions<T>) {
    return myPromiseCatch(async (resolve, reject) => {
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

  private multipleQuery(conn: PoolConnection) {
    return async (sql: string, values: Array<any>) => {
      let result = await this.mySQL.query(conn, sql, values);
      return result;
    }
  }

  private multipleUnionSelect(conn: PoolConnection) {
    return async (options: SelectOptions<T>[], isAll: boolean = false, limitOrder: LimitOrder = {}) => {
      let { sql, values } = await this.unionSelectSql(options, isAll, limitOrder);
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
        let multipleQuery = this.multipleQuery(conn);
        let multipleUnionSelect = this.multipleUnionSelect(conn);

        let query: MultipleSql<T> = { conn, multipleInsert, multipleDelete, multipleUpdate, multipleQuery, multipleSelect, multipleUnionSelect };

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
        let multipleQuery = this.multipleQuery(conn);
        let multipleUnionSelect = this.multipleUnionSelect(conn);
        let multipleRollback = this.multipleRollback(conn);
        let query: MultipleTransactionSql<T> = { conn, multipleInsert, multipleDelete, multipleUpdate, multipleSelect, multipleQuery, multipleRollback, multipleUnionSelect };
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
