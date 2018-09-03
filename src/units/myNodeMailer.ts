import nodemailer from 'nodemailer';
import poolConfig from './mailConfig';
import { Attachment } from 'nodemailer/lib/mailer';
import { Readable } from 'stream';

let mailOptions = {
  from: "CP <1454419599@qq.com>",
  to: "a1454419599@163.com",
  subject: "最大TEST",
  text: "test---和各人--test",
  html: `
  <style>
  #content {
    position: relative;
    width: 900px;
    padding: 20px;
    margin: 0px auto;
    border-radius: 15px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  }
  h1 {
    text-align: center;
  }
  p {
    margin: 10px;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.1);
    color: #333;
    border-radius: 10px;
  }
  
  img {
    position: relative;
    width: 60%;
    margin: 10px 0;
    left: 50%;
    transform: translateX(-50%);
  }
  </style>
  <div id="content">
    <h1>-_- TEST -_-</h1>
    <h1>啊实打实的梵蒂冈电饭锅</h1>
    <img src='http://39.108.114.59/logo/aaa1_8-19-2018_29333284864167153_sky_lanterns_by_wlop-d7b5nfg.jpg'/>
    <img src="cid:123456"/>
    <p>drhgdkhgkeytuiyeu坚实的粉红色</p>
    <P>授权码是QQ邮箱推出的，用于登录第三方客户端的专用密码。
    适用于登录以下服务：POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务。
    温馨提醒：为了你的帐户安全，更改QQ密码以及独立密码会触发授权码过期，需要重新获取新的授权码登录。</P>
  </div>`,
  attachments: [
    {
      fileName: 'img1',
      path: './public/logo/80_2018-8-20_18861308173200553_greyhound_by_guweiz-da5c37k.jpg',
      cid: '123456'
    }
  ]
}

let user = '1454419599@qq.com';
let auth = {
  auth: {
    user,
    pass: 'ixdkgzadlrqfbagj'
  }
}



let sendMail = (addressee: string, subject: string, text: string, html: string | Readable, attachments?: Array<Attachment>) => {
  let addresser = "Addresser";
  let transporter = nodemailer.createTransport(Object.assign(auth, poolConfig));
  
  let mailOption = {
    from: `"${addresser}" <${user}>`,
    to: addressee,
    subject,
    text,
    html,
    attachments
  }
  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.error(err)
    }
    console.log(info)
  })
}

export default sendMail;