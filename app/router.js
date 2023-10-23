'use strict'
const fs = require('fs-extra')
const path = require('path')
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, config } = app
  const publicPath = config.publicPath

  app.io.of('/chat').route('chat', app.io.controller.chat.index)

  const editorNsp = app.io.of('/editor')
  editorNsp.route('joinScreen', app.io.controller.editor.joinScreen)
  editorNsp.route('exitScreen', app.io.controller.editor.exitScreen)
  editorNsp.route('joinScenePage', app.io.controller.editor.joinScenePage)
  editorNsp.route('exitScenePage', app.io.controller.editor.exitScenePage)

  router.get('/', controller.home.index)
  /************ 用户信息-start ************/
  router.get(publicPath + '/api/user', controller.user.index)
  router.post(publicPath + '/api/user/create', controller.user.create)
  router.post(publicPath + '/api/user/register', controller.user.register)
  
  /************ 用户信息-end ************/
}
