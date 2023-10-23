const DbConn = require('../base-datasource')
const util = require('util')
const URL = require('url')
const { getQueryString } = require('../../extend/utils')
const { formatString } = require('../../extend/utils')
const _ = require('lodash')
const SeatomException = require('../../exception/seatomException')
const { ERROR_CODES } = require('../../extend/constant')
function API(config, service) {
  this.ctx = service.ctx
}

API.prototype.getData = async function (
  baseConfig,
  componentConfig,
  paramsData
) {
  // baseConfig数据源基础配置,componentConfig组件配置, paramsData前端传参
  const { ctx } = this
  const { baseUrl } = baseConfig
  let {
    method,
    headers,
    path: urlPath,
    params,
    needCookie,
    body
  } = componentConfig
  const access_token = paramsData.access_token || ''
  if (!ctx) {
    throw new Error('服务端错误，获取数据失败')
  }
  let url = baseUrl + urlPath
  const options = {
    method: method,
    contentType: 'json',
    dataType: 'json',
    timeout: 60000
  }

  // if (paramsData && paramsData.params && paramsData.params.whereCondition && paramsData.params.whereCondition.length) {
  //   for (const condition of paramsData.params.whereCondition) {
  //     let reParam = {}
  //     reParam[condition.field] = condition.compareValue[0];
  //     paramsData.params = Object.assign(paramsData.params, reParam);
  //   }
  // }

  if (method !== 'GET' && method !== 'DELETE' && body) {
    let data = formatString(body, paramsData.params)
    try {
      options.data = JSON.parse(data)
    } catch (error) {
      throw new SeatomException(
        ERROR_CODES.PARAMS_FORMAT_ERROR,
        'body格式错误，' + error.message
      )
    }
  }
  if (headers) {
    let headersStr = formatString(headers, paramsData.params)
    // headersStr = formatString(headers, paramsData._var);
    try {
      options.headers = JSON.parse(headersStr)
      options.headers.access_token = access_token
    } catch (error) {
      throw new SeatomException(
        ERROR_CODES.PARAMS_FORMAT_ERROR,
        'header格式错误，' + error.message
      )
    }
  }
  // params格式：形如a = a & b = ${b} & c= ${c}的字符串
  if (params) {
    let paramString = formatString(params, paramsData.params)
    // 去空格
    paramString = encodeURI(paramString.replace(/\s+/g, ''))
    url = url + '?' + paramString
    // console.log(url,'数据=====路径')
  }

  if (
    paramsData &&
    paramsData.params &&
    paramsData.params.whereCondition &&
    paramsData.params.whereCondition.length
  ) {
    for (
      let index = 0;
      index < paramsData.params.whereCondition.length;
      index++
    ) {
      const element = paramsData.params.whereCondition[index]
      const queryObj = URL.parse(url, true).query
      let basepath = url.split('?')[0]
      if (element.fieldRequestType === 'query') {
        if (URL.parse(url, true).query[element.field]) {
          queryObj[element.field] = element.compareValue[0] || null
          for (const key in queryObj) {
            if (Object.hasOwnProperty.call(queryObj, key)) {
              const queryObjItem = queryObj[key]
              if (basepath.indexOf('?') !== -1) {
                basepath = basepath + '&' + key + '=' + queryObjItem
              } else {
                basepath = basepath + '?' + key + '=' + queryObjItem
              }
            }
          }
          url = basepath
        } else {
          if (url.indexOf('?') !== -1) {
            url = url + '&' + element.field + '=' + element.compareValue[0]
          } else {
            url = url + '?' + element.field + '=' + element.compareValue[0]
          }
        }
        // console.log(URL.parse(url,true).query,'旧版犯法=====')
      } else {
        options.data[element.field] = element.compareValue[0]
      }
    }
  }
  this.ctx.logger.info('api参数:', options, url)
  const result = await ctx.curl(_.trim(url), options)
  this.ctx.logger.info('api返回的数据:', result, url)
  if (result) {
    return result.data
  } else {
    throw new Error('获取API数据失败')
  }
}

util.inherits(API, DbConn)

module.exports = API
