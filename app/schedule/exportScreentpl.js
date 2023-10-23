const Subscription = require('egg').Subscription
const fs = require('fs-extra')
const path = require('path')
const { cipher, decipher } = require('../extend/crypto')
class exportScreentpl extends Subscription {
  static get schedule() {
    return {
      cron: '00 00 03 * * *', // 每天凌晨3点定时
      // interval: '600s',
      type: 'worker',
      disable: false
    }
  }
  async subscribe() {
    if (this.config.env === 'prev') {
      this.ctx.logger.info('开始更新组件路径============', new Date())
      await this.ctx.curl('https://fuxi.haizhi.com/api/packcom/getcomjson', {
        method: 'POST',
        data: {},
        rejectUnauthorized: false,
        dataType: 'json',
        timeout: 200000
      })
      this.ctx.logger.info('开始备份模版文件============', new Date())
      const result = await this.ctx.curl(
        'https://fuxi.haizhi.com/api/screentpl',
        {
          method: 'GET',
          data: {},
          rejectUnauthorized: false,
          dataType: 'json',
          timeout: 200000
        }
      )
      if (result.data.success && result.data.data) {
        for (let index = 0; index < result.data.data.length; index++) {
          const element = result.data.data[index]
          if (
            element.name === '疫情驾驶舱-tab切换' ||
            element.name === '空白模版' ||
            element.name === 'HLJ公安厅综合能力'
          ) {
            continue
          }
          const abc = await this.ctx.curl(
            'https://fuxi.haizhi.com/api/screen/export',
            {
              method: 'GET',
              data: {
                id: element.screenId,
                isTiming: true
              },
              rejectUnauthorized: false,
              dataType: 'json',
              timeout: 200000
            }
          )
          this.ctx.logger.info('备份模版信息', abc)
        }
      }
      this.ctx.logger.info('备份模版文件结束=============', new Date())
    }
  }
}

module.exports = exportScreentpl
