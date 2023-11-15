module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const { getDate } = require('../extend/utils')
  const { randomId } = require('../extend/utils')
  const LogSchema = new Schema(
    {
      id: { type: Number, default: () => randomId() }, // 学号
      studentId: { type: String, required: true }, // 学号
      examId: { type: Number, required: true }, // 考试id
      content: { type: String, default: '' }, // 操作日志
      filePath: { type: String, default: '' }, // 语音文件地址
      errorType: { type: String, default: '' }, // 错误类型
      errorDetails: { type: String, default: '' }, // 错误详情
      deductPoints: { type: Number }, // 扣分
      createdAt: { type: String }, // 创建时间
      updatedAt: { type: String } // 更新时间
    },
    {
      timestamps: { currentTime: () => getDate() }
    }
  )
  return mongoose.model('Log', LogSchema)
}
