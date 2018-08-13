import mysql, { Pool, PoolConnection, Connection } from "mysql";
import { myPromiseCatch } from "./myError";
import { resolve } from "url";

type conn = PoolConnection;
type myType = string | number | null | undefined;

export namespace MySqlUnit {
  export interface MySqlConfig {
    host?: string,
    port?: number,
    user?: string,
    password?: string,
    database?: string,
    debug?: boolean,
  }

  export let mysqlOptions: MySqlConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    debug: process.env.ENV !== 'production'
  };

  export class Mysql {
    private config: MySqlConfig = mysqlOptions;
    private pool: Pool;

    constructor(config: MySqlConfig = {}) {
      Object.assign(this.config, config);
      this.pool = mysql.createPool(this.config);
    }

    getConnection(): Promise<conn> {
      return myPromiseCatch(async (resolve, reject) => {
        this.pool.getConnection((err, connection) => {
          err ? reject(err) : resolve(connection);
        })
      });
    }

    query(connection: conn, sql: string, valueArray: myType[] = []) {
      return myPromiseCatch(async (resolve, reject) => {
        connection.query(sql, valueArray, (err, result) => {
          err ? reject(err) : resolve(result);
        })
      });
    }

    release(connection: conn) {
      return myPromiseCatch(async (resolve, reject) => {
        connection.release();
        resolve();
      });
    }

    result(sql: string, valueArray: myType[] = []) {
      return myPromiseCatch(async (resolve, reject) => {
        let connection: conn = await this.getConnection();
        let result = await this.query(connection, sql, valueArray);
        await this.release(connection);
        resolve(result);
      });
    }

    begin(connection: conn) {
      return myPromiseCatch((resolve, reject) => {
        connection.beginTransaction(err => {
          err ? reject(err) : resolve();
        })
      });
    }

    queryTransaction(connection: conn, sql: string, valueArray: myType[] = []) {
      return myPromiseCatch(async (resolve, reject) => {
        connection.query(sql, valueArray, (err, result) => {
          if (err) {
            connection.rollback();
            connection.release();
            reject(err);
          } else {
            resolve(result);
          }
        })
      });
    }

    commit(connection: conn) {
      return myPromiseCatch(async (resolve, reject) => {
        connection.commit(err => {
          err ? reject(err) : resolve();
        });
      });
    }

    resultTransaction(sql: string, valueArray: myType[] = []) {
      return myPromiseCatch(async (resolve, reject) => {
        let connection = await this.getConnection();
        await this.begin(connection);
        let result = await this.queryTransaction(connection, sql, valueArray);
        await this.commit(connection);
        await this.release(connection);
        resolve(result);
      });
    }

  }
}