import fs from 'fs';
import MyType from '../units/myType';
import sendMail from '../units/myNodeMailer';
import ejs from 'ejs';
import WebSocket from 'ws';
import staticValue from '../static/staticValue';

type myCtx = MyType.myCtx;


let pushMessageController = {
  sendMail: async (ctx: myCtx) => {
    let {addressee, subject, text, html, attachments, content } = ctx.state.reqJson;
    addressee || (addressee = 'a1454419599@163.com');
    subject || (subject = "测试NodeMailer");
    text || (text = '进入QQ个人邮箱, 设置-账户-开启服务POP3/SMTP服务,并生成授权码,现在获取授权码需要验证手机号等.');
    let template = ejs.compile(fs.readFileSync(`${process.cwd()}/views/email.ejs`, 'utf8'));
    // html || (html = fs.createReadStream(`${process.cwd()}/views/email.html`));
    content = JSON.parse(content);
    html = template({
      title: content.title,
      p: content.p
    })
    attachments || (attachments = [
      {
        fileName: 'LOGO.png',
        path: `${process.cwd()}/public/img/500x50.png`,
        cid: 'logo'
      },
      {
        fileName: '001.jpg',
        path: `${process.cwd()}/public/logo/80_2018-8-20_18861308173200553_greyhound_by_guweiz-da5c37k.jpg`,
        cid: '001'
      }
    ])
    await sendMail(addressee, subject, text, html, attachments);
    console.log('>>>>>')
  },

  systemMessages: async (ctx: myCtx) => {
    
  }
};

export default pushMessageController;