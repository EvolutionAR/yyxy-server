/*
 * @Description: 这是***页面
 * @Date: 2022-11-22 11:08:16
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */

const screencoedit = require('./screencoedit')
const message = require('./message')

module.exports = {
  ...screencoedit,
  ...message,

  basePage: {
    page: { type: 'number', required: true, example: 1 },
    pageSize: { type: 'number', required: true, example: 20 }
  },

  idBody: {
    id: { type: 'number', required: true, example: 1, description: 'id 唯一键' }
  },

  // 默认接口类型
  baseResponse: {
    //@response 200 baseResponse 操作结果，名字与相应结果对应
    success: { type: 'boolean' }, // 结果
    results: { type: 'string' } // 服务器返回的数据
  },

  // 成功响应体
  successResponse: {
    success: {
      type: 'boolean',
      example: true,
      description: '成功'
    },
    code: { type: 'number', example: 200, description: '状态码' },
    message: { type: 'string', example: '请求成功', description: '消息' },
    data: { type: 'string', example: 'null', description: '返回数据' }
  },
  // 失败响应体
  errorResponse: {
    success: {
      type: 'boolean',
      example: false,
      description: '失败'
    },
    code: { type: 'number', example: 400, description: '状态码' },
    message: { type: 'string', example: '请求失败', description: '消息' },
    data: { type: 'string', example: 'null', description: '返回数据' }
  }
}
