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
  router.post(publicPath + '/api/user', controller.user.index)
  router.post(publicPath + '/api/user/create', controller.user.create)
  router.post(publicPath + '/api/user/update', controller.user.update)
  router.post(publicPath + '/api/user/delete', controller.user.delete)

  /************ 用户信息-end ************/
  /************ 考试信息-start ************/
  router.post(publicPath + '/api/exam', controller.exam.index)
  router.post(publicPath + '/api/exam/create', controller.exam.create)
  router.post(publicPath + '/api/exam/update', controller.exam.update)
  router.post(publicPath + '/api/exam/delete', controller.exam.delete)

  /************ 考试信息-end ************/
  /************ 日志信息-start ************/
  router.post(publicPath + '/api/log', controller.log.index)
  router.post(publicPath + '/api/log/create', controller.log.create)
  router.post(publicPath + '/api/log/update', controller.log.update)
  router.post(publicPath + '/api/log/delete', controller.log.delete)

  /************ 日志信息-end ************/
}
