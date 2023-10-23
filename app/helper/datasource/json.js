const DbConn = require('../base-datasource')
const util = require('util')
const path = require('path')
const fs = require('fs-extra')
const SeatomException = require('../../exception/seatomException')
const { ERROR_CODES } = require('../../extend/constant')

function JSONDATA(config, service) {
  this.appConfig = service.config
}

JSONDATA.prototype.getData = async function (baseConfig, componentConfig) {
  const { filePath } = baseConfig
  if (!filePath) {
    throw new SeatomException(ERROR_CODES.FILE_NOT_EXIST, '未找到JSON文件')
  }
  const filename = path.basename(filePath)
  const jsonFilePath = path.join(
    this.appConfig.resourcePath,
    'personal',
    filename
  )
  const rawdata = await fs.readFileSync(jsonFilePath, 'utf-8')
  try {
    const jsonArray = JSON.parse(rawdata)
    return jsonArray
  } catch (e) {
    const jsonData = eval('(' + rawdata + ')')
    return jsonData
  }
}

JSONDATA.prototype.preview = async function (baseConfig) {
  const jsonArray = await this.getData(baseConfig, {})
  return jsonArray.slice(0, jsonArray.length >= 10 ? 10 : jsonArray.length)
}
util.inherits(JSONDATA, DbConn)

module.exports = JSONDATA
