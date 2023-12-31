'use strict'
const Controller = require('egg').Controller
const { uuid, getResponseBody, getExpdate } = require('../extend/utils')
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
  async update() {
    const { ctx } = this
    const id = ctx.query.id
    const body = ctx.request.body
    const data = await ctx.service.user.update({ id: id }, body)
    ctx.body = getResponseBody(data)
  }
  async delete() {
    const { ctx } = this
    const id = ctx.request.body.id
    const data = await ctx.service.user.delete({ id })
    ctx.body = getResponseBody(data)
  }
}

module.exports = userController
