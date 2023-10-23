var utils = require('util')
const DbConn = require('../base-datasource')
var oracledb = require('oracledb')
const { ERROR_CODES, ORACLE_TYPES } = require('../../extend/constant')

function Oracle(config, service) {
  this.config = {
    user: String(config.username || 'system'),
    password: String(config.password || 'oracle'),
    connectString:
      String(config.host || '127.0.0.1') +
      ':' +
      Number(config.port || 1521) +
      '/' +
      (config.sid || '')
  }
  delete config.username
  this.config = Object.assign(config, this.config)
}

utils.inherits(Oracle, DbConn)

Oracle.prototype.getFieldList = async function (config) {
  const sql = `select COLUMN_NAME,DATA_TYPE from user_tab_columns where table_name='${config.tbName}'`
  const newsql = `SELECT t.owner AS table_schem,
    t.column_name AS column_name,
DECODE(  (SELECT a.typecode
  FROM ALL_TYPES A
  WHERE a.type_name = t.data_type),
'OBJECT', 2002,
'COLLECTION', 2003,
DECODE(substr(t.data_type, 1, 9),
 'TIMESTAMP',
   DECODE(substr(t.data_type, 10, 1),
     '(',
       DECODE(substr(t.data_type, 19, 5),
         'LOCAL', -102, 'TIME ', -101, 93),
     DECODE(substr(t.data_type, 16, 5),
       'LOCAL', -102, 'TIME ', -101, 93)),
 'INTERVAL ',
   DECODE(substr(t.data_type, 10, 3),
    'DAY', -104, 'YEA', -103),
 DECODE(t.data_type,
   'BINARY_DOUBLE', 101,
   'BINARY_FLOAT', 100,
   'BFILE', -13,
   'BLOB', 2004,
   'CHAR', 1,
   'CLOB', 2005,
   'COLLECTION', 2003,
   'DATE', 93,
   'FLOAT', 6,
   'LONG', -1,
   'LONG RAW', -4,
   'NCHAR', -15,
   'NCLOB', 2011,
   'NUMBER', 2,
   'NVARCHAR', -9,
   'NVARCHAR2', -9,
   'OBJECT', 2002,
   'OPAQUE/XMLTYPE', 2009,
   'RAW', -3,
   'REF', 2006,
   'ROWID', -8,
   'SQLXML', 2009,
   'UROWID', -8,
   'VARCHAR2', 12,
   'VARRAY', 2003,
   'XMLTYPE', 2009,
   1111)))
AS data_type,
    t.data_type AS type_name,
    t.column_id AS ordinal_position
FROM all_tab_cols t
WHERE t.table_name = '${config.tbName}'
ORDER BY table_schem, table_name, ordinal_position`
  const res = await this.execute(newsql)
  let dateFields = [],
    stringFields = [],
    numberFields = []
  res.rows.map((item, value) => {
    if (ORACLE_TYPES.STRING_TYPE.includes(item[3])) {
      stringFields.push({ name: item[1], data_type: item[3] })
    }
    if (ORACLE_TYPES.NUMBER_TYPE.includes(item[3])) {
      numberFields.push({ name: item[1], data_type: item[3] })
    }
    if (ORACLE_TYPES.DATE_TYPE.includes(item[3])) {
      dateFields.push({ name: item[1], data_type: item[3] })
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

Oracle.prototype.dblist = async function () {
  // 查询数据库名
  var sql = ' select ora_database_name as name from dual '
  const res = await this.execute(sql)
  return res
}

Oracle.prototype.getTreeList = async function (config) {
  // 视图和表的所有名称
  const sql = ` select table_name as tablename from all_tab_comments `
  const res = await this.execute(sql)
  return res
}

Oracle.prototype.getData = async function (
  baseConfig,
  componentConfig,
  queryParams
) {
  const sql = this.hanleData(baseConfig, componentConfig, queryParams, 'oracle')
  const mysqlResult = await this.query(sql)
  return mysqlResult
}

Oracle.prototype.query = async function (sql) {
  if (!sql || typeof sql != 'string') {
    throw new Error('sql statement format is illegal')
  }

  sql = sql.replace(/^\s+|\s+$/g, '')

  if (sql.substring(0, 6).toLowerCase() != 'select') {
    throw new Error("query sql must start with 'select'")
  }

  const res = await this.execute(sql)
  return res
}

Oracle.prototype.execute = function (sql) {
  const _this = this
  return new Promise(function (resolve, reject) {
    console.warn(_this.config)
    oracledb.createPool(_this.config, (err, pool) => {
      if (err) {
        reject(err)
        return
      }
      pool.getConnection((error, connection) => {
        if (error) {
          reject(error)
          return
        }
        connection.execute(sql, (e, data) => {
          if (e) {
            reject(e)
            return
          }
          resolve(data)
          connection.close()
        })
      })
    })
  })
}

exports = module.exports = Oracle
