

var oracledb = require("oracledb");
function Oracle(config, service) {
    this.config = {
        user: String(config.username||'system'),
        password: String(config.password||'oracle'),
        connectString: String(config.host || "127.0.0.1")
            + ":"
            + Number(config.port || 1521)
            + '/'
            + (config.database || "xe")
    };
    this.config = Object.assign(config, this.config);
}

Oracle.prototype.dblist = async function () {
    var sql = "select schema_name from information_schema.schemata;";
    const res = await this.execute(sql);
    return res;
};

Oracle.prototype.getData = async function (baseConfig, data) {
    var sql = data.sql;
    return await this.query(sql);
}

Oracle.prototype.query = async function (sql) {
    if (!sql || typeof sql != "string") {
        throw new Error("sql statement format is illegal");
    }

    sql = sql.replace(/^\s+|\s+$/g, "");

    if (sql.substring(0, 6).toLowerCase() != "select") {
        throw new Error("query sql must start with 'select'");
    }

    const res = await this.execute(sql);
    return res;
}

Oracle.prototype.execute = function (sql) {
    const _this = this;
    return new Promise(function (resolve, reject) {
        console.log(_this.config)
        oracledb.createPool(_this.config,(err,pool)=>{
	    console.log(err)
            pool.getConnection((error, connection) => {
                connection.execute(sql, (error,data) => {
                    console.log(error,data)
                    resolve(data)
                    connection.close();
                });
            });
        })
    });
};

new Oracle({}).execute("select * from tab").then((data) => {
    console.log(data);
})

