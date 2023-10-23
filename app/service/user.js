const Service = require('egg').Service
const { getCommonProjection } = require('../extend/utils')
class UsersService extends Service {
  async find(filter, projection, options) {
    const res = await this.ctx.model.User.find(
      filter,
      getCommonProjection(projection),
      options
    )
    return res
  }
  async findOne(conditions, projection, options) {
    const res = await this.ctx.model.User.findOne(
      conditions,
      getCommonProjection(projection),
      options
    )
    return res
  }
  async create(params) {
    const res = await this.ctx.model.User.create(params)
    return res
  }
  async delete(params) {
    const res = await this.ctx.model.User.deleteOne(params)
    return res
  }
  async update(filter, params, options) {
    const res = await this.ctx.model.User.update(filter, params, options)
    return res
  }
  async updateMany(filter, update) {
    const res = await this.ctx.model.User.updateMany(filter, update)
    return res
  }
}

module.exports = UsersService
