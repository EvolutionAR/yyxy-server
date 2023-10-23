const utils = require('util')
const DbConn = require('../base-datasource')
const { MongoClient } = require('mongodb')

function MongoDB(config, service) {
  const host = String(config.host.replace('http://', '') || '')
  const user = String(config.username || '')
  const database = String(config.database || '')
  const port = Number(config.port || 27017)
  const password = String(config.password || '')
  this.config = {
    uri: `mongodb://${user}:${password}@${host}:${port}/${database}`
  }
  this.config = Object.assign(config, this.config)
}

utils.inherits(MongoDB, DbConn)

MongoDB.prototype.getFieldList = async function (config) {
  const client = new MongoClient(this.config.uri, {
    authSource: this.config.authSource || 'admin'
  })
  await client.connect()

  const map = function () {
    for (var myKey in this) {
      emit(myKey, null)
    }
  }
  const reduce = function (myKey, s) {
    return null
  }
  const fileds = await client
    .db(this.config.database)
    .collection(config.tbName + '_k')
    .find({})
    .toArray()
  await client.db(this.config.database).dropCollection(config.tbName + '_k')
  await client.close()
  return fileds.map(item => {
    return item._id
  })
}

// 获取集合名称
MongoDB.prototype.getTreeList = async function (config) {
  const client = new MongoClient(this.config.uri, {
    authSource: this.config.authSource || 'admin'
  })
  await client.connect()
  const collections = await client.db(this.config.database).command({
    listCollections: 1.0,
    authorizedCollections: true,
    nameOnly: true
  })
  const treelist =
    collections.cursor.firstBatch &&
    collections.cursor.firstBatch.map(item => {
      return { name: item.name }
    })
  await client.close()
  return treelist
}
// 获取数据库名称
MongoDB.prototype.dblist = async function () {
  const client = new MongoClient(this.config.uri, {
    authSource: this.config.authSource || 'admin'
  })
  await client.connect()
  const adminDb = client.db(this.config.database).admin()
  const dbs = await adminDb.listDatabases()
  const dblist =
    dbs.databases &&
    dbs.databases.map((item, index) => {
      return item.name
    })
  await client.close()
  return dblist
}

MongoDB.prototype.getData = async function (
  baseConfig,
  componentConfig,
  queryParams
) {
  const client = new MongoClient(this.config.uri, {
    authSource: this.config.authSource || 'admin'
  })
  await client.connect()
  if (!componentConfig.sql) {
    return []
  }
  let sql = eval(componentConfig.sql)
  const collections = client
    .db(this.config.database)
    .collection((componentConfig && componentConfig.tbName) || 'resources')
    .aggregate(sql)
  const dataRes = await collections.toArray()
  await client.close()
  return dataRes
}
exports = module.exports = MongoDB
