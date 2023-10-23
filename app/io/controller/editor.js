/*
 * @Description: 编辑页socket Io
 * @Date: 2022-11-14 15:20:52
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
const Controller = require('egg').Controller
const isFunction = require('lodash/isFunction')
const { getLoggerModel } = require('../../extend/utils')
const { getCoeditUsersByScreenId } = require('../../utils/coedit')

const empty = () => {}

class EditorController extends Controller {
  // 加入大屏
  async joinScreen() {
    const { app, socket, logger } = this.ctx

    const params = this.ctx.args[0] || {}
    const callback = isFunction(this.ctx.args[1]) ? this.ctx.args[1] : empty

    try {
      // 房间名
      const room = `screen-editor-${params.screenId}`
      // 场景大屏
      const isSceneScreen = params.screenType === 'scene'

      const rootRoom = (await this.service.cacheservice.get(
        'screenCoeditRooms'
      )) || {
        screenRooms: {},
        scenePageRooms: {}
      }

      if (!rootRoom.screenRooms[room]) {
        rootRoom.screenRooms[room] = []
      }

      // 如果这个房间已存在
      if (socket.nsp.adapter.rooms[room]) {
        const sockets = socket.nsp.adapter.rooms[room].sockets

        const coeditUsers = []

        for (const id in sockets) {
          const data = rootRoom.screenRooms[room].find(item => {
            return item.socketId === id
          })
          coeditUsers.push({
            ...data
          })
        }

        let index
        let message
        // 场景大屏
        if (isSceneScreen) {
          index = coeditUsers.findIndex(user => {
            return user.socketId === socket.id
          })
          message = '你正在编辑中，无需重复进入'
        } else {
          index = coeditUsers.findIndex(user => {
            return user.screenId === params.screenId
          })
          message = '已有用户正在编辑'
        }

        if (index !== -1) {
          const res = {
            success: false,
            message: message,
            coeditUsers
          }
          callback(res)

          logger.info(
            getLoggerModel({
              message: 'joinScreenFail',
              data: {
                params,
                res
              }
            })
          )
          return
        }
      }

      // 加入房间
      socket.join(room)

      // 缓存数据
      if (rootRoom.screenRooms[room]) {
        rootRoom.screenRooms[room].push({
          ...params,
          socketId: socket.id
        })
      }

      await this.service.cacheservice.set('screenCoeditRooms', rootRoom)

      // 连同自己一起广播
      const editorNsp = this.ctx.app.io.of('/editor')
      editorNsp.emit('allScreenCoeditList', rootRoom.screenRooms)

      // 场景大屏
      if (isSceneScreen) {
        //  发送给自己
        socket.emit('screenCoeditInfo', {
          screenId: params.screenId,
          screenType: 'scene',
          coeditUsers: getCoeditUsersByScreenId(
            rootRoom.scenePageRooms,
            params.screenId
          )
        })
      }

      callback({
        success: true,
        message: '加入成功'
      })

      logger.info(
        getLoggerModel({
          message: 'joinScreenSuccess',
          data: {
            params
          }
        })
      )
    } catch (error) {
      callback({
        success: false,
        message: error.toString()
      })

      logger.info(
        getLoggerModel({
          message: 'joinScreenError',
          data: {
            params,
            error
          }
        })
      )
    }
  }

  // 退出大屏
  async exitScreen() {
    const { app, socket, logger } = this.ctx
    const params = this.ctx.args[0] || {}
    const callback = isFunction(this.ctx.args[1]) ? this.ctx.args[1] : empty

    try {
      // 房间名
      const room = `screen-editor-${params.screenId}`

      // 检查是否在房间内
      if (!socket.nsp.adapter.rooms[room]) {
        const res = {
          success: false,
          message: '请先加入房间'
        }
        callback(res)

        logger.info(
          getLoggerModel({
            message: 'exitScreenFail',
            data: {
              params,
              res
            }
          })
        )
        return
      }

      const rootRoom =
        (await this.service.cacheservice.get('screenCoeditRooms')) || {}

      const index = rootRoom.screenRooms[room].findIndex(item => {
        return item.userId === params.userId
      })

      if (index !== -1) {
        rootRoom.screenRooms[room].splice(index, 1)

        if (rootRoom.screenRooms[room].length === 0) {
          delete rootRoom.screenRooms[room]
        }
        await this.service.cacheservice.set('screenCoeditRooms', rootRoom)
      }

      // 离开房间
      socket.leave(room)

      // 连同自己一起广播
      const editorNsp = this.ctx.app.io.of('/editor')
      editorNsp.emit('allScreenCoeditList', rootRoom.screenRooms)

      callback({
        success: true,
        message: '退出成功'
      })

      logger.info(
        getLoggerModel({
          message: 'exitScreenSuccess',
          data: {
            params
          }
        })
      )
    } catch (error) {
      callback({
        success: false,
        message: error.toString()
      })

      logger.info(
        getLoggerModel({
          message: 'exitScreenError',
          data: {
            params,
            error
          }
        })
      )
    }
  }

  // 加入场景页面
  async joinScenePage() {
    const { app, socket, logger } = this.ctx
    const params = this.ctx.args[0] || {}
    const callback = isFunction(this.ctx.args[1]) ? this.ctx.args[1] : empty

    try {
      // 房间名
      const room = `screen-editor-${params.screenId}-${params.pageId}`

      const rootRoom =
        (await this.service.cacheservice.get('screenCoeditRooms')) || {}

      if (!rootRoom.scenePageRooms[room]) {
        rootRoom.scenePageRooms[room] = []
      }

      // 如果这个房间已存在
      if (socket.nsp.adapter.rooms[room]) {
        const sockets = socket.nsp.adapter.rooms[room].sockets

        const coeditUsers = []

        for (const id in sockets) {
          const data = rootRoom.scenePageRooms[room].find(item => {
            return item.socketId === id
          })
          coeditUsers.push({
            ...data
          })
        }

        const index = coeditUsers.findIndex(user => {
          return user.pageId === params.pageId
        })

        if (index !== -1) {
          const res = {
            success: false,
            message: '已有用户正在编辑',
            coeditUsers
          }

          callback(res)

          logger.info(
            getLoggerModel({
              message: 'joinScenePageFail',
              data: {
                params,
                res
              }
            })
          )
          return
        }
      }

      // 加入房间
      socket.join(room)

      // 缓存数据
      if (rootRoom.scenePageRooms[room]) {
        rootRoom.scenePageRooms[room].push({
          ...params,
          socketId: socket.id
        })
      }

      await this.service.cacheservice.set('screenCoeditRooms', rootRoom)

      // 广播
      this.ctx.app.io
        .of('/editor')
        .to(`screen-editor-${params.screenId}`)
        .emit('screenCoeditInfo', {
          screenId: params.screenId,
          screenType: 'scene',
          coeditUsers: getCoeditUsersByScreenId(
            rootRoom.scenePageRooms,
            params.screenId
          )
        })

      callback({
        success: true,
        message: '加入成功'
      })

      logger.info(
        getLoggerModel({
          message: 'joinScenePageSuccess',
          data: {
            params
          }
        })
      )
    } catch (error) {
      callback({
        success: false,
        message: error.toString()
      })

      logger.info(
        getLoggerModel({
          message: 'joinScenePageError',
          data: {
            params,
            error
          }
        })
      )
    }
  }

  // 退出场景页面
  async exitScenePage() {
    const { app, socket, logger } = this.ctx
    const params = this.ctx.args[0] || {}
    const callback = isFunction(this.ctx.args[1]) ? this.ctx.args[1] : empty

    try {
      // 房间名
      const room = `screen-editor-${params.screenId}-${params.pageId}`

      // 检查是否在房间内
      if (!socket.nsp.adapter.rooms[room]) {
        const res = {
          success: false,
          message: '请先加入房间'
        }
        callback(res)

        logger.info(
          getLoggerModel({
            message: 'exitScenePageFail',
            data: {
              params,
              res
            }
          })
        )
        return
      }

      const rootRoom =
        (await this.service.cacheservice.get('screenCoeditRooms')) || {}

      const index = rootRoom.scenePageRooms[room].findIndex(item => {
        return item.userId === params.userId
      })

      if (index !== -1) {
        rootRoom.scenePageRooms[room].splice(index, 1)

        if (rootRoom.scenePageRooms[room].length === 0) {
          delete rootRoom.scenePageRooms[room]
        }

        await this.service.cacheservice.set('screenCoeditRooms', rootRoom)
      }

      // 离开房间
      socket.leave(room)

      // 广播
      this.ctx.app.io
        .of('/editor')
        .to(`screen-editor-${params.screenId}`)
        .emit('screenCoeditInfo', {
          screenId: params.screenId,
          screenType: 'scene',
          coeditUsers: getCoeditUsersByScreenId(
            rootRoom.scenePageRooms,
            params.screenId
          )
        })

      callback({
        success: true,
        message: '退出成功'
      })
      logger.info(
        getLoggerModel({
          message: 'exitScenePageSuccess',
          data: {
            params
          }
        })
      )
    } catch (error) {
      callback({
        success: false,
        message: error.toString()
      })

      logger.info(
        getLoggerModel({
          message: 'exitScenePageError',
          data: {
            params,
            error
          }
        })
      )
    }
  }
}

module.exports = EditorController
