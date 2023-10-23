const DbConn = require('../base-datasource')
const util = require('util')
const csvtojson = require('csvtojson')
const path = require('path')
const SeatomException = require('../../exception/seatomException')
const { ERROR_CODES } = require('../../extend/constant')

function CSV(config, service) {
  this.appConfig = service.config
}

CSV.prototype.getData = async function (baseConfig, componentConfig) {
  console.log(baseConfig, 'dassadasdasdsa')
  let { filePath } = baseConfig
  if (!filePath) {
    throw new SeatomException(ERROR_CODES.FILE_NOT_EXIST, '未找到CSV文件')
  }
  filePath = filePath.replace('public/', '/')
  const csvFilePath = path.resolve(this.appConfig.resourcePath, `./${filePath}`)
  const jsonArray = await csvtojson().fromFile(csvFilePath)
  return jsonArray
}

CSV.prototype.preview = async function (baseConfig) {
  const jsonArray = await this.getData(baseConfig, {})
  return jsonArray.slice(0, jsonArray.length >= 10 ? 10 : jsonArray.length)
}
util.inherits(CSV, DbConn)

module.exports = CSV
