/*
 * @Description: 这是***页面
 * @Date: 2022-11-22 14:37:05
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
const MessageModel = {
  // 收消息的用户id
  userId: { type: 'string', required: false, description: '接收消息的用户id' },
  type: {
    type: 'string',
    required: false,
    enum: ['usershare', 'common', 'screenCoedit'],
    default: 'common',
    description: '消息类型'
  },
  isRead: { type: 'boolean', default: false, description: '消息是否已读' },
  content: { type: 'MessageContent', description: '消息内容' }
}

module.exports = {
  MessageContentUsershare: {
    usershareId: { type: 'number' }
  },
  MessageContentCommon: {
    commonContent: { type: 'string', default: '' }
  },
  MessageContentScreenCoedit: {
    // 协同ID
    coeditId: { type: 'number', description: '协同ID' },
    // 动作add-添加到协同，update-更新协同角色，remove-移除协同
    action: {
      type: 'string',
      enum: ['add', 'update', 'remove'],
      default: 'add',
      description: '动作add-添加到协同，update-更新协同角色，remove-移除协同'
    },
    // 协同大屏ID
    coeditScreenId: { type: 'number', description: '协同大屏ID' },
    // 创建者ID
    createUserId: { type: 'string', default: '', description: '创建者ID' },
    // 协作用户ID
    coeditUserId: { type: 'string', default: '', description: '协作用户ID' },
    // 协同编辑角色
    coeditRole: {
      type: 'string',
      // viewers-查看者，collaborators-协作者
      enum: ['viewers', 'collaborators'],
      default: 'viewers',
      description: '协同编辑角色 viewers-查看者，collaborators-协作者'
    }
  },
  MessageContent: {
    // 用户分享复制大屏
    usershare: {
      type: 'MessageContentUsershare'
      // usershareId: { type: 'number' }
    },
    common: {
      type: 'MessageContentCommon'
      // commonContent: { type: 'string', default: '' }
    },
    // 协同编辑
    screenCoedit: {
      type: 'MessageContentScreenCoedit'
    }
  },
  MessageModel: MessageModel,

  MessageAndIdModel: {
    id: { type: 'number', description: '消息ID' },
    ...MessageModel,
    createdAt: { type: 'string' },
    updatedAt: { type: 'string' }
  },

  messageListBody: {
    id: { type: 'number', description: '消息ID' },
    // 收消息的用户id
    userId: MessageModel.userId,
    type: MessageModel.type,
    isRead: MessageModel.isRead
  },

  // 成功响应体
  messageListSuccessResponse: {
    success: {
      type: 'boolean',
      example: true,
      description: '成功'
    },
    code: { type: 'number', example: 200, description: '状态码' },
    message: { type: 'string', example: '请求成功', description: '消息' },
    data: {
      type: 'array',
      itemType: 'MessageAndIdModel',
      description: '返回数据'
    }
  }
}
