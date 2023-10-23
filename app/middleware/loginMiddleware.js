const { getResponseBody } = require('../extend/utils')
module.exports = (options, app) => {
  //返回一个异步的方法
  return async function loginMiddleware(ctx, next) {
    const userId = ctx.request.header.sysuserid
    const token = ctx.request.header.systoken
    if (!token || !userId) {
      ctx.body = getResponseBody(null, false, '无用户权限，请登录后访问', 401)
      return
    }
    const userData = await ctx.service.user.findOne({ userId })
    if (!userData) {
      ctx.body = getResponseBody(
        null,
        false,
        '登录失效，请重新登录no userId',
        401
      )
      return
    }
    const flag = userData.token.includes(token)
    if (!flag && userData.isDmcLogin == 1) {
      ctx.body = getResponseBody(
        null,
        false,
        '登录失效，请重新登录no token',
        401
      )
      return
    }
    if (userData.isDmcLogin && userData.isDmcLogin == 2) {
      try {
        const decode = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret)
      } catch (e) {
        ctx.body = getResponseBody(null, false, 'token失效，请重新登录', 401)
        return
      }
    }
    await next()
  }
}
