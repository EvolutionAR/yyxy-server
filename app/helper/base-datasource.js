'use strict'
const SeatomException = require('../exception/seatomException')
const {
  buildSelectSql,
  replaceNameToFid,
  wrapAggregate,
  compare,
  generateSign
} = require('../extend/sql-utils')
const { ERROR_CODES } = require('../extend/constant')
const moment = require('moment')
const { findIndex } = require('lodash')
function DbConn(config) {}

// 数据源基类。子类不必实现基类中的所有方法，按需即可
DbConn.prototype = {
  // 返回数据库列表
  dblist: function () {
    console.log('DbConn dblist')
  },

  // 获取数据
  getData: function (baseConfig, data, params) {
    // baseConfig是datastorage表里的信息，data是component表dataConfig.dataResponse[type].data，即组件的数据个性化配置
    // 不同数据源有不同的配置，在具体实现中进行处理
    console.log('base-datasource getData')
  },

  // 获取表结构
  getFieldList: function (baseConfig, data) {
    console.log('base-datasource getFieldList')
  },

  // 获取文件夹树形结构，目前仅用于dmc
  getTreeList: function (baseConfig, data) {
    console.log('base-datasource getTreeList')
  },

  // 获取文件夹下工作表列表，目前仅用于dmc
  getFolderTbList: function (baseConfig, data) {
    console.log('base-datasource getFolderTbList')
  },

  // 数据表搜索
  searchTb: function (baseConfig, data) {
    console.log('base-datasource searchTb')
  },

  // 数据表预览
  preview: function (datastorageConfig) {
    console.log('base-datasource preview')
  },

  //for mysql pg处理数据
  hanleData(baseConfig, componentConfig, queryParams, dateBaseType) {
    // console.log(JSON.stringify(componentConfig),queryParams)
    // 记录四个模块的内容
    var selectList = [],
      whereList = '',
      groupByList = [],
      orderByList = []
    if (!queryParams.workspaceId) {
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
        selectList.push(element.name)
        groupByList.push(element.name)
        orderByList.push(element.name)
        // 有别名加别名，没有别名字段先加名称
        fieldList.push(element.name)
      }
    })

    // 处理数值字段列表
    const numerical = componentConfig.fields.numericalValue
    numerical.forEach((element, index) => {
      if (element.name && element.calculation) {
        const fieldStr = wrapAggregate(
          element.calculation,
          element.name,
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
        if (relative.includes(item.compare)) {
          item.compareValue = this.relativeDate(item)
        }
        if (item.type == 'date' && dateBaseType == 'oracle') {
          whereSql +=
            index == 0
              ? ` ${generateSign(where.whereCondition.length)} ` +
                `to_char(` +
                item.field +
                `,'yyyy-mm-dd hh24:mi:ss')` +
                ` `
              : `to_char(` + item.field + `,'yyyy-mm-dd hh24:mi:ss')` + ` `
        } else {
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
          } else if (
            item.compare == 'unequal' &&
            dateBaseType == 'oracle' &&
            item.type == 'date'
          ) {
            whereSql +=
              index == 0
                ? ` ${generateSign(where.whereCondition.length)} ` +
                  `nvl('` +
                  item.field +
                  `',' ')` +
                  ` `
                : `nvl('` + item.field + `',' ')` + ` `
          } else if (
            item.compare == 'unequal' &&
            dateBaseType == 'postgresql' &&
            item.type == 'date'
          ) {
            whereSql +=
              index == 0
                ? ` ${generateSign(where.whereCondition.length)} ` +
                  `coalece('` +
                  item.field +
                  `',' ')` +
                  ` `
                : `coalece('` + item.field + `',' ')` + ` `
          } else {
            whereSql +=
              index == 0
                ? ` ${generateSign(where.whereCondition.length)} ` +
                  item.field +
                  ` `
                : item.field + ` `
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
                [
                  'matchOnEnd',
                  'matchOnStart',
                  'notContain',
                  'contain'
                ].includes(item.compare)
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
                  .replace('{1}', item.fid)
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
        const orderByListIndex = findIndex(orderByList, item.field)
        if (orderByListIndex > -1) {
          delete orderByList[orderByListIndex]
          orderByList.unshift(item.field + ' ' + item.orderBy)
        } else {
          orderByList.unshift(item.field + ' ' + item.orderBy)
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
      componentConfig.tbName,
      selectList,
      whereList,
      groupByList,
      orderByList,
      5000,
      queryParams.type || dateBaseType
    )
    console.log('>>>>>>>><<<<<<<<<<>>>>>', sql)
    return sql
  },

  // 相对时间
  relativeDate(item) {
    let startTime, endTime
    console.log(item)
    switch (item.compare) {
      case 'today':
        startTime = moment().startOf('days').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().endOf('days').format('YYYY-MM-DD HH:mm:ss')
        break
      case 'lastday':
        startTime = moment()
          .subtract(1, 'days')
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        endTime = moment()
          .subtract(1, 'days')
          .endOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
        break
      case 'last7Days':
        startTime = moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        break
      case 'last30Days':
        startTime = moment().subtract(30, 'days').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        break
      case 'last90Days':
        startTime = moment().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        break
      case 'lastYear':
        startTime = moment().subtract(1, 'years').format('YYYY-MM-DD HH:mm:ss')
        endTime = moment().format('YYYY-MM-DD HH:mm:ss')
        break
    }
    return [startTime, endTime]
  }
}

module.exports = DbConn
