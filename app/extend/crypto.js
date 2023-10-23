const crypto = require('crypto')
const fs = require('fs-extra')
const path = require('path')
const CryptoJS = require('crypto-js')
const btoa = require('btoa')
const atob = require('atob')
const { SM2 } = require('gm-crypto')

let publicKeyPath = path.resolve(__dirname, 'rsa_public_key.pem')
let privateKeyPath = path.resolve(__dirname, 'rsa_private_key.pem')
const publicKey1 = fs.readFileSync(publicKeyPath).toString('ascii')
const privateKey1 = fs.readFileSync(privateKeyPath).toString('ascii')
//公钥加密
function encrypt(data) {
  return crypto.publicEncrypt(publicKey1, Buffer.from(data)).toString('base64')
}
//私钥解密
function decrypt(encrypted) {
  return crypto.privateDecrypt(
    privateKey1,
    Buffer.from(encrypted.toString('base64'), 'base64')
  )
}
// 对称加密 Date.now().toString().substring(0,6)
const key = '0132456789abcdef'
const iv = 'fedcba9876543210'
function cipher(str) {
  try {
    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    return cipher.update(str, 'utf8', 'hex') + cipher.final('hex')
  } catch (err) {
    return err.message || err
  }
}
function decipher(str) {
  try {
    const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
    return decipher.update(str, 'hex', 'utf8') + decipher.final('utf8')
  } catch (err) {
    return err.message || err
  }
}

const ikey = CryptoJS.enc.Utf8.parse('F212492324A249CG') // fuxistatic 转 F212492324A249CG
const ivv = CryptoJS.enc.Utf8.parse('ABCDEF1234123412') //

// 通用路径解密方法
function decryptPath(path) {
  const realDirname = pathAPI.dirname(path)
  const realExtname = pathAPI.extname(path)
  const cipherBasename = pathAPI.basename(path, realExtname)

  let encryptedHexStr = CryptoJS.enc.Hex.parse(cipherBasename)
  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  let decrypt = CryptoJS.AES.decrypt(srcs, ikey, {
    iv: ivv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)

  const realBasename = decryptedStr.toString()
  const realPath = pathAPI.join(realDirname, realBasename)

  return realPath
}

// 普通路径加密方法
function encryptPath(path) {
  const srcs = CryptoJS.enc.Utf8.parse(path)
  const encrypted = CryptoJS.AES.encrypt(srcs, ikey, {
    iv: ivv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  const httpBasename = encrypted.ciphertext.toString()

  let extname = ''
  const extnameArr = path.match(/\.(\w+)$/)
  if (extnameArr.length > 1) {
    extname = extnameArr[0]
  }

  const realPath = '/tfs/' + httpBasename + extname

  return realPath
}
// 国密加密方式
// const { publicKey, privateKey } = SM2.generateKeyPair()
const publicKey =
  '04bf2fb22ab0186fcbace214c6be905487625d799f5d3a8e6c830a00157b9c55c16ac449ccddc38922fa94f3d51b770abe1eacf33a5f688554bac0b4c4690a50d6'
const privateKey =
  '10cffac637b1a2a3ed6792960e2e62793750a15ad9544225f6e8de5134310da2'
function splitStr(str) {
  var len = Math.ceil(str.length / 100000)
  var arr = Array(len)
  var i = 0
  for (; i < len; i++) {
    // console.log('index: %s, len: %s, str: %s', i, len, str.length)
    arr[i] = str.substring(0, 100000)
    if (i < len) {
      str = str.substring(100000, str.length)
    }
  }
  return arr
}
function encryptSM2$$2(word) {
  var str = btoa(encodeURIComponent(JSON.stringify(word)))
  var arrStr = splitStr(str).map(s =>
    SM2.encrypt(s, publicKey, {
      inputEncoding: 'utf8',
      outputEncoding: 'base64'
    })
  )
  return arrStr.join('|')
}
function decryptSM2$$2(word) {
  // console.log('decryptSM2',word);
  var strs = word.split('|').map(s =>
    SM2.decrypt(s, privateKey, {
      inputEncoding: 'base64',
      outputEncoding: 'utf8'
    })
  )
  var json = JSON.parse(decodeURIComponent(atob(strs.join(''))))
  // var json = JSON.parse(strs)
  return json
}

module.exports = {
  encrypt,
  decrypt,
  cipher,
  decipher,
  encryptPath,
  decryptPath,
  decryptSM2$$2,
  encryptSM2$$2
}
