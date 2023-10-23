module.exports = app => {
  class Controller extends app.Controller {
    async index() {
      const message = this.ctx.args[0]
      const query = this.ctx.socket.handshake.query
      const { screenId, uid } = query
      const namespace = app.io.of('/chat')
      const screensocket = await this.ctx.service.screensocket.findOne({
        screenId
      })
      if (
        this.ctx.socket.id !== screensocket.acceptSocketid['socketId'] &&
        this.ctx.socket.id !== screensocket.sendSocketid['socketId'] &&
        this.ctx.socket.id !== screensocket.waitSocketid['socketId']
      ) {
        // namespace.to(screensocket.sendSocketid[uid]).emit('message', '有人想要控制，是否允许连接？')
        namespace.to(this.ctx.socket.id).emit('message', {
          type: 'message',
          message: '当前控制人数多，请稍后再试',
          code: 4
        })
        this.ctx.socket.disconnect(true)
        return
      }
      if (
        this.ctx.socket.id !== screensocket.acceptSocketid['socketId'] &&
        this.ctx.socket.id !== screensocket.sendSocketid['socketId']
      ) {
        if (message.apply) {
          namespace.to(screensocket.sendSocketid['socketId']).emit('message', {
            type: 'message',
            message: '申请控制',
            code: 1
          })
        } else {
          namespace.to(this.ctx.socket.id).emit('message', {
            type: 'message',
            message: '有人正在控制',
            code: 0
          })
        }
      } else {
        if (message.type === 'agree') {
          if (message.agree) {
            let sendSocketid = {}
            sendSocketid = screensocket.waitSocketid
            await this.ctx.service.screensocket.update(
              { screenId },
              {
                sendSocketid,
                waitSocketid: {}
              }
            )
            namespace
              .to(screensocket.waitSocketid['socketId'])
              .emit('message', {
                type: 'message',
                message: '同意',
                code: 2
              })
            this.ctx.socket.disconnect(true)
          } else {
            namespace
              .to(screensocket.waitSocketid['socketId'])
              .emit('message', {
                type: 'message',
                message: '拒绝',
                code: 3
              })
          }
        } else {
          // namespace.to(screensocket.acceptSocketid[uid]).emit('message', message);
          namespace
            .to(screensocket.acceptSocketid['socketId'])
            .emit('message', message)
          namespace.to(screensocket.sendSocketid[uid]).emit('message', message)
        }
      }
    }
  }
  return Controller
}
