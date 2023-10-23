var utils = require('util')
const DbConn = require('../base-datasource')
var pg = require('pg')
const { PG_TYPES } = require('../../extend/constant')

// 数据库配置
function PostGreSql(config, service) {
  this.config = {
    user: String(config.username) || 'postgres',
    database: config.database,
    host: String(config.host) || 'localhost',
    password: String(config.password) || '123456',
    port: config.port || 5432,
    // 扩展属性
    max: 20, // 连接池最大连接数
    idleTimeoutMillis: 3000 // 连接最大空闲时间 3s
  }
  // 拼接其他属性，已设置的属性优先级较高
  this.config = Object.assign(config, this.config)
}

utils.inherits(PostGreSql, DbConn)

PostGreSql.prototype.dblist = async function () {
  var sql = 'select schema_name from information_schema.schemata;'
  const res = await this.execute(sql)
  return res
}

// 查询所有表

PostGreSql.prototype.getTreeList = async function () {
  var sql = "select tablename from pg_tables where schemaname='public'"
  const res = await this.execute(sql)
  return res
}

// 查询所有字段
PostGreSql.prototype.getFieldList = async function (config) {
  const sql = `select column_name as name, data_type as data_type from information_schema.columns where table_schema ='public' and table_name = '${config.tbName}' ;`
  // 处理返回的数据类型
  const res = await this.execute(sql)
  let dateFields = [],
    stringFields = [],
    numberFields = []
  res.rows.map((item, value) => {
    if (PG_TYPES.STRING_TYPE.includes(item.data_type.toUpperCase())) {
      stringFields.push(item)
    }
    if (PG_TYPES.NUMBER_TYPE.includes(item.data_type.toUpperCase())) {
      numberFields.push(item)
    }
    if (PG_TYPES.DATE_TYPE.includes(item.data_type.toUpperCase())) {
      dateFields.push(item)
    }
  })
  const fieldList = []
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

// PostGreSql.prototype.getData = async function (baseConfig, data) {
//     var sql = data.sql;
//     return await this.query(sql);
// }

PostGreSql.prototype.getData = async function (
  baseConfig,
  componentConfig,
  queryParams
) {
  console.log(baseConfig, componentConfig, queryParams, '基本数据')
  const sql = this.hanleData(
    baseConfig,
    componentConfig,
    queryParams,
    'postgresql'
  )
  console.log(sql, 'shu句---------------')
  const mysqlResult = await this.query(sql)
  console.log(mysqlResult, '返回的数据========')
  return mysqlResult
}

PostGreSql.prototype.query = async function (sql) {
  // 校验sql变量格式
  if (!sql || typeof sql != 'string') {
    throw new Error('sql statement format is illegal')
  }

  // 去掉sql两端空格
  sql = sql.replace(/^\s+|\s+$/g, '')

  // 做一个简单的sql校验，防止用户写了个drop之类的东西搞事情
  if (sql.substring(0, 6).toLowerCase() != 'select') {
    throw new Error("query sql must start with 'select'")
  }

  const res = await this.execute(sql)
  return res
}

PostGreSql.prototype.execute = function (sql) {
  // to_do: 目前为了防止连接数过多，采取查完即关闭连接，需要优化
  // var connection = pg.createConnection(this.config);
  var pool = new pg.Pool({
    host: this.config.host,
    port: this.config.port,
    user: this.config.username,
    password: this.config.password,
    database: this.config.database
  })
  console.log(this.config, '数据库配置')
  return new Promise(function (resolve, reject) {
    pool.connect(function (err, client, done) {
      if (err) {
        reject(err)
        return
      }
      client.query(sql, function (err, result) {
        done()
        if (err) {
          reject(err)
          return
        }
        resolve(result)
      })
    })
  })
}

exports = module.exports = PostGreSql
