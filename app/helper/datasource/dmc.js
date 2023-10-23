const { result, findIndex } = require('lodash')
var utils = require('util')
const SeatomException = require('../../exception/seatomException')
const DbConn = require('../base-datasource')
const {
  buildSelectSql,
  replaceNameToFid,
  wrapAggregate,
  calulateDate,
  compare,
  generateSign
} = require('../../extend/sql-utils')
const { compareVersion } = require('../../extend/utils')
const {
  ERROR_CODES,
  INTEGER_TYPE,
  FLOAT_TYPE
} = require('../../extend/constant')
const moment = require('moment')

function Dmc(config, service) {
  this.ctx = service.ctx
  this.baseUrl = service.config.dmcAddress.address
  this.access_token = config.systoken
  this.user_id = config.sysuserid
  this.service = service
  this.isNewVersion =
    compareVersion(service.config.dmcAddress.version, '2.1.6') > 0
      ? true
      : false
}

Dmc.prototype.getTreeList = async function (config) {
  console.log(this.isNewVersion)
  const shortUrl = this.isNewVersion
    ? '/api/folder/get_etl_tree_with_tblist'
    : '/api/folder/get_dmc_tree_with_tblist'
  const data = {
    get_first: 1,
    get_root: 1
  }
  const result = await this._request(shortUrl, data)
  return result
}

Dmc.prototype.getFolderTbList = async function (config) {
  const shortUrl = this.isNewVersion
    ? '/api/folder/etl_get_current_folder'
    : '/api/folder/get_current_folder'
  const data = {
    // "filter_tree": "[\"" + config.filterTree + "\"]", //dmc表类型，取值personal、standard、topic、tag、relation
    filter_tree: this.isNewVersion
      ? config.filterTree
      : '["' + config.filterTree + '"]', //dmc表类型，取值personal、standard、topic、tag、relation
    folder_id: config.folderId
  }
  let result = await this._request(shortUrl, data)
  if (result.folder_list) {
    result = {
      folder_id: '',
      sub_folders: result.folder_list,
      tb_list: []
    }
  }
  return result
}

Dmc.prototype.getFieldList = async function (config) {
  const shortUrl = '/api/tb/info'
  const data = {
    query_for_ct: 0,
    need_param: 1,
    tb_id: config.tbid
  }
  let result = await this._request(shortUrl, data)
  result = result.schema //type: array
  let dateFields = [],
    stringFields = [],
    numberFields = []
  result.forEach((element, index) => {
    if (element.formula && element.formula != '') {
      return
    }
    delete element.editable
    delete element.is_build_aggregated
    delete element.remark
    delete element.type
    element.field_type = 0 //seatom普通字段，计算字段为1分组字段为2
    switch (element.data_type) {
      case 'date':
        dateFields.push(element)
        break
      case 'string':
        stringFields.push(element)
        break
      case 'number':
        numberFields.push(element)
        break
    }
  })

  // 以下处理计算字段
  if (config.needCalculate == 1) {
    const projection = {
      'fields._id': 0
    }
    const res = await this.ctx.model.Calculatefield.findOne(
      { tbId: config.tbid, workspaceId: config.workspaceId },
      projection
    )
    if (res) {
      let fieldList = res.fields
      fieldList.forEach(element => {
        switch (element.data_type) {
          case 'date':
            dateFields.push(element)
            break
          case 'string':
            stringFields.push(element)
            break
          case 'number':
            numberFields.push(element)
            break
        }
      })
    }
  }

  // 计算字段处理结束

  fieldList = []
  fieldList.push({
    type: 'date',
    fields: dateFields
  })
  fieldList.push({
    type: 'string',
    fields: stringFields
  })
  fieldList.push({
    type: 'number',
    fields: numberFields
  })
  return fieldList
}

Dmc.prototype.searchTb = async function (config) {
  // const shortUrl = "/api/folder/dmc_filter";
  const shortUrl = this.isNewVersion
    ? '/api/folder/etl_filter'
    : '/api/folder/dmc_filter'
  params = {
    filter_str: config.filterStr
  }
  const dmcResult = await this._request(shortUrl, params)
  return dmcResult
}

Dmc.prototype._request = async function (shortUrl, data, baseUrl, method) {
  data = data ? data : {}
  if (!baseUrl) {
    data['access_token'] = this.access_token
  }
  data['access_token'] = this.access_token
  data['my_user_id'] = this.user_id
  data['sys_pro_name'] = 'bdp'
  data['dmc_request'] = 0
  data['user_id'] = this.user_id
  var base = baseUrl ? baseUrl : this.baseUrl
  const tokenstart = new Date().getTime()
  const result = await this.ctx.curl(base + shortUrl, {
    method: method ? method : 'POST',
    dataType: 'json',
    timeout: this.service.config.dmcTimeout,
    data: data,
    rejectUnauthorized: false
  })
  const tokenend = new Date().getTime()
  this.ctx.logger.info(
    '请求dmc接口时间',
    base + shortUrl,
    `${tokenend - tokenstart}hzms`
  )
  // this.ctx.logger.info("_request方法的请求的路径", base + shortUrl);
  this.ctx.logger.info('_request方法的dmc接口请求的参数', data)
  // this.ctx.logger.info("_request方法的请求方式", method);
  // this.ctx.logger.info("_request返回值1", result);
  if (result && result.status == 200 && result.data.status == '0') {
    // 根据类型字段修改返回值类型
    // this.ctx.logger.info("_request方法的返回值", result.data);
    if (result.data.result.data && result.data.result.data.length) {
      for (let index = 0; index < result.data.result.data.length; index++) {
        const element = result.data.result.data[index]
        for (let j = 0; j < element.length; j++) {
          if (INTEGER_TYPE.indexOf(result.data.result.schema[j].type) !== -1) {
            result.data.result.data[index][j] = parseInt(
              result.data.result.data[index][j]
            )
          }
          if (FLOAT_TYPE.indexOf(result.data.result.schema[j].type) !== -1) {
            result.data.result.data[index][j] = parseFloat(
              result.data.result.data[index][j]
            )
          }
        }
      }
    }
    return result.data.result
  } else if (
    result.status == 200 &&
    result.data.errstr.includes('from mobius')
  ) {
    // dmc mobius相关的异常信息没有封装，会返回一长串，需要处理一下
    this.ctx.logger.error('dmc request error: ', result.data)
    const errstr = result.data.errstr
    if (errstr.includes('given input columns')) {
      throw new SeatomException(ERROR_CODES.SQL_ERROR, '字段不存在')
    } else if (errstr.includes('Table or view not found')) {
      throw new SeatomException(ERROR_CODES.SQL_ERROR, '工作表不存在')
    } else if (errstr.includes('mismatched input')) {
      throw new SeatomException(ERROR_CODES.SQL_ERROR, 'sql语法错误')
    } else {
      throw new SeatomException(ERROR_CODES.SQL_ERROR, errstr)
    }
  } else if (result.status == 200) {
    this.ctx.logger.info('_request返回值2', result.data)
    throw new SeatomException(+result.data.status, result.data.errstr)
  }
}

