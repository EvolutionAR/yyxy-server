const fs = require('fs-extra');
const path = require('path');
const args = process.argv;
const userConfig = JSON.parse(args[2])
const authorizationTime = new Date().getTime()
const { cipher, decipher } = require('./app/extend/crypto');
let dbconfig = `{
  useUnifiedTopology: true,
  useCreateIndex: true,
}`
if (userConfig.dbauth) {
  dbconfig = `{
    useUnifiedTopology: true,
    useCreateIndex: true,
    auth: {
      authSource: "admin",
    },
    user: "${userConfig.dbuser}",
    pass: "${userConfig.dbpass}",
  }` 
}


const configProd = 
`const path = require('path')
const commonFunction = require('./config.common')
const pageURL = 'http://${userConfig.pageUrl}'
module.exports = (appInfo) => {
  const commonConfig = commonFunction(appInfo)
  commonConfig["security"]["domainWhiteList"].push(pageURL)
  commonConfig["mongoose"] = {
    client: {
      url: "mongodb://${userConfig.mongodbUrl}/seatom-prod",
      options: ${dbconfig}
    },
  }
  commonConfig["serverIp"] = "${userConfig.serverIp}"
  commonConfig["intranetIp"] = "${userConfig.webServerIp}"
  commonConfig['errorHandler']['data']['authorizationTime'] = ${authorizationTime}
  commonConfig["webServerIp"] = 'http://${userConfig.webServerIp}:8888'
  commonConfig["cluster"] = {
    listen: {
      path: "",
      port: ${userConfig.serverIpPort},
      hostname: "0.0.0.0",
    },
  }
  commonConfig["redis"] = {
    client: {
      port: 6379, // Redis port 
      host: '127.0.0.1', // Redis host 
      password: '',
      db: 0
    },
  }
  commonConfig['componentUrl'] = ''
  commonConfig['logger'] = {
    dir: path.join(appInfo.baseDir, '../seatom-server-logs')
  };
  commonConfig["dmcAddress"] = {
    address: "http://${userConfig.dmcIP}",
    tassadar: "http://${userConfig.dmcTassdar}",
    version: '2.0.6',
    cipher: "base64", // dmc登录时传输的密码加密方式，取值none, md5, smssl、base64，分别为不加密、md5、国密
    publicKey: '046d02ba2a33cd7b061ab63d2effdf7a672f021c491eaf7c71db5a9899342251df1a35290bcd444779d7923c56bb957932b5b5cdbf880fff5e28b0df794934add8', // 公钥，加密方式为国密时必须要填
    cipherMode: 1 // 1 - C1C3C2，0 - C1C2C3，默认为1，加密方式为国密时必须要填
  }
  return {
    ...commonConfig,
  }
}`
if (args.length>2) {
	const configPath = path.resolve(__dirname, '../seatom-server/config/config.prod.js')
  const filePath = path.resolve(__dirname, '../seatom-server/licence.txt')
  fs.writeFileSync(filePath, cipher(`90&&${userConfig.serverIp}`));
	fs.writeFileSync(configPath, configProd);
	console.log('配置更新完毕');
} else {
	console.error('配置出错, 程序退出！')
}


