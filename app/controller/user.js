'use strict'
const Controller = require('egg').Controller
const { uuid, getResponseBody, getExpdate } = require('../extend/utils')
const base64 = require('base-64')
const SeatomException = require('../exception/seatomException')
const { ERROR_CODES } = require('../extend/constant')
const { getPassword } = require('../extend/password-utils')
const {
  domainCity,
  userObj,
  userNameList
} = require('../extend/seatom-account')
const { cipher, decipher } = require('../extend/crypto')
const fs = require('fs-extra')
const path = require('path')
class userController extends Controller {

  async create() {
    const { ctx, config } = this
    const body = ctx.request.body
    const data = await ctx.service.user.create(body)
    ctx.body = getResponseBody(data)
  }

  async index() {
    const { ctx } = this
    const body = ctx.request.body
    const data = await ctx.service.user.find(body)
    ctx.body = getResponseBody(data)
  }


  async register() {
    const { ctx, config } = this
    const userName = ctx.request.body.userName
    const passWord = ctx.request.body.passWord
    const token = ctx.app.jwt.sign({ userName, passWord }, config.jwt.secret, {
      expiresIn: '18000s'
    })
    let a
    const decode = ctx.app.jwt.verify(token, config.jwt.secret)
    try {
      a = ctx.app.jwt.verify('eweqeweeqewewqe22222', config.jwt.secret)
    } catch (e) {}
    if (passWord === decode.passWord) {
    }
    ctx.body = getResponseBody(token)
  }
}

module.exports = userController
