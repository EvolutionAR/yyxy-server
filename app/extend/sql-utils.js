const SeatomException = require('../exception/seatomException')
const { ERROR_CODES } = require('./constant')
const _ = require('lodash')
const { formatString } = require('./utils')

function wrapAggregate(func, arg, type, field_type, element) {
  // to_do: 把传入的字段包成聚合函数形式，字段不传就包1
  const aggregateFunctionList = [
    'sum',
    'avg',
    'max',
    'min',
    'count',
    'count_distinct'
    // 'sum_percent',//求和百分比
    // 'avg_percent', // 平均值百分比
    // 'max_percent',//最大值百分比
    // 'min_percent',// 最小值百分比
    // 'count_percent',// 计数字段百分比
    // 'count_distinct_percent'// 去重计数百分比
  ]
  const funcIndex = aggregateFunctionList.indexOf(func)
  if (funcIndex == -1 && func.indexOf('percent') < 0) {
    throw new SeatomException(ERROR_CODES.SQL_ERROR, '不支持的聚合函数')
  }
  const realArg = arg ? arg : 1
  var format = ``
  if (funcIndex == 5) {
    format = `count(distinct {0})`
  } else if (funcIndex <= 4) {
    if (type == 'mysql' || type == 'oracle') {
      format = `${func}({0})`
    } else if (type == 'postgresql') {
      format = `${func}({0}) as "${func}({0})"` //postgresql必须添加
    } else {
      if (field_type && field_type == 'date') {
        format = `${func}({0})`
      } else if (field_type && field_type == 'string') {
        format = `${func}({0})`
      } else {
        format = `${func} (cast({0} as double))`
      }
    }
  } else {
    format = `${func}({0})`
  }
  return format.format(realArg)
}

/**
 *
 * @param {string} func1 要拼接的sql 函数
 * @param {string} func2 要拼接的sql 函数1
 * @param {string} arg1 字段fid
 * @param {string} arg2 第二个参数非必要字段用于生成百分位
 * @param {string} type 数据源id
 * @param {string} field_type 字段类型 非必要字段
 * @param {object} element elment.advance高级计算 elment.advance高级计算，
 * elment.caclulateType： 'percenttitle' -百分位 'percentage'-百分比
 * @returns {string} sql string
 */
function advanceFunction(func1, func2, arg1, arg2, type, field_type, element) {
  const realArg = arg1 ? arg1 : 1

  if (element && element.caclulateType === 'percentage') {
    // 处理高级计算功能
    if (func1 + '_' + func2 == 'count_distinct_percent') {
      // 百分比
      format = `${func1}({0})/(SUM(count(distinct({0}))) over())`
    } else {
      format = `${func1}({0})/(SUM(${func1}({0})) over())`
    }
  } else if (element.caclulateType == 'percenttitle') {
    //百分位
    if (!func2) {
      format = `${func1}({0},{1} / 100})`
      return format.format(realArg, arg2)
    } else {
      format = `PERCENT({0},{1} / 100})/(SUM(PERCENT({0},{1} / 100})) over())` //百分位-百分比
      return format.format(realArg, arg2)
    }
  } else if (element.caclulateType == '') {
    //环比
  }
}

/**
 * 同比环比
 * @param {string} caculateColumns
 * @param {string} table
 * @param {是否需要连表} needJoin
 * @param {聚合类型} type
 */
function comparison(caculateColumns, dateFiled, table, type = 'SUM') {
  const sql = `SELECT
            t.datayear as '年份',
            CASE
                    WHEN y.sumnumIS NULL
                    OR y.sumnum = 0 THEN
                        0.00 ELSE round(( t.sumnum} - y.sumnum ), 2 )
                    END  '增长值'
            FROM
                ((
                    SELECT DATE_FORMAT( ${dateFiled}, '%Y' ) datayear, 
                            ${type}(${caculateColumns} ) sumnum
                    FROM ${table} GROUP BY datayear ) t
                    LEFT JOIN ( SELECT
                                DATE_FORMAT( date_add( ${dateFiled}, INTERVAL 1 YEAR ), '%Y' ) tomorrow,
                                    ${type}( ${caculateColumns} ) sumnum 
                    FROM ${table} GROUP BY tomorrow) y ON t.datayear = y.tomorrow 
                ) GROUP BY 年份,增长值
        `
}

