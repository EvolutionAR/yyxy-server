/*
 * @Description: 这是***页面
 * @Date: 2022-11-22 11:20:06
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
module.exports = {
  CoeditUser: {
    userId: {
      type: 'string',
      required: true,
      example: '123',
      description: '用户ID'
    },
    role: {
      type: 'string',
      required: true,
      enum: ['viewers', 'collaborators'],
      example: 'collaborators',
      description: 'viewers-查看者，collaborators-协作组'
    }
  },

  // 创建、保存协同编辑共享信息
  postScreenCoeditSaveBody: {
    coeditId: {
      type: 'number',
      required: true,
      description: '协同ID，更新时传递',
      example: 111
    },
    coeditScreenId: {
      type: 'number',
      required: true,
      description: '协同大屏ID',
      example: 222
    },
    coeditUsers: {
      type: 'array',
      itemType: 'CoeditUser',
      required: true,
      description: '协同用户',
      example: [
        {
          userId: 123,
          role: 'collaborators'
        }
      ]
    }
  },

  screenCoeditListResponse: {
    list: { type: 'array', itemType: 'string' },
    page: { type: 'number', example: 1 },
    pageSize: { type: 'number', example: 20 },
    total: { type: 'number', example: 100 }
  },

  postScreencoeditMoveBody: {
    coeditId: {
      type: 'number',
      required: true,
      example: 1,
      description: '协同ID'
    },
    projectId: {
      type: 'number',
      required: true,
      example: 1,
      description: '要移动到的项目分组ID'
    }
  },

  CoeditingUser: {
    userId: {
      type: 'string',
      required: true,
      example: '123',
      description: '用户ID'
    },
    userName: {
      type: 'string',
      required: true,
      example: '123',
      description: '用户名称'
    },
    pageId: {
      type: 'number',
      required: false,
      example: 1,
      description: '页面ID，场景大屏才会返回'
    }
  },

  checkJoinScreenResponse: {
    screenId: {
      type: 'number',
      required: true,
      example: 1,
      description: '大屏ID'
    },
    screenType: {
      type: 'string',
      required: true,
      example: 'pc',
      description: '大屏类型'
    },
    coeditUser: {
      type: 'CoeditingUser',
      required: true,
      description: '协同编辑中的用户'
    }
  },

  checkJoinScreenSuccessResponse: {
    success: {
      type: 'boolean',
      example: true,
      description: '成功'
    },
    code: { type: 'number', example: 200, description: '状态码' },
    message: { type: 'string', example: '请求成功', description: '消息' },
    data: { type: 'checkJoinScreenResponse', description: '返回数据' }
  }
}
