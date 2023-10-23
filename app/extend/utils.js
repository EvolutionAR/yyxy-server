const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const { v4 } = require('uuid')
const { keys } = require('lodash')
const moment = require('moment')
const base64 = require('base-64')
const { decipher } = require('./crypto')
// 设置显示文档的属性  属性值1代表显示 属性值0代表隐藏
function getCommonProjection(projection) {
  return _.assign(
    {
      _id: 0,
      __v: 0
    },
    projection
  )
}

function uuid(prefix) {
  return prefix ? `${prefix}_${v4()}` : v4()
}

function isEmpty(a) {
  if (a === '') return true //检验空字符串
  if (a === 'null') return true //检验字符串类型的null
  if (a === 'undefined') return true //检验字符串类型的 undefined
  if (!a && a !== 0 && a !== '') return true //检验 undefined 和 null
  if (Array.prototype.isPrototypeOf(a) && a.length === 0) return true //检验空数组
  if (Object.prototype.isPrototypeOf(a) && Object.keys(a).length === 0)
    return true //检验空对象
  return false
}

function randomId() {
  return (
    (Date.now().toString().substring(2) * 1 +
      '' +
      Math.floor(10 + Math.random() * 90)) *
    1
  ) // 防止id位数太多导致数据显示科学计数导致导入导出数据报错
}

/**
 * 获取响应体
 * @param {*} data 数据
 * @param {*} success 是否成功
 * @param {*} message 消息
 * @param {*} code 状态码：[HTTP 响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
 * @returns
 */
function getResponseBody(
  data = null,
  success = true,
  message = '',
  code = 200
) {
  return {
    data: data,
    success: !!success,
    message: message,
    code: code
  }
}

/**
 * 获取成功响应体
 * @param {any} data 数据
 * @param {string} message 消息
 * @param {number} code 状态码：[HTTP 响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
 * @returns
 */
function getResponseSuccess({ data = null, message = '请求成功', code = 200 }) {
  return {
    data: data,
    // 是否成功
    success: true,
    message: message,
    code: code
  }
}

/**
 * 获取失败响应体
 * @param {any} data 数据
 * @param {string} message 消息
 * @param {number} code 状态码：[HTTP 响应代码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
 * @returns
 */
function getResponseError({ data = null, message = '服务器错误', code = 400 }) {
  return {
    data: data,
    // 是否成功
    success: false,
    message: message,
    code: code
  }
}

/**
 * 获取列表响应体
 * @param {*} param0
 * @returns
 */
function getResponseList({ list = [], page = 1, pageSize = 20, total }) {
  return {
    list,
    page,
    pageSize,
    total
  }
}

// 获取当前时区时间
function getDate() {
  const formatDate = moment().format()
  return formatDate
}

function getQueryString(param) {
  return Object.keys(param)
    .map(key => {
      const value =
        typeof param[key] === 'object' ? JSON.stringify(param[key]) : param[key]
      return `${key}=${value}`
    })
    .join('&')
}

const versionRegex = /^\d+(.\d+){2}$/
// 比较版本号
function compareVersion(version1, version2) {
  if (!version1 || !version2) throw new Error('未提供版本号！')
  if (!versionRegex.test(version1) || !versionRegex.test(version2))
    throw new Error('版本号格式有误！')
  const arr1 = version1.split('.').map(d => Number(d))
  const arr2 = version2.split('.').map(d => Number(d))
  let i = 0
  while (i < arr1.length) {
    if (arr1[i] !== arr2[i]) {
      return arr1[i] > arr2[i] ? 1 : -1
    }
    i++
  }
  return 0
}

function randomStr(n) {
  const str = 'abcdefghijklmnopqrstuvwxyz9876543210'
  let tmp = ''
  let i = 0
  const l = str.length
  for (i = 0; i < n; i++) {
    tmp += str.charAt(Math.floor(Math.random() * l))
  }
  return tmp
}

