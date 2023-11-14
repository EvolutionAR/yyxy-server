const Service = require('egg').Service
const { getCommonProjection } = require('../extend/utils')
class LogsService extends Service {
  async find(filter, projection, options) {
    const res = await this.ctx.model.Log.find(
      filter,
      getCommonProjection(projection),
      options
    )
    return res
  }
  async findOne(conditions, projection, options) {
    const res = await this.ctx.model.Log.findOne(
      conditions,
      getCommonProjection(projection),
      options
    )
    return res
  }
  async create(params) {
    const res = await this.ctx.model.Log.create(params)
    return res
  }
  async delete(params) {
    const res = await this.ctx.model.Log.deleteOne(params)
    return res
  }
  async update(filter, params, options) {
    const res = await this.ctx.model.Log.update(filter, params, options)
    return res
  }
  async updateMany(filter, update) {
    const res = await this.ctx.model.Log.updateMany(filter, update)
    return res
  }
}

module.exports = LogsService