// 临时表
function TempTable(table) {
  const sql = `SELECT DATE_FORMAT(table) `
  return sql
}

/**
 * 自定义函数列表
 * @param {自定义函数名 String} func
 * @param {fid字段 String} arg
 */
function calulateDate(func, arg) {
  const functions = [
    'caculate_year',
    'caculate_quarter',
    'caculate_month',
    'caculate_day',
    'caculate_hour',
    'caculate_min',
    'caculate_second',
    'caculate_week'
  ]
  let sql = ''
  if (!functions.includes(func)) {
    return
  }
  switch (func) {
    case 'caculate_year':
      sql = `year(${arg})`
      break
    case 'caculate_quarter': //季度
      sql = ` CONCAT(
                year(${arg}),
                "年",
                "第",
                QUARTER(${arg}),
                '季度'
              )`
      break
    case 'caculate_month': // 月
      sql = `SUBSTR(${arg},1,7)`
      break
    case 'caculate_week': //周
      sql = `CONCAT(
                STRING_SPLIT(WEEK(${arg}), ' ', 0),
                "年",
                "第",
                STRING_SPLIT(WEEK(${arg}), ' ', 1),
                "周"
              )`
      break
    case 'caculate_day':
      sql = `SUBSTR(${arg},1,10)`
      break
    case 'caculate_hour':
      sql = `SUBSTR(${arg},1,13)`
      break
    case 'caculate_min':
      sql = `SUBSTR(${arg},1,16)`
      break
      common
    case 'caculate_second':
      sql = `SUBSTR(${arg},1,19)`
      break
    default:
      break
  }
  return sql
}

function buildSelectSql(
  table,
  selectList,
  whereList,
  groupByList,
  orderByList,
  limit,
  type
) {
  var selectStr =
    !selectList || selectList.length == 0 ? '*' : selectList.join(',')
  //todo: 没想好whereList的结构。。。
  var whereStr = whereList ? ' where ' + whereList : ''
  var groupStr =
    !groupByList || groupByList.length == 0
      ? ''
      : 'group by ' + groupByList.join(',')
  // todo: orderStr需要考虑asc和desc
  if (type == 'oracle') {
    whereStr = whereStr
      ? whereStr + 'AND ROWNUM<=' + (limit || 5000)
      : ' where ROWNUM<= ' + (limit || 5000)
  }
  var orderStr =
    !orderByList || orderByList.length == 0
      ? ''
      : 'order by ' + orderByList.join(',')
  var limitStr = ''
  if (type == 'oracle') {
    limitStr = ''
  } else {
    limitStr = 'limit ' + (limit ? limit : 50)
  }
  var format = 'select {0} from {1} {2} {3} {4} {5}'
  if (type == 'oracle') {
    return format.format(
      selectStr,
      '"' + table + '"',
      whereStr,
      groupStr,
      orderStr,
      limitStr
    )
  } else {
    return format.format(
      selectStr,
      table,
      whereStr,
      groupStr,
      orderStr,
      limitStr
    )
  }
}

function buildGroupFieldSql(params) {
  // 拼装分组字段sql
  const fid = params.fid
  const groups = params.groups
  let caseWhenList = []
  groups.forEach(group => {
    let conditions = []
    group.conditions.forEach(condition => {
      // 数值字段保留，文本和日期加上双引号再拼公式
      // 其实应该用data_type去判断的，暂时没有传整个参，偷个懒直接判断类型
      let value = Number.isFinite(condition.value)
        ? condition.value
        : '"' + condition.value + '"'
      const conditionSql = _conditionToSql(condition.operator, fid, value)
      conditions.push(conditionSql)
    })
    const concatOperator = ' ' + group.logic + ' '
    const caseWhenSql = conditions.join(concatOperator)
    caseWhenList.push(' when ' + caseWhenSql + ' then "' + group.name + '"')
  })
  const finalSql =
    'case' + caseWhenList.join(' ') + ' else "' + params.default + '" end'
  return finalSql
}

