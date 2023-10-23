const Subscription = require('egg').Subscription
const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')
const moment = require('moment')
class BackUpDB extends Subscription {
  static get schedule() {
    return {
      cron: '00 00 02 * * *', // 每天凌晨2点定时
      // interval: '10s',
      type: 'worker',
      disable: false
    }
  }
  async subscribe() {
    if (['local'].includes(process.env.EGG_SERVER_ENV)) {
      return
    }
    try {
      const mongoConfig = this.ctx.app.config.mongoose
      const user = mongoConfig.client.options.user
      const password = mongoConfig.client.options.pass
      const host = mongoConfig.client.url.split(':')[1].split('//')[1]
      const port = mongoConfig.client.url.split(':')[2].split('/')[0]
      const database = mongoConfig.client.url.split('/')[3]
      const authSource = mongoConfig.client.options.auth.authSource

      const uri = `mongodb://${user}:${password}@${host}:${port}/${database}`
      const client = new MongoClient(uri, { authSource: authSource })
      await client.connect()
      const db = client.db(this.config.database)
      const collections = await db.command({
        listCollections: 1.0,
        authorizedCollections: true,
        nameOnly: true
      })
      const treelist =
        collections.cursor.firstBatch &&
        collections.cursor.firstBatch.map(item => {
          return { name: item.name }
        })
      const before7Days = path.join(
        this.ctx.app.baseDir,
        '..',
        '/bak/collections-' + moment().subtract(7, 'days').format('YYYY-MM-DD')
      ) //文件夹路径
      for (const tree of treelist) {
        const collection = await db.collection(tree.name).find({}).toArray() // 内容
        const bakDir = path.join(
          this.ctx.app.baseDir,
          '..',
          '/bak/collections-' + moment().format('YYYY-MM-DD')
        ) //文件夹路径
        if (!fs.existsSync(bakDir)) {
          fs.mkdirSync(bakDir, { recursive: true })
        }
        let bakDirPath = path.join(bakDir, tree.name + '.json') //文件名
        this.ctx.logger.info('bakDirPath', bakDirPath)
        fs.writeFileSync(bakDirPath, JSON.stringify(collection))
      }
      if (fs.existsSync(before7Days)) {
        //删除七天前
        console.log('删除七天前数据')
        fs.rmdirSync(before7Days, { recursive: true })
      }
      client.close()
    } catch (e) {
      this.ctx.logger.info('bakupdb error:', e)
      console.error(e)
    }
  }
}

module.exports = BackUpDB
