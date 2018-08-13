import { Context } from "koa";
import * as log4js from "log4js";

export namespace myLog {
  const methods = ["trace", "debug", "info", "warn", "error", "fatal", "mark"];
  const baseInfo = {
    appLogLevel: 'debug',
    dir: 'logs',
    env: 'dev',
    projectName: '重庆铭贝科技有限公司',
    serverIp: '0.0.0.0'
  }

  export interface commonInfo {
    projectName?: string;
    serverIp?: string;
  }

  export function access(ctx: Context, message: any, commonInfo: commonInfo = {}, ) {
    const { method, url, host, headers } = ctx.request;
    const client = {
      method,
      url,
      host,
      message,
      referer: headers['referer'],
      userAgent: headers['user-agent'],
    }
    return JSON.stringify(Object.assign(commonInfo, client));
  }
  export function myLogger() {

  }
  export function log(options: Object = {}) {
    const contextLogger = {};
    const appenders = {};
    const opts = Object.assign({}, baseInfo, options);
    const { env, appLogLevel, dir, serverIp, projectName } = opts;
    const commonInfo = { projectName, serverIp };

    Object.defineProperty(appenders, 'cheese', {
      value: {
        type: 'dateFile',
        filename: `${dir}/task`,
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
      },
      enumerable: true,
    });

    if (env === 'dev' || env === 'cocal' || env === 'development') {
      (appenders as any).out = {
        type: 'console'
      }
    }

    let config = {
      appenders,
      categories: {
        default: {
          appenders: Object.keys(appenders),
          level: appLogLevel,
        }
      }
    }

    const logger = log4js.getLogger('chesese');
    
    return async (ctx: Context, next: () => Promise<any>) => {
      const start = Date.now();
      log4js.configure(config);
      methods.forEach((method) => {
        Object.defineProperty(contextLogger, method, {
          value: (message: any) => {
            (logger as any)[method](access(ctx, message, commonInfo));
          },
          enumerable: true,
          writable: true,
        })
      });
      ctx.state.log = contextLogger;

      await next();

      const responseTime = Date.now() - start;
      logger.info(access(ctx, {
        responseTime: `响应时间为${responseTime / 1000}s`,
      }, commonInfo));
    }
  }
}