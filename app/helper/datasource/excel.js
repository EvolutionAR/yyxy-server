const DbConn = require('../base-datasource')
const util = require('util')
const csvtojson = require('csvtojson')
const path = require('path')
const SeatomException = require('../../exception/seatomException')
const { ERROR_CODES } = require('../../extend/constant')
const alasql = require('alasql')
const xlsx = require('node-xlsx')
function Excel(config, service) {
  this.appConfig = service.config || ''
}
const {
  buildSelectSql,
  replaceNameToFid,
  generateSign,
  wrapAggregate,
  compare
} = require('../../extend/sql-utils')
Excel.prototype.getData = async function (
  baseConfig,
  componentConfig,
  queryParams
) {
  try {
    const sql = await this.hanleData(
      baseConfig,
      componentConfig,
      queryParams,
      'excle'
    )
    const mysqlResult = await this.query(sql)
    return mysqlResult
  } catch (err) {
    console.log(err)
  }
}
Excel.prototype.getTreeList = async function (config) {
  let { filePath } = config
  if (!filePath) {
    throw new SeatomException(ERROR_CODES.FILE_NOT_EXIST, '未找到excle文件')
  }
  filePath = filePath.replace('public/', '/')
  const excleFilePath = path.resolve(
    this.appConfig.resourcePath,
    `./${filePath}`
  )
  let res = []
  const excelArray = xlsx.parse(excleFilePath)
  for (let index = 0; index < excelArray.length; index++) {
    const element = excelArray[index]
    res.push({ TABLE_NAME: element.name })
  }
  return res
}
Excel.prototype.getFieldList = async function (config) {
  console.log(config, '配置信息')
  let { filePath } = config
  if (!filePath) {
    throw new SeatomException(ERROR_CODES.FILE_NOT_EXIST, '未找到excle文件')
  }
  filePath = filePath.replace('public/', '/')
  const excleFilePath = path.resolve(
    this.appConfig.resourcePath,
    `./${filePath}`
  )
  const excelArray = xlsx.parse(excleFilePath)

  const allFields = excelArray.filter(item => {
    return item.name === config.tbName
  })

  let dateFields = [],
    stringFields = allFields[0].data[0],
    numberFields = []
  const fieldList = []
  let newStringFields = []
  for (let index = 0; index < stringFields.length; index++) {
    const element = stringFields[index]
    newStringFields.push({
      name: element,
      data_type: 'varchar'
    })
  }
  fieldList.push({
    type: 'date',
    fields: dateFields
  })
  fieldList.push({
    type: 'string',
    fields: newStringFields
  })
  fieldList.push({
    type: 'number',
    fields: numberFields
  })
  return fieldList
}

Excel.prototype.preview = async function (baseConfig) {
  let { filePath } = baseConfig
  if (!filePath) {
    throw new SeatomException(ERROR_CODES.FILE_NOT_EXIST, '未找到excle文件')
  }
  filePath = filePath.replace('public/', '/')
  const excleFilePath = path.resolve(
    this.appConfig.resourcePath,
    `./${filePath}`
  )
  const excelArraylist = await alasql([
    `select * from XLSX("${excleFilePath}")`
  ])
  const excelArray = excelArraylist[0]
  return excelArray.slice(0, excelArray.length >= 10 ? 10 : excelArray.length)
}

Excel.prototype.hanleData = async function (
  baseConfig,
  componentConfig,
  queryParams,
  dateBaseType
) {
  // 记录四个模块的内容
  var selectList = [],
    whereList = '',
    groupByList = [],
    orderByList = []
  if (!queryParams || !queryParams.workspaceId) {
    throw new SeatomException(
      ERROR_CODES.PARAMETER_IS_REQUIRED,
      '缺失workspaceId参数'
    )
  }
  // 处理维度字段列表
  const fieldList = []
  const dimension = componentConfig.fields.dimension
  dimension.forEach((element, index) => {
    if (element.name) {
      selectList.push('`' + element.name + '`')
      groupByList.push('`' + element.name + '`')
      orderByList.push('`' + element.name + '`')
      // 有别名加别名，没有别名字段先加名称
      fieldList.push('`' + element.name + '`')
    }
  })

  // 处理数值字段列表
  const numerical = componentConfig.fields.numericalValue
  numerical.forEach((element, index) => {
    if (element.name && element.calculation) {
      const fieldStr = wrapAggregate(
        element.calculation,
        '`' + element.name + '`',
        dateBaseType,
        element.data_type
      )
      selectList.push(fieldStr)
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
    where.whereCondition.forEach((item, index) => {
      // 处理筛选条件，包括今天、昨天、最近7天、最近30天、最近90天、最近一年、全部
      if (relative.includes(item.compare)) {
        item.compareValue = this.relativeDate(item)
      }
      {
        if (
          item.compare == 'unequal' &&
          dateBaseType == 'mysql' &&
          item.type == 'date'
        ) {
          whereSql +=
            index == 0
              ? ` ${generateSign(where.whereCondition.length)} ` +
                `IFNULL('` +
                item.field +
                `',' ')` +
                ` `
              : `IFNULL('` + item.field + `',' ')` + ` `
        } else {
          whereSql +=
            index == 0
              ? ` ${generateSign(where.whereCondition.length)} ` +
                '`' +
                item.field +
                '`' +
                ` `
              : '`' + item.field + '`' + ` `
        }
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
              ['matchOnEnd', 'matchOnStart', 'notContain', 'contain'].includes(
                item.compare
              )
            ) {
              if (dateBaseType == 'mysql') {
                whereSql +=
                  compare[item.type][item.compare].replace(
                    '{0}',
                    `${item.compareValue[0]}`
                  ) +
                  (where.whereCondition.length == index + 1
                    ? ` `
                    : item.composeType == 'or'
                    ? ` ) OR `
                    : ` ) AND `)
              } else {
                whereSql +=
                  compare[item.type][item.compare].replace(
                    '{0}',
                    `'${item.compareValue[0]}'`
                  ) +
                  (where.whereCondition.length == index + 1
                    ? ` `
                    : item.composeType == 'or'
                    ? ` ) OR `
                    : ` ) AND `)
              }
            } else {
              whereSql +=
                compare[item.type][item.compare].replace(
                  '{0}',
                  `'${item.compareValue[0]}'`
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
                `'${compareValue}'`
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
          if (relative.includes(item.compare)) {
            whereSql +=
              compare[item.type][item.compare]
                .replace('{0}', compareValue1)
                .replace('{1}', item.field)
                .replace('{2}', compareValue2) +
              (where.whereCondition.length == index + 1
                ? ` `
                : item.composeType == 'or'
                ? ` ) OR `
                : ` ) AND `)
          } else {
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
    })

    whereList = whereSql
    // 兼容数据处理功能对orderby
    where.orderCondition.forEach((item, index) => {
      if (item.calculation) {
        // 按年、月、日、时、分、秒
        const field = calulateDate(item.calculation, item.fid)
        orderByList.unshift(field + ' ' + item.orderBy)
      } else {
        const orderByListIndex = findIndex(orderByList, item.field)
        if (orderByListIndex > -1) {
          delete orderByList[orderByListIndex]
          orderByList.unshift(item.field + ' ' + item.orderBy)
        } else {
          orderByList.unshift(item.field + ' ' + item.orderBy)
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
  let { filePath } = baseConfig
  if (!filePath) {
    throw new SeatomException(ERROR_CODES.FILE_NOT_EXIST, '未找到excle文件')
  }
  filePath = filePath.replace('public/', '/')
  filePath = filePath.replace('.xlsx', '')
  const excleFilePath = path.resolve(
    this.appConfig.resourcePath,
    `./${filePath}`
  )
  const tbNameStr = `XLSX("${excleFilePath}",{sheetid:"${componentConfig.tbName}"})`
  let sql = buildSelectSql(
    tbNameStr,
    selectList,
    whereList,
    groupByList,
    orderByList,
    5000,
    queryParams.type || dateBaseType
  )
  console.log('>>>>>>>><<<<<<<<<<>>>>>', typeof sql, sql)
  return sql
}

Excel.prototype.query = async function (sql) {
  // 校验sql变量格式
  if (!sql || typeof sql != 'string') {
    console.warn('ql statement format is illegal', sql)
    throw new Error('sql statement format is illegal')
  }

  // 去掉sql两端空格
  sql = sql.replace(/^\s+|\s+$/g, '')

  // 做一个简单的sql校验，防止用户写了个drop之类的东西搞事情
  if (sql.substring(0, 6).toLowerCase() != 'select') {
    throw new Error("query sql must start with 'select'")
  }
  try {
    const res = await alasql([sql])
    console.log(res[0], '结果')
    return res[0]
  } catch (error) {
    throw new Error(error)
  }
}
// 根据sql查询excle内容
Excel.prototype.execute = function (sql) {}
util.inherits(Excel, DbConn)
module.exports = Excel