function _conditionToSql(operator, field, value) {
  // 根据运算符和参数，返回对应的条件匹配sql
  const stringFormatParamMap = {
    field: field,
    value: value
  }
  const operatorFormatMap = {
    1: '${field}>${value}', // 大于
    2: '${field}<${value}', // 小于
    3: '${field}=${value}', // 等于
    4: '${field}>=${value}', // 大于等于
    5: '${field}<=${value}', // 小于等于
    6: 'instring(${field},${value}) != 0', // 包含
    7: 'instring(${field},${value}) = 0' // 不包含
  }

  const sql = formatString(operatorFormatMap[operator], stringFormatParamMap)
  return sql
}

// 工具函数，java中的String.format
String.prototype.format = function () {
  if (arguments.length == 0) {
    return this
  }
  for (var s = this, i = 0; i < arguments.length; i++) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'g'), arguments[i])
  }
  return s
}

function replaceNameToFid(formula, nameToFidMap) {
  if (!nameToFidMap || !formula) {
    return formula
  }
  // 把所有[name]替换成map中对应的fid
  var reg = new RegExp('\\[(.*?)]', 'g')
  var keyList = Array.from(formula.matchAll(reg), x => x[0])
  var result = formula
  keyList.forEach(element => {
    // element: ${xxxxx}, key: xxxxx
    let key = element.slice(1, element.length - 1)
    let value = _.get(nameToFidMap, key)
    if (!value) {
      throw new SeatomException(
        ERROR_CODES.FIELD_NOT_EXIST,
        '字段 ' + key + ' 不存在'
      )
    }
    result = result.replace(element, value)
  })
  return result
}

function dmcErrorCodeTranslate(code) {
  // dmc计算字段公式校验只返回错误码，没返回错误原因。。。需要自己转换
  const codeMap = {
    7708: 'NOT_SUPPORT_SINGLE_PARTITION',
    7707: 'INVALID_FIELD',
    7700: 'FORMULA_ERROR',
    7710: 'INVALID_ARGUMENTS',
    7711: 'MISSING_ORDER_BY',
    7712: 'INVALID_AGGREGATE_USAGE',
    7706: 'INVALID_FUNCTION',
    7709: 'NOT_SUPPORT_AGGREGATE',
    7713: 'NOT_SUPPORT_WINDOW_FUNCTION'
  }
  return codeMap[code] || 'UNKNOWN_ERROR'
}

// 生成拼接的左括号
function generateSign(length) {
  let sign = ' '
  for (let i = 1; i < length; i++) {
    sign += '('
  }
  return sign
}

const compare = {
  number: {
    equal: `={0}`,
    unequal: '!={0}',
    greater: '>{0}',
    less: '<{0}',
    greaterOrEqual: '>={0}',
    lessOrEqual: '<={0}',
    range: `between {0} and {1}`,
    notNull: 'is not null',
    null: 'is null'
  },
  date: {
    equal: '={0}',
    unequal: '!={0}',
    greater: '>{0}',
    less: '<{0}',
    greaterOrEqual: '>={0}',
    lessOrEqual: '<={0}',
    dateRange: `between {0} and {1}`,
    notNull: 'is not null',
    null: 'is null',
    today: `>= {0} and {1} <={2}`,
    lastday: `>= {0} and {1} <={2}`,
    last7Days: `>= {0} and {1} <={2}`,
    last30Days: `>= {0} and {1} <={2}`,
    last90Days: `>= {0} and {1} <={2}`,
    lastYear: `>= {0} and {1} <={2}`
  },
  string: {
    equal: '={0}',
    unequal: '!={0}',
    contain: ` like "%{0}%" `,
    notContain: ` not like "%{0}%" `,
    matchOnStart: ` like "{0}%" `,
    matchOnEnd: ` like "%{0}"`,
    notNull: 'is not null',
    null: ' is null ',
    range: ' in ( {0} ) ',
    in: 'in ( {0} )'
  }
}
module.exports = {
  wrapAggregate,
  buildSelectSql,
  replaceNameToFid,
  dmcErrorCodeTranslate,
  buildGroupFieldSql,
  compare,
  calulateDate,
  generateSign
}
