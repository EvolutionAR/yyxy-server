/*
 * @Description: 插件
 * @Date: 2022-11-07 10:28:13
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
'use strict'

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true
  },
  cors: {
    enable: true,
    package: 'egg-cors'
  },
  mongoose: {
    enable: true,
    package: 'egg-mongoose'
  },
  io: {
    enable: true,
    package: 'egg-socket.io'
  },
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },
  redis: {
    enable: true,
    package: 'egg-redis'
  },
  swaggerdoc: {
    enable: true,
    package: 'egg-swagger-doc'
  },
  validate: {
    enable: true,
    package: 'egg-validate'
  }
}
