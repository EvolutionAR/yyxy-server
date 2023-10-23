// 重新还原db
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');
let mongoConfig;
const ev = process.argv[2];
if (!ev) {
    return;
}
// 要还原的集合名称   手动设置还原集合名称
const needRestoreCollections = ["covers"];
// 要还原的集合json路径 手动设置路径
const collectionPath = '/Users/gqz/bak/collections-2021-11-29/';
// mongo配置文件
mongoConfig = {
    host: '127.0.0.1', //ip
    port: 27017, //端口
    user: 'root', // 用户名
    password: '123456', // 密码
    database: 'seatom-test',//数据库名称
    authSource: 'admin' // 认证数据库名
}
async function restoreOneCollection() {
    try {
        const uri = `mongodb://${mongoConfig.user}:${mongoConfig.password}@${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`
        const client = new MongoClient(uri, { authSource: mongoConfig.authSource });
        await client.connect();
        const db = client.db(mongoConfig.database);
        const collections = await db.command({ listCollections: 1.0, authorizedCollections: true, nameOnly: true });
        const treelist = collections.cursor.firstBatch && collections.cursor.firstBatch.map((item => { return { name: item.name } }));
        for (const tree of treelist) {
            if (needRestoreCollections.includes(tree.name)) {
                console.log(tree.name, collectionPath, path.join(collectionPath, tree.name + '.json'));
                const restorePath = require(path.join(collectionPath, tree.name + '.json'));
                await db.collection(tree.name).deleteMany({});
                await db.collection(tree.name).insert(restorePath);
            }
        }
        client.close();
    } catch (e) {
        console.log("restoredb Error:", e);
    }
}
restoreOneCollection();