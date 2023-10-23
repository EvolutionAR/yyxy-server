const path = require('path')
const commonFunction = require('./config.common')
const pageURL = 'https://127.0.0.1' //  客户端访问的外网端口443
const HttpPageURL = 'http://127.0.0.1' // 客户端访问的外网端口80
module.exports = appInfo => {
  const commonConfig = commonFunction(appInfo)
  commonConfig['security']['domainWhiteList'].push(pageURL)
  commonConfig['security']['domainWhiteList'].push(HttpPageURL)
  // commonConfig['mongoose'] = {
  //   client: {
  //     url: 'mongodb://127.0.0.1:27017/seatom-win', // 数据库内网ip地址
  //     options: {
  //       useUnifiedTopology: true,
  //       useCreateIndex: true
  //     }
  //   }
  // }
  commonConfig['mongoose'] = {
    client: {
      url: 'mongodb://123.126.105.33:29018/seatom-win',
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
  commonConfig['serverIp'] = '127.0.0.1' //外网ip
  commonConfig['intranetIp'] = '127.0.0.1' //内网ip
  commonConfig['webServerIp'] = 'http://127.0.0.1:8888' // 内网前端8888端口
  commonConfig['errorHandler']['data']['authorizationTime'] = 1646647837828
  commonConfig['cluster'] = {
    listen: {
      path: '',
      port: 7001,
      hostname: '0.0.0.0'
    }
  }
  commonConfig['redis'] = {
    client: {
      port: 6379, // Redis port
      host: '127.0.0.1', // Redis host
      password: '',
      db: 0
    }
  }
  commonConfig['dmcAddress'] = {
    address: 'http://dmc.haizhi.com', // dmc的地址
    tassadar: 'http://dmc.haizhi.com:19988', // dmc的tassadar地址
    cipher: 'base64', // dmc登录时传输的密码加密方式，取值none, md5, smssl、base64，分别为不加密、md5、国密
    publicKey:
      '046d02ba2a33cd7b061ab63d2effdf7a672f021c491eaf7c71db5a9899342251df1a35290bcd444779d7923c56bb957932b5b5cdbf880fff5e28b0df794934add8', // 公钥，加密方式为国密时必须要填
    cipherMode: 1 // 1 - C1C3C2，0 - C1C2C3，默认为1，加密方式为国密时必须要填
  }
  commonConfig['componentUrl'] = 'https://127.0.0.1' // 外网访问的443端口
  commonConfig['logger'] = {
    dir: path.join(appInfo.baseDir, '../seatom-server-logs')
  }
  return {
    ...commonConfig
  }
}
