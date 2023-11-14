'use strict'
const Controller = require('egg').Controller
const { uuid, getResponseBody, getExpdate } = require('../extend/utils')
const fs = require('fs-extra')
const path = require('path')
class logController extends Controller {
  async create() {
    const { ctx, config } = this
    const body = ctx.request.body
    const data = await ctx.service.log.create(body)
    ctx.body = getResponseBody(data)
  }
  async index() {
    const { ctx } = this
    const body = ctx.request.body
    const data = await ctx.service.log.find(body)
    ctx.body = getResponseBody(data)
  }
  async update() {
    const { ctx } = this
    const id = ctx.query.id
    const body = ctx.request.body
    const data = await ctx.service.log.update({ id: id }, body)
    ctx.body = getResponseBody(data)
  }
  async delete() {
    const { ctx } = this
    const id = ctx.request.body.id
    const data = await ctx.service.log.delete({ id })
    ctx.body = getResponseBody(data)
  }
}

module.exports = logController
