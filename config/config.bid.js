// EGG_SERVER_ENV=prev 演示环境，用于演示

'use strict'
const path = require('path')
const commonFunction = require('./config.common')

const pageURL = 'http://123.126.105.33:6688'
const HttpPageURL = 'http://fuxi.haizhi.com'
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const commonConfig = commonFunction(appInfo)
  commonConfig['security']['domainWhiteList'].push(pageURL)
  commonConfig['security']['domainWhiteList'].push(HttpPageURL)
  commonConfig['mongoose'] = {
    client: {
      url: 'mongodb://127.0.0.1:29018/seatom-bid',
      options: {
        auth: {
          authSource: 'admin'
        },
        user: 'root',
        pass: 'haizhimongo',
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    }
  }
  commonConfig['serverIp'] = '123.126.105.33'
  commonConfig['webServerIp'] = pageURL
  commonConfig['cluster'] = {
    listen: {
      path: '',
      port: 7007,
      hostname: '0.0.0.0'
    }
  }
  commonConfig['dmcAddress'] = {
    address: 'http://dmc.haizhi.com', // 对接dmc地址，登录获取token基于该配置
    tassadar: 'http://172.16.34.42:19988', //tassadar地址
    // tassadar: "http://jdksh.qds.sd:19988",
    cipher: 'base64', // dmc登录时传输的密码加密方式，取值none, md5, smssl、base64，分别为不加密、md5、国密
    publicKey:
      '046d02ba2a33cd7b061ab63d2effdf7a672f021c491eaf7c71db5a9899342251df1a35290bcd444779d7923c56bb957932b5b5cdbf880fff5e28b0df794934add8', // 公钥，加密方式为国密时必须要填
    cipherMode: 1 // 1 - C1C3C2，0 - C1C2C3，默认为1，加密方式为国密时必须要填
  }
  commonConfig['componentUrl'] = ''
  commonConfig['logger'] = {
    dir: path.join(appInfo.baseDir, '../seatom-server-logs')
  }
  return {
    ...commonConfig
  }
}
