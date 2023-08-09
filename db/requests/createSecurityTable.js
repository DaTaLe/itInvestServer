let sqlReq = `CREATE TABLE IF NOT EXISTS "security" ("id"   SERIAL, 
                                                    "seccode" VARCHAR(255), 
                                                    "price" INTEGER, 
                                                    "isin" VARCHAR(255), 
                                                    "lotsize" INTEGER, PRIMARY KEY ("id"))`

async function createSecurityTable() {
    return await this.query(sqlReq);
}

module.exports = createSecurityTable;