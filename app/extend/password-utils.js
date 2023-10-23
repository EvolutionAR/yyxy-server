const SeatomException = require('../exception/seatomException')
const { ERROR_CODES } = require('./constant')
const _ = require('lodash')
const base64 = require('base-64')
const md5 = require('md5')
const sm2 = require('sm-crypto').sm2

function getPassword(password, config) {
  const type = config.dmcAddress.cipher.toLowerCase()
  if (type == 'md5') {
    return md5(md5(password))
  } else if (type == 'base64') {
    return base64.encode(base64.encode(password))
  } else if (type == 'none') {
    return password
  } else if (type == 'smssl') {
    const publicKey = config.dmcAddress.publicKey
    const cipherMode = config.dmcAddress.cipherMode
    return sm2.doEncrypt(password, publicKey, cipherMode)
  } else {
    throw new SeatomException(
      ERROR_CODES.PARAMS_FORMAT_ERROR,
      '不支持的加密方式'
    )
  }
}

module.exports = {
  getPassword
}
