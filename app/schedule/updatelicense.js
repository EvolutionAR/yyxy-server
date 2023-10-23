const Subscription = require('egg').Subscription
const fs = require('fs-extra')
const path = require('path')
const { cipher, decipher } = require('../extend/crypto')
class UpdateLicense extends Subscription {
  static get schedule() {
    return {
      cron: '59 59 23 * * *', //每天23:59:59s执行
      // interval: '10s',
      type: 'worker',
      disable: false,
      env: ['prod']
    }
  }
  // async subscribe() {
  //     const { ctx, config } = this
  //     const serverIp = config.serverIp
  //     const filePath = path.join(__dirname, '..', '..', 'licence.txt')
  //     const cipherData = cipher('0')
  //     if (!fs.existsSync(filePath)) {
  //         await fs.writeFileSync(filePath, cipherData, (err) => {
  //             if (err) throw err;
  //         });
  //     } else {
  //         const data = await fs.readFileSync(filePath, 'utf-8')
  //         let days = parseInt(decipher(data)) - 1
  //         days = cipher(`${days}`)
  //         await fs.writeFileSync(filePath, days, (err) => {
  //             if (err) throw err;
  //         });
  //     }
  // }
  async subscribe() {
    const { ctx, config } = this
    const serverIp = config.serverIp
    const filePath = path.join(__dirname, '..', '..', 'licence.txt')
    const cipherData0 = cipher(`0&&${serverIp}`)
    if (!fs.existsSync(filePath)) {
      await fs.writeFileSync(filePath, cipherData0, err => {
        if (err) throw err
      })
    } else {
      const data = await fs.readFileSync(filePath, 'utf-8')
      const daystr = decipher(data).split('&&')[0]
      const ip = decipher(data).split('&&')[1]
      if (serverIp === ip) {
        let day = parseInt(daystr) - 1
        const cipherStr = cipher(`${day}&&${serverIp}`)
        await fs.writeFileSync(filePath, cipherStr, err => {
          if (err) throw err
        })
      } else {
        await fs.writeFileSync(filePath, cipherData0, err => {
          if (err) throw err
        })
      }
    }
  }
}

module.exports = UpdateLicense
