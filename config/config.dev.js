// EGG_SERVER_ENV=prev 演示环境，用于演示

'use strict'
const path = require('path')
const commonFunction = require('./config.common')

const pageURL = 'http://127.0.0.1:9999'
const HttpPageURL = 'http://192.168.9.201'
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const commonConfig = commonFunction(appInfo)
  commonConfig['security']['domainWhiteList'].push(pageURL)
  commonConfig['security']['domainWhiteList'].push(HttpPageURL)
  commonConfig['mongoose'] = {
    client: {
      url: 'mongodb://127.0.0.1:27017/seatom-prev',
      //   auth: {
      //     authSource: 'admin'
      //   },
      options: {
        useUnifiedTopology: true,
        useCreateIndex: true
      }
    }
  }
  commonConfig['gdLogin'] =
    'https://yzh-test.gdgov.cn/api/aladdin-user/user-info' //对接数字广东登录接口
  commonConfig['gdMenu'] =
    'https://yzh-test.gdgov.cn/yzh-empower/api/aladdin-system/menu/buttons' //对接数字广东权限接口

  commonConfig['applist'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/myapp/list'
  commonConfig['capacitylist'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/capacity/zblist' // 指标列表接口
  commonConfig['capacityzb'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/capacity/info/zb'
  commonConfig['capacityapi'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/capacity/info/api'
  commonConfig['capacityzt'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/capacity/info/zt'
  commonConfig['getEnv'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/env/info'

  commonConfig['getEnvId'] =
    'https://yzh-test.gdgov.cn/api/aladdin-system/platform-configuration/info' // 获取当前环境信息接口
  commonConfig['getpassIdInfo'] =
    'https://yzh-test.gdgov.cn/yzh-empower/enabler/app/info/passId' // 获取应用详情
  commonConfig['exchangeToken'] =
    'https://yzh-test.gdgov.cn/api/aladdin-auth/oauth/exchange-token' // 获取应用详情

  commonConfig['clientid'] =
    'dG9vbHMtaHprc2g6ODc5YTdkYTgtMzNiYS0wOTA5LWZmMGQtMDQ4MTUzZWIzMjM4'

  commonConfig['serverIp'] = '192.168.4.108'
  commonConfig['webServerIp'] = pageURL
  commonConfig['intranetIp'] = '127.0.0.1'
  commonConfig['cluster'] = {
    listen: {
      path: '',
      port: 7001,
      hostname: '0.0.0.0'
    }
  }
  commonConfig['dmcAddress'] = {
    address: 'https://dmc.haizhi.com', // 对接dmc地址，登录获取token基于该配置
    tassadar: 'http://dmc.haizhi.com:19988', //tassadar地址
    // tassadar: "http://jdksh.qds.sd:19988",
    cipher: 'base64', // dmc登录时传输的密码加密方式，取值none, md5, smssl、base64，分别为不加密、md5、国密
    publicKey:
      '046d02ba2a33cd7b061ab63d2effdf7a672f021c491eaf7c71db5a9899342251df1a35290bcd444779d7923c56bb957932b5b5cdbf880fff5e28b0df794934add8', // 公钥，加密方式为国密时必须要填
    cipherMode: 1 // 1 - C1C3C2，0 - C1C2C3，默认为1，加密方式为国密时必须要填
  }
  commonConfig['componentUrl'] = ''
  return {
    ...commonConfig
  }
}
