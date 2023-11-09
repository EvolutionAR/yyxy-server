module.exports = app => {
  const mongoose = app.mongoose
  const Schema = mongoose.Schema
  const { getDate } = require('../extend/utils')
  const { randomId } = require('../extend/utils')
  const UserSchema = new Schema(
    {
      id: { type: Number, default: () => randomId() }, // 学号
      studentId: { type: String}, // 学号
      name: { type: String, default: '' }, // 名字
      grade:{ type: String, enum: ['middleschool', 'highschool' , 'university', 'postgraduate'], default: 'university' }, // 年龄段
      ageGroup:{ type: String, default: '25以上' }, // 年龄段
      sex: { type: String, default: '' },  // 性别
      address: { type: String, default: '' }, // 地址
      phone: { type: String, default: '' }, // 电话号码
      email: { type: String, default: '' }, // 邮编
      passport: { type: String, default: '' }, // 护照
      nationality: { type: String, default: '' }, // 国籍
      chineseLevel: { type: String, default: '' }, // 中文水平
      createdAt: { type: String }, // 创建时间
      updatedAt: { type: String }, // 更新时间
    },
    {
      timestamps: { currentTime: () => getDate() }
    }
  )
  return mongoose.model('User', UserSchema)
}
