const Service = require('egg').Service
const { getCommonProjection } = require('../extend/utils')
class ExamsService extends Service {
  async find(filter, projection, options) {
    const res = await this.ctx.model.Exam.find(
      filter,
      getCommonProjection(projection),
      options
    )
    return res
  }
  async findOne(conditions, projection, options) {
    const res = await this.ctx.model.Exam.findOne(
      conditions,
      getCommonProjection(projection),
      options
    )
    return res
  }
  async create(params) {
    const res = await this.ctx.model.Exam.create(params)
    return res
  }
  async delete(params) {
    const res = await this.ctx.model.Exam.deleteOne(params)
    return res
  }
  async update(filter, params, options) {
    const res = await this.ctx.model.Exam.update(filter, params, options)
    return res
  }
  async updateMany(filter, update) {
    const res = await this.ctx.model.Exam.updateMany(filter, update)
    return res
  }
}

module.exports = ExamsService
