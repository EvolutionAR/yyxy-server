'use strict'
const { ERROR_CODES } = require('../extend/constant')
const { getResponseBody, getExpdate } = require('../extend/utils')
const path = require('path')
const { cipher, decipher } = require('../extend/crypto')
const fs = require('fs-extra')
const JSSM4 = require('../extend/src/index')
module.exports = options => {
  return async function errorHandler(ctx, next) {
    try {
      // const filePath = path.join(__dirname, '..', '..', 'licence.txt')
      // const data = await fs.readFileSync(filePath, 'utf-8')
      // const decipherData = decipher(data).split('&&')[0]
      // // const decipherData = decipher(data)
      // const days = parseInt(decipherData)
      // const expdate = getExpdate(days)
      // if (days <= 0) {
      //   let go = -days
      //   ctx.body = getResponseBody(
      //     { authorizationDays: days, expdate },
      //     false,
      //     `产品授权已经过期${go}天`,
      //     455
      //   )
      //   return
      // }
      await next()
      // console.log(cipher(`900&&123.126.105.33`),'wwww')
    } catch (err) {
      // 所有的异常都会在app上出发一个error事件，框架会记录一条错误日志
      ctx.app.emit('error', err, ctx)
      var status = 400
      if (err.name == 'SeatomException' && err.code == 1) {
        status = ERROR_CODES.COOKIE_DESIRE
      }
      // 如果时生产环境的时候 500错误的详细错误内容不返回给客户端
      // const error = status === 500 && ctx.app.config.env === 'prod' ? '网络错误' : err.message;
      const error = err.message
      ctx.body = {
        message: error,
        code: status,
        success: false,
        data: []
      }
    }
  }
}
