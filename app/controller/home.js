'use strict'
const _ = require('lodash')
const Controller = require('egg').Controller
const fs = require('fs-extra')
const alasql = require('alasql')
const path = require('path')
const { getResponseBody, uuid } = require('../extend/utils')
class HomeController extends Controller {
  async index() {
    const {ctx,config} = this
    ctx.body = '嗨，欢迎来到 seatom 的世界, seatom的后台服务启动啦1'
  }
}

module.exports = HomeController