Dmc.prototype.getData = async function (
  baseConfig,
  componentConfig,
  queryParams
) {
  // 记录四个模块的内容
  var selectList = [],
    whereList = '',
    groupByList = [],
    orderByList = []
  // 请求都直接走tassadar
  const baseUrl = this.service.config.dmcAddress.tassadar
    ? this.service.config.dmcAddress.tassadar
    : this.service.config.dmcAddress.address + ':19987'
  // 暂时没有where条件
  // 记录最终返回数据的字段名和顺序
  var fieldList = []

  // 获取表storageid
  const getStorageIdShortUrl = '/tb/infonew'
  const tbId = componentConfig.tbId
  if (!tbId) {
    throw new SeatomException(ERROR_CODES.PARAMETER_IS_REQUIRED, 'tbId不存在')
  }
  params = {
    tb_id: tbId,
    fields: 'storage_id,fields'
  }
  const tbInfoResult = await this._request(
    getStorageIdShortUrl,
    params,
    baseUrl
  )
  const storageId = tbInfoResult['storage_id']

  // to_do: 获取map1
  let normalFieldMap = {}
  tbInfoResult.fields.forEach(element => {
    normalFieldMap[element.name] = element.field_id
  })
  // to_do: 获取map2
  const projection = {
    'fields._id': 0
  }
  if (!queryParams.workspaceId) {
    throw new SeatomException(
      ERROR_CODES.PARAMETER_IS_REQUIRED,
      '缺失workspaceId参数'
    )
  }

  const res = await this.ctx.model.Calculatefield.findOne(
    { workspaceId: queryParams.workspaceId || 19, tbId: tbId },
    projection
  )
  const calculateFields = res ? res.fields : []
  let calculateFieldMap = {}
  calculateFields.forEach(element => {
    // 公式里的所有字段替换成dmc的字段id
    calculateFieldMap[element.fid] = replaceNameToFid(
      element.formula,
      normalFieldMap
    )
  })

  // 处理维度字段列表
  const dimension = componentConfig.fields.dimension
  dimension.forEach((element, index) => {
    if (element.fid.indexOf('fk') == 0) {
      if (element.calculation) {
        //维度中有计算字段
        const field = calulateDate(element.calculation, element.fid)
        if (field) {
          selectList.push(field)
          groupByList.push(field)
          fieldList.push(element.name)
        }
      } else {
        selectList.push(element.fid)
        groupByList.push(element.fid)
        orderByList.push(element.fid)
        // 有别名加别名，没有别名字段先加名称
        fieldList.push(element.name)
      }
    } else {
      // 计算字段处理
      selectList.push(calculateFieldMap[element.fid])
      groupByList.push(calculateFieldMap[element.fid])
      fieldList.push(element.name)
    }
  })
  // 处理数值字段列表
  const numerical = componentConfig.fields.numericalValue
  numerical &&
    numerical.forEach((element, index) => {
      if (element.fid.indexOf('fk') == 0) {
        const fieldStr = wrapAggregate(
          element.calculation,
          element.fid,
          'dmc',
          element.data_type
        )
        selectList.push(fieldStr)
        fieldList.push(element.name + '(' + element.calculation + ')')
      } else {
        // 计算字段处理
        const fieldStr = wrapAggregate(
          element.calculation,
          calculateFieldMap[element.fid],
          'dmc',
          element.data_type
        )
        selectList.push(fieldStr)
        fieldList.push(element.name + '(' + element.calculation + ')')
      }
    })
  if (selectList.length == 0) {
    throw new SeatomException(ERROR_CODES.SQL_ERROR, '字段列表为空')
  }
  let where = componentConfig.where
  let whereSql = ``
  const relative = [
    'today',
    'lastday',
    'last7Days',
    'last30Days',
    'last90Days',
    'lastYear'
  ]
  if (where.enable) {
    where.whereCondition &&
      where.whereCondition.forEach((item, index) => {
        // 处理筛选条件，包括今天、昨天、最近7天、最近30天、最近90天、最近一年、全部
        if (relative.includes(item.compare)) {
          item.compareValue = this.relativeDate(item)
        }
        if (item.compare == 'unequal' && item.type == 'date') {
          whereSql +=
            index == 0
              ? ` ${generateSign(where.whereCondition.length)} ` +
                `IFNULL('` +
                item.fid +
                `',' ')` +
                ` `
              : `IFNULL('` + item.fid + `',' ')` + ` `
        } else {
          whereSql +=
            index == 0
              ? ` ${generateSign(where.whereCondition.length)} ` +
                item.fid +
                ` `
              : item.fid + ` `
        }
        switch (item.compareValue.length) {
          case 0:
            whereSql +=
              compare[item.type][item.compare] +
              (where.whereCondition.length == index + 1
                ? ` `
                : item.composeType == 'or'
                ? ` ) OR `
                : ` ) AND `)
            break
          case 1:
            if (item.type == 'string') {
              if (
                [
                  'matchOnEnd',
                  'matchOnStart',
                  'notContain',
                  'contain'
                ].includes(item.compare)
              ) {
                whereSql +=
                  compare[item.type][item.compare].replace(
                    '{0}',
                    item.compareValue[0]
                  ) +
                  (where.whereCondition.length == index + 1
                    ? ` `
                    : item.composeType == 'or'
                    ? ` ) OR `
                    : ` ) AND `)
              } else if (item.compare == 'range') {
                const inItem = JSON.stringify(item.compareValue).replace(
                  /\[|]/g,
                  ''
                )
                whereSql += compare[item.type][item.compare].replace(
                  '{0}',
                  inItem
                )
                ;+(where.whereCondition.length == index + 1
                  ? ` `
                  : item.composeType == 'or'
                  ? ` ) OR `
                  : ` ) AND `)
              } else {
                whereSql +=
                  compare[item.type][item.compare].replace(
                    '{0}',
                    JSON.stringify(item.compareValue[0])
                  ) +
                  (where.whereCondition.length == index + 1
                    ? ` `
                    : item.composeType == 'or'
                    ? ` ) OR `
                    : ` ) AND `)
              }
            }
            if (item.type == 'date') {
              const compareValue = moment(item.compareValue[0]).format(
                'YYYY-MM-DD HH:mm:ss'
              )
              whereSql +=
                compare[item.type][item.compare].replace(
                  '{0}',
                  JSON.stringify(compareValue)
                ) +
                (where.whereCondition.length == index + 1
                  ? ` `
                  : item.composeType == 'or'
                  ? ` ) OR `
                  : ` ) AND `)
            }
            if (item.type == 'number') {
              whereSql +=
                compare[item.type][item.compare].replace(
                  '{0}',
                  item.compareValue[0]
                ) +
                (where.whereCondition.length == index + 1
                  ? ` `
                  : item.composeType == 'or'
                  ? ` ) OR `
                  : ` ) AND `)
            }
            break
          case 2:
            let compareValue1, compareValue2
            if (item.type == 'date') {
              compareValue1 = JSON.stringify(
                moment(item.compareValue[0]).format('YYYY-MM-DD HH:mm:ss')
              )
              compareValue2 = JSON.stringify(
                moment(item.compareValue[1]).format('YYYY-MM-DD HH:mm:ss')
              )
            } else {
              compareValue1 = item.compareValue[0]
              compareValue2 = item.compareValue[1]
            }
            if (item.type == 'string' && item.compare == 'range') {
              //范围筛选
              const inItem = JSON.stringify(item.compareValue).replace(
                /\[|]/g,
                ''
              )
              whereSql += compare[item.type][item.compare].replace(
                '{0}',
                inItem
              )
              ;+(where.whereCondition.length == index + 1
                ? ` `
                : item.composeType == 'or'
                ? ` ) OR `
                : ` ) AND `)
            } else if (relative.includes(item.compare)) {
              // 日期范围筛选
              whereSql +=
                compare[item.type][item.compare]
                  .replace('{0}', compareValue1)
                  .replace('{1}', item.fid)
                  .replace('{2}', compareValue2) +
                (where.whereCondition.length == index + 1
                  ? ` `
                  : item.composeType == 'or'
                  ? ` ) OR `
                  : ` ) AND `)
            } else if (item.type == 'string' && item.compare == 'in') {
              // in筛选
              const inItem = JSON.stringify(item.compareValue).replace(
                /\[|]/g,
                ''
              )
              whereSql += compare[item.type][item.compare].replace(
                '{0}',
                inItem
              )
              ;+(where.whereCondition.length == index + 1
                ? ` `
                : item.composeType == 'or'
                ? ` ) OR `
                : ` ) AND `)
            } else {
              //contain筛选
              whereSql +=
                compare[item.type][item.compare]
                  .replace('{0}', compareValue1)
                  .replace('{1}', compareValue2) +
                (where.whereCondition.length == index + 1
                  ? ` `
                  : item.composeType == 'or'
                  ? ` ) OR `
                  : ` ) AND `)
            }
            break
        }
        if (item.compareValue.length > 2) {
          const inItem = JSON.stringify(item.compareValue).replace(/\[|]/g, '')
          whereSql += compare[item.type][item.compare].replace('{0}', inItem)
          ;+(where.whereCondition.length == index + 1
            ? ` `
            : item.composeType == 'or'
            ? ` ) OR `
            : ` ) AND `)
        }
      })
    whereList = whereSql
    // 兼容数据处理功能对orderby
    where.orderCondition &&
      where.orderCondition.forEach((item, index) => {
        if (item.calculation) {
          // 按年、月、日、时、分、秒
          const field = calulateDate(item.calculation, item.fid)
          orderByList.unshift(field + ' ' + item.orderBy)
        } else {
          const orderByListIndex = findIndex(orderByList, item.fid)
          if (orderByListIndex > -1) {
            delete orderByList[orderByListIndex]
            orderByList.unshift(item.fid + ' ' + item.orderBy)
          } else {
            orderByList.unshift(item.fid + ' ' + item.orderBy)
          }
        }
      })
    orderByList.forEach((item, index) => {
      if (item.search('desc') == -1 && item.search('asc') == -1) {
        orderByList[index] = orderByList[index] + ' ' + ' asc '
      }
    })
  } else {
    whereList = ``
  }

  let sql = buildSelectSql(
    storageId,
    selectList,
    whereList,
    groupByList,
    orderByList,
    200000
  )
  this.ctx.logger.info('get data final sql: ', sql)
  // sql = "select fka2dda4bb,month(fka2dda4bb) from i51762af86e54e7ea97187fa5de7c6d1  group by fka2dda4bb,month(fka2dda4bb) order by fka2dda4bb limit 50000"
  // to_do: 执行sql, 获取dmc返回值
  const getDmcDataShortUrl = '/tb/data/sqlquery'
  var getDataParams = {
    sql: sql,
    //参数？
    meta: {},
    // 是否使用dmc缓存
    is_cache: 1
  }
  const dmcResult = await this._request(
    getDmcDataShortUrl,
    getDataParams,
    baseUrl
  )
  const dmcData = dmcResult.data || [] //exp: [["1"], ["2"]]
  // this.ctx.logger.info("返回的数据 ", dmcData);
  // to_do: 遍历dmcData，按前端要求格式封装返回值
  var finalResult = []
  dmcData.forEach(dataElement => {
    var rowElement = {}
    dataElement.forEach((element, index) => {
      rowElement[fieldList[index]] = element
    })
    finalResult.push(rowElement)
  })
  return finalResult
}

Dmc.prototype.getFunctionList = async function () {
  const shortUrl = '/api/function/list'
  const result = await this._request(shortUrl)
  const classification = result.classification
  let functionList = []
  for (var key in classification) {
    // 不允许在计算字段里使用聚合函数，否则拼sql过于头疼
    if (key == 1 || key == 0) {
      continue
    }
    classification[key].forEach(element => {
      functionList.push(element)
    })
  }
  return functionList
}

Dmc.prototype.getProjectTree = async function () {
  const shortUrl = '/api/project/tree'
  const result = await this._request(shortUrl)
  return result
}
Dmc.prototype.getDashboardInfo = async function (data) {
  // console.log(config,'dasdasdsadasd')
  const shortUrl = '/api/dashboard/info'
  const result = await this._request(shortUrl, data, null, 'GET')
  return result
}
Dmc.prototype.getChartData = async function (data) {
  // const shortUrl = '/api/chart/data'
  const shortUrl = '/api/inner/screen/chart/data'
  const result = await this._request(shortUrl, data)
  return result
}
utils.inherits(Dmc, DbConn)

exports = module.exports = Dmc
