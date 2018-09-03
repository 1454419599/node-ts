import fs from 'fs';
import * as ws from 'ws';
import util from 'util';
import mime from 'mime';

import webSocketServer from '../server/webSocketServer';
import MyType from '../units/myType';
import MyFun from '../units/myFun';
import StaticValue from '..//static/staticValue';

type myCtx = MyType.myCtx;
type myWSCtx = MyType.myWSCtx;

let clientsArr: Array<any> = [];

export default {
  systemMessage: async (ctx: myCtx) => {
    let websocket = (ctx as myWSCtx).websocket;
    let info = (ctx.session as MyType.mySession).info;
    clientsArr.push(websocket)
    console.log(clientsArr.length);
    console.log('systemMessage => ');
    console.log('binaryType => ', websocket.binaryType)
    console.log('bufferedAmount => ', websocket.bufferedAmount)
    console.log('emit => ', websocket.emit('message'))
    console.log('eventNames => ', websocket.eventNames())
    console.log('extensions => ', websocket.extensions)
    console.log('getMaxListeners => ', websocket.getMaxListeners())
    websocket.setMaxListeners(100)
    console.log('getMaxListeners => ', websocket.getMaxListeners())
    console.log('listenerCount => ', websocket.listenerCount('message'))
    console.log('listeners => ', websocket.listeners('message'))
    console.log('url => ', websocket.url)
    /* console.log(util.inspect(websocket, {
      depth: null,
      colors: true,
      maxArrayLength: null
    })) */
    console.log(ctx.path);

    console.log('session => ', info)
    // console.log(ctx)
    // console.log(info.info)
    try {
      websocket.addEventListener('message', ({ data, type, target }) => {
        console.log(data, type, clientsArr.length);
        data = `<p class="time">${new Date().toLocaleString()}</p class="time"><span class="userName">${info.userName}</span>: </br>${data}`;
        (clientsArr as ws[]).forEach(client => {
          client.send(data)
        });
      });
      // websocket.on('message', (message) => {
      //   console.log(message);
      // });

      websocket.on('error', (err: any) => {
        console.log(err);
      });

      websocket.on('close', (code, reason) => {
        console.log('reason => :', reason)
        console.log('close', code, reason);
        let index = clientsArr.findIndex(value => value === websocket);
        clientsArr.splice(index, 1);
        console.log(clientsArr.length);
      });

      websocket.on('ping', data => {
        console.log('ping => ', data)
      });

      websocket.on('pong', data => {
        console.log('pong', data)
        console.log(data.toString('utf8'))
      });

      websocket.on('unexpected-response', (request, response) => {
        console.log('unexpected-response', request, response);
      });

      websocket.on('upgrade', (request) => {
        console.log('upgrade => ',request);
      })

      websocket.send(fs.readFileSync(`${process.cwd()}/public/img/500x50.png`))

    } catch (error) {

    }
  }
}