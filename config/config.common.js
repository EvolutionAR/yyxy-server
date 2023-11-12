/*
 * @Description: egg config.common
 * @Date: 2022-11-14 15:20:30
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
// EGG_SERVER_ENV=common

'use strict'
const path = require('path')
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {})

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1606726319405_8082'
  config.publicPath = '' // 公共的前缀
  // add your middleware config here
  // config.redis = {
  //   client: {
  //     port: 6379, // Redis port
  //     host: '127.0.0.1', // Redis host
  //     password: '',
  //     db: 0
  //   },
  // }
  config.middleware = ['errorHandler', 'loginMiddleware']
  config.errorHandler = {
    data: {
      authorizationDays: 90,
      authorizationTime: 0
    },
    enable: true, // 控制中间件是否开启
    ignore: ['/api/packages', '/api/resource'] // 设置符合某些规则的请求不经过这个中间件。
  }
  console.log(config.publicPath)
  config.loginMiddleware = {
    enable: true, // 控制中间件是否开启。
    match: [
      config.publicPath + '/api/screen',
      config.publicPath + '/api/datastorage/getData'
    ]
    // 设置符合某些规则的请求经过这个中间件。
  }
  config.security = {
    xframe: {
      enable: false
    },
    domainWhiteList: [
      'http://127.0.0.1',
      'http://0.0.0.0:9999',
      'http://localhost:8088',
      'http://127.0.0.1:3005',
      'http://127.0.0.1:10010',
      'http://localhost:8088',
      'https://fuxi.haizhi.com',
      'http://123.126.105.6',
      'http://dmc.haizhi.com',
      'http://123.126.105.33:10096',
      'http://123.126.105.33:10086',
      'http://123.126.105.33:8810',
      'http://192.168.4.194:7001',
      'http://127.0.0.1:7001',
      'http://123.126.105.33:6670',
      'http://123.126.105.33:6677',
      'http://127.0.0.1:9999',
      'http://127.0.0.1:7001',
      'http://127.0.0.1:10000',
      'http://192.168.8.194:9999',
      'https://wwww.douyu.com',
      'http://127.0.0.1:8888',
      'http://123.126.105.33:1115',
      'http://192.168.8.92:9999',
      'http://127.0.0.1:8080',
      'https://dmc.haizhi.com'
    ], // 跨域访问白名单
    csrf: {
      enable: false,
      ignoreJSON: true
    }
  }
  config.jwt = {
    secret: 'seatom'
  }
  config.cors = {
    // origin: '*',
    credentials: true, // 允许跨域请求携带cookies
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS'
  }
  config.multipart = {
    mode: 'file',
    fieldSize: '1mb',
    fieldNameSize: 100, //字段名称长度限制
    fields: 50, //字段数量限制
    files: 10, //上传文件数量限制
    fileSize: '500mb', //文件上传的大小限制
    whitelist: [
      '.txt',
      '.png',
      '.jpg',
      '.jpeg',
      '.gz',
      '.zip',
      '.gif',
      '.svg',
      '.csv',
      '.xls',
      '.xlsx',
      '.webp',
      '.ttf',
      '.TTF',
      '.cj',
      '.otf',
      '.json',
      '.geojson',
      '.mp4',
      '.ogg',
      '.flv',
      '.avi',
      '.wmv',
      '.rmvb',
      '.webm',
      '.tgz',
      '.js',
      '.exe',
      '.pdf',
      '.doc',
      '.docx',
      '.xlsx',
      '.mp3',
      '.wav',
      '.midi',
      '.MP3',
      '.WAV',
      '.MIDI',
      '.glb',
      '.gltf',
      '.css',
      '.html',
      '.svg'
    ]
  }
  config.cluster = {
    listen: {
      path: '',
      port: 8001,
      hostname: '0.0.0.0'
    }
  }
  config.bodyParser = {
    // 值的大小可以根据自己的需求修改
    formLimit: '100mb',
    jsonLimit: '100mb',
    textLimit: '100mb'
  }
  config.static = {
    prefix: config.publicPath + '/public/',
    buffer: false // in prod env, false in other envs对静态数据不进行缓存
    // dir: path.join(appInfo.baseDir, '../seatom-resources'),
    // dynamic: true
  }

  config.mongoose = {
    client: {
      // url: 'mongodb://172.16.34.6:29018/seatom',
      // options:  { auth: {authSource: 'admin' }, user: 'root', pass: 'haizhimongo' ,useUnifiedTopology: true, useCreateIndex: true },
      url: 'mongodb://127.0.0.1:27017/seatom',
      options: { useUnifiedTopology: true, useCreateIndex: true }
      // mongoose global plugins, expected a function or an array of function and options
      // plugins: [createdPlugin, [updatedPlugin, pluginOptions]],
    }
  }

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    protocol: 'http',
    serverIp: '123.126.105.33', // 后台的地址
    webServerIp: 'http://123.126.105.33:8888', // 前端的地址
    componentUrl: '', // 组件信息的地址
    resourceDirName: 'seatom-resources', // 静态资源文件夹名称
    dmcAddress: {
      // address: 'http://dmc.haizhi.com',// 对接dmc地址，登录获取token基于该配置
      address: 'http://123.126.105.6', // 对接dmc地址，登录获取token基于该配置
      // tassadar: 'http://dmc.haizhi.com:19987', //tassadar地址
      tassadar: 'http://123.126.105.6:19988',
      version: '2.2.5',
      cipher: 'base64', // dmc登录时传输的密码加密方式，取值none, md5, smssl，分别为不加密、md5、国密
      publicKey:
        '046d02ba2a33cd7b061ab63d2effdf7a672f021c491eaf7c71db5a9899342251df1a35290bcd444779d7923c56bb957932b5b5cdbf880fff5e28b0df794934add8', // 公钥，加密方式为国密时必须要填
      cipherMode: 1 // 1 - C1C3C2，0 - C1C2C3，默认为1，加密方式为国密时必须要填
    }
  }
  userConfig.resourcePath = path.join(
    appInfo.baseDir,
    '../' + userConfig.resourceDirName
  ) // 静态资源路径

  userConfig.dmcTimeout = 200000 // 发往dmc的请求的超时时间

  config.logger = {
    dir: path.join(appInfo.baseDir, '../seatom-server-logs')
  }

  config.static.dir = userConfig.resourcePath
  config.io = {
    // options:{
    //   path: '/api/pppp'
    // },
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
    }
  }

  config.validate = {
    // convert: false,
    // validateRoot: false,
  }

  /**
   * 配置swagger
   * @property {String} dirScanner - 插件扫描的文档路径
   * @property {String} basePath - api前置路由
   * @property {Object} apiInfo - 可参考Swagger文档中的Info
   * @property {Array[String]} apiInfo - 可参考Swagger文档中的Info
   * @property {Array[String]} schemes - 访问地址协议http或者https
   * @property {Array[String]} consumes - contentType的集合
   * @property {Array[String]} produces - contentType的集合
   * @property {Object} securityDefinitions - 安全验证，具体参考swagger官方文档
   * @property {Boolean} enableSecurity - 是否使用安全验证
   * @property {Boolean} routeMap - 是否自动生成route
   * @property {Boolean} enable - swagger-ui是否可以访问
   */
  exports.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'seatom-server-swagger',
      description: 'swagger-ui for egg',
      version: '1.0.0'
    },
    host: '',
    basePath: '/api',
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      // apikey: {
      //   type: 'apiKey',
      //   name: 'clientkey',
      //   in: 'header',
      // },
      // oauth2: {
      //   type: 'oauth2',
      //   tokenUrl: 'http://petstore.swagger.io/oauth/dialog',
      //   flow: 'password',
      //   scopes: {
      //     'write:access_token': 'write access_token',
      //     'read:access_token': 'read access_token',
      //   },
      // },
    },
    enableSecurity: false,
    // enableValidate: true,
    routerMap: false,
    enable: true
  }

  return {
    ...config,
    ...userConfig
  }
}
