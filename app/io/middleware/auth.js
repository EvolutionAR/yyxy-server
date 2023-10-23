const _ = require('lodash')
module.exports = app => {
  return async (ctx, next) => {
    const { socket } = ctx
    const query = socket.handshake.query
    const { screenId, isControl, uid } = query
    const projection = {
      id: 0,
      _id: 0
    }
    const namespace = app.io.of('/chat')
    const clients = new Promise(function (success, error) {
      namespace.in(screenId).clients((err, clients) => {
        clients.push(socket.id)
        success(_.uniq(clients))
        error(err)
      })
    })
    const socketidList = await clients
    if (clients.length <= 2) {
      await ctx.service.screensocket.update(
        { screenId },
        {
          socketidList,
          waitSocketid: {}
        }
      )
    } else {
      await ctx.service.screensocket.update(
        { screenId },
        {
          socketidList
        }
      )
    }
    let data = await ctx.service.screensocket.findOne({ screenId }, projection)
    socket.join(screenId)
    if (!data) {
      const password = parseInt(Math.random() * 1000000)
      const acceptSocketid = {}
      acceptSocketid[uid] = socket.id
      await ctx.service.screensocket.create({
        screenId,
        isConnect: false,
        password,
        acceptSocketid,
        sendSocketid: {},
        waitSocketid: {}
      })
    } else {
      if (isControl === 'false') {
        const acceptSocketid = {}
        acceptSocketid[uid] = socket.id
        acceptSocketid['socketId'] = socket.id
        await ctx.service.screensocket.update(
          { screenId },
          {
            acceptSocketid
          }
        )
      } else {
        if (
          !data.sendSocketid ||
          data.sendSocketid[uid] ||
          data.socketidList.length === 2
        ) {
          const sendSocketid = {}
          sendSocketid[uid] = socket.id
          sendSocketid['socketId'] = socket.id
          await ctx.service.screensocket.update(
            { screenId },
            {
              sendSocketid
            }
          )
        } else if (
          !data.waitSocketid ||
          data.waitSocketid[uid] ||
          data.socketidList.length === 3
        ) {
          const waitSocketid = {}
          waitSocketid[uid] = socket.id
          waitSocketid['socketId'] = socket.id
          await ctx.service.screensocket.update(
            { screenId },
            {
              waitSocketid
            }
          )
        }
      }
    }
    // 加入以大屏id为名字的房间
    await next()

    namespace.in(screenId).clients(async (err, clients) => {
      await ctx.service.screensocket.update(
        { screenId },
        {
          socketidList: _.uniq(clients)
        }
      )
      let data = await ctx.service.screensocket.findOne(
        { screenId },
        projection
      )
      console.log(data.socketidList, '断开后连接的')
      if (isControl === 'false') {
        const acceptSocketid = {}
        await ctx.service.screensocket.update(
          { screenId },
          {
            acceptSocketid
          }
        )
      } else {
        if (data.sendSocketid[uid] === socket.id) {
          const sendSocketid = {}
          sendSocketid[uid] = ''
          sendSocketid['socketId'] = ''
          await ctx.service.screensocket.update(
            { screenId },
            {
              sendSocketid
            }
          )
        } else if (data.waitSocketid[uid] === socket.id) {
          const waitSocketid = {}
          await ctx.service.screensocket.update(
            { screenId },
            {
              waitSocketid
            }
          )
        }
      }
    })
  }
}
