module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const { getDate } = require('../extend/utils')
  const { randomId } = require('../extend/utils')
  const ExamSchema = new Schema(
    {
      id: { type: Number, default: () => randomId() }, // 学号
      studentId: { type: String, required: true }, // 学号
      name: { type: String, default: '' }, // 名字
      examLevel: { type: String, default: '' },
      score: { type: Number },
      comment: { type: String, default: '' },
      createdAt: { type: String }, // 创建时间
      updatedAt: { type: String } // 更新时间
    },
    {
      timestamps: { currentTime: () => getDate() }
    }
  )
  return mongoose.model('Exam', ExamSchema)
}