function formatString(template, args) {
  // 把所有${key}替换成args中对应key的value值，支持多层
  var reg = new RegExp('\\${[^}]+}', 'g')
  var keyList = Array.from(template.matchAll(reg), x => x[0])
  var result = template
  keyList.forEach(element => {
    // element: ${xxxxx}, key: xxxxx
    let key = element.slice(2, element.length - 1)
    let value = _.get(args, key, '')
    result = result.replace(element, value)
  })
  return result
}
// 复制并替换资源路径
function copyResource(
  str,
  resourcePath,
  screenTplFolder,
  tplName,
  mainScreenId = null,
  mainScreenName = null
) {
  console.log(mainScreenId, 'dadasdd==========')
  // 获取系统里面的资源路径
  let res =
    str.match(
      /\public.*?(\.png|\.jpg|\.js|\.mp4|\.json|\.svg|\.csv|\.gif|\.jpeg)/g
    ) || []
  // console.log(res,'dasdsdas========')
  res = res.filter(item => {
    return item.indexOf(',') === -1
  })
  res = res.filter(item => {
    return item.indexOf('/packages/') === -1
  })
  // console.log(res,'dasdsdas========0000000000000000000')
  let newStr = str
  if (!res || res.length === 0) {
    return str
  }
  const folder = path.resolve(resourcePath, `./${screenTplFolder}`)
  const name = path.resolve(resourcePath, `./${screenTplFolder}/${tplName}`)
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
  if (!fs.existsSync(name)) {
    fs.mkdirSync(name)
  }
  res = _.uniq(res) // 去重
  for (let index = 0; index < res.length; index++) {
    let item = res[index]
    let fieldname = item.split('/').pop()
    let newUrl = item.replace('public/', '/')
    let regExp = new RegExp(_.escapeRegExp(item), 'g')
    if (fs.existsSync(path.resolve(resourcePath, `./${newUrl}`))) {
      // debugger
      // console.log(path.resolve(resourcePath, `./${newUrl}`), path.resolve(resourcePath, `./${screenTplFolder}/${tplName}/${fieldname}`),'shenme guigugu')
      if (
        !fs.existsSync(
          path.resolve(
            resourcePath,
            `./${screenTplFolder}/${tplName}/${fieldname}`
          )
        )
      ) {
        fs.copyFileSync(
          path.resolve(resourcePath, `./${newUrl}`),
          path.resolve(
            resourcePath,
            `./${screenTplFolder}/${tplName}/${fieldname}`
          )
        )
      }
      // fs.copyFileSync(path.resolve(resourcePath, `./${newUrl}`), path.resolve(resourcePath, `./${screenTplFolder}/${tplName}/${fieldname}`))
      if (!mainScreenId) {
        newStr = newStr.replace(
          regExp,
          `public/${screenTplFolder}/${tplName}/${fieldname}`
        )
      } else {
        newStr = newStr.replace(
          regExp,
          `public/${screenTplFolder}/fuxi_${mainScreenId}/${tplName}/${fieldname}`
        )
      }
    }
  }
  return newStr
}
// 添加组件默认配置
const addConfig = function (obj, type) {
  _.forOwn(obj, function (value, key) {
    if (value.type === 'image') {
      obj[key].imagePath = type
    }
    if (value.children) {
      addConfig(value.children, type)
    } else {
      return
    }
  })
}

// 获取过期时间
const getExpdate = function (day) {
  const time = new Date().getTime()
  const expdate = time + day * 86400000
  const datestr = `${new Date(expdate).getFullYear()}-${
    new Date(expdate).getMonth() + 1
  }-${new Date(expdate).getDate()}`
  return datestr
}
// 获取路径中的文件名
function getFileName(path) {
  var pos1 = path.lastIndexOf('/')
  var pos2 = path.lastIndexOf('\\')
  var pos = Math.max(pos1, pos2)
  if (pos < 0) return path
  else return path.substring(pos + 1)
}
// 校验第三方接口的token以及令牌密钥
function checkSign(sign, fuxiToken, fuxiPlatform) {
  if (fuxiPlatform !== 'thirdPlatform') {
    return false
  }
  const sign1 = decipher(fuxiToken).split('&&')[0]
  if (sign1 !== sign) {
    return false
  }
  return true
}

// 日志模型
const getLoggerModel = ({ message = '', data }) => {
  return JSON.stringify({
    message: message,
    data: data
  })
}

module.exports = {
  getCommonProjection,
  uuid,
  getResponseBody,
  getResponseSuccess,
  getResponseError,
  getResponseList,
  getDate,
  getQueryString,
  compareVersion,
  randomStr,
  formatString,
  copyResource,
  addConfig,
  randomId,
  isEmpty,
  getExpdate,
  getFileName,
  checkSign,
  getLoggerModel
}
