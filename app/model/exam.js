module.exports = app => {
    const mongoose = app.mongoose
    const Schema = mongoose.Schema
    const { getDate } = require('../extend/utils')
    const { randomId } = require('../extend/utils')
    const ExamSchema = new Schema(
      {
        id: { type: Number, default: () => randomId() }, // 学号
        studentId: { type: String}, // 学号
        name: { type: String, default: '' }, // 名字
        operationLog:{ type: String, default: '' }, // 操作日志
        filePath:{ type: String, default: '' }, // 语音文件地址
        errorType:{ type: String }, // 错误类型
        createdAt: { type: String }, // 创建时间
        updatedAt: { type: String }, // 更新时间
      },
      {
        timestamps: { currentTime: () => getDate() }
      }
    )
    return mongoose.model('Exam', ExamSchema)
  }
  