// EGG_SERVER_ENV=test 测试环境，用于QA测试

'use strict'
const path = require('path')
const commonFunction = require('./config.common')

const pageURL = 'http://123.126.105.33:6670'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  const commonConfig = commonFunction(appInfo)
  commonConfig['security']['domainWhiteList'].push(pageURL)
  commonConfig['security']['domainWhiteList'].push('http://192.168.4.154:9999')
  commonConfig['mongoose'] = {
    client: {
      url: 'mongodb://127.0.0.1:29018/seatom-test',
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
  commonConfig['redis'] = {
    client: {
      port: 1679, // Redis port
      host: '127.0.0.1', // Redis host
      password: 'haizhi1234',
      db: 0
    }
  }
  commonConfig['serverIp'] = '123.126.105.33'
  commonConfig['intranetIp'] = '123.126.105.33'
  commonConfig['webServerIp'] = pageURL
  commonConfig['cluster'] = {
    listen: {
      path: '',
      port: 5001,
      hostname: '0.0.0.0'
    }
  }
  commonConfig['openInfo'] = {
    domain: 'haizhi',
    ip: 'http://123.126.105.107:8908',
    api: '/workbench/s/fuxi/checkApi'
  }
  commonConfig['logger'] = {
    dir: path.join(appInfo.baseDir, '../seatom-server-logs')
  }
  commonConfig['componentUrl'] = ''

  commonConfig['io'] = {
    init: {
      path: '/api/socket'
    },
    generateId: req => {
      return req._query.uid
    },
    namespace: {
      '/chat': {
        connectionMiddleware: ['auth'],
        packetMiddleware: []
      },
      '/editor': {
        connectionMiddleware: ['editorConnect'],
        packetMiddleware: []
      }
    },
    redis: {
      ...commonConfig['redis'].client,
      auth_pass: commonConfig['redis'].client.password,
      db: 1
    }
  }

  return {
    ...commonConfig
  }
}
