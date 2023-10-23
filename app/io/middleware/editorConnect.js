/*
 * @Description: 编辑连接
 * @Date: 2022-11-14 11:03:10
 * @Author: chenxingyu
 * @LastEditors: chenxingyu
 */
const { getLoggerModel } = require('../../extend/utils')
const {
  getCoeditRoomInfoBySocketId,
  getCoeditUsersByScreenId
} = require('../../utils/coedit')

module.exports = app => {
  return async (ctx, next) => {
    // 获取协同房间信息
    const getRootRoom = async () => {
      return JSON.parse(
        (await ctx.app.redis.get('screenCoeditRooms')) ||
          JSON.stringify({
            screenRooms: {},
            scenePageRooms: {}
          })
      )
    }
    // 权限校验通过
    let rootRoom = await getRootRoom()

    const editorNsp = ctx.app.io.of('/editor')

    // 所有连接着的socket id
    const sids = [ctx.id, ...Object.keys(editorNsp.adapter.sids)]

    // 删除房间
    const deleteRoomsByIf = (rootRoom, ifFn) => {
      let hasDelete = false

      const deleteAction = rooms => {
        // 删除大屏
        for (const key in rooms) {
          const room = rooms[key]
          let len = room.length - 1
          while (len >= 0) {
            if (room[len] && ifFn(room[len].socketId)) {
              room.splice(len, 1)

              if (room.length === 0) {
                delete rooms[key]
              }
              hasDelete = true
            }
            len--
          }
        }
      }

      // 删除大屏
      deleteAction(rootRoom.screenRooms)

      // 删除场景大屏页面
      deleteAction(rootRoom.scenePageRooms)

      return {
        hasDelete
      }
    }

    let deleteRes = deleteRoomsByIf(rootRoom, sid => {
      return sids.includes(sid) === false
    })

    // console.log('clients', editorNsp.clients())
    // console.log('sids', Object.keys(editorNsp.adapter.sids))
    // console.log('ctx.client.sockets', ctx.client.sockets)
    // console.log('ctx.app.io.sockets.sockets', ctx.app.io.sockets.sockets)
    // console.log('=========')

    if (deleteRes.hasDelete) {
      await ctx.app.redis.set('screenCoeditRooms', JSON.stringify(rootRoom))
    }

    // 链接成功同步
    ctx.socket.emit('allScreenCoeditList', rootRoom.screenRooms)

    ctx.logger.info(
      getLoggerModel({
        message: 'editor socket connect',
        data: {
          id: ctx.id
        }
      })
    )

    // 放行
    await next()

    // 断开连接处理
    rootRoom = await getRootRoom()

    const currentRoom = getCoeditRoomInfoBySocketId(
      rootRoom.scenePageRooms,
      ctx.id
    )

    // 删除 ctx.id 数据
    deleteRes = deleteRoomsByIf(rootRoom, sid => {
      return sid === ctx.id
    })

    // 断线广播
    editorNsp.emit('allScreenCoeditList', rootRoom.screenRooms)

    if (currentRoom) {
      editorNsp
        .to(`screen-editor-${currentRoom.screenId}`)
        .emit('screenCoeditInfo', {
          screenId: currentRoom.screenId,
          screenType: currentRoom.screenType,
          coeditUsers: getCoeditUsersByScreenId(
            rootRoom.scenePageRooms,
            currentRoom.screenId
          )
        })
    }

    if (deleteRes.hasDelete) {
      await ctx.app.redis.set('screenCoeditRooms', JSON.stringify(rootRoom))
    }

    ctx.logger.info(
      getLoggerModel({
        message: 'editor socket disconnect',
        data: {
          id: ctx.id
        }
      })
    )

    console.log('断开连接')
  }
}
