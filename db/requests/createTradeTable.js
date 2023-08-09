let sqlReq = `CREATE TABLE IF NOT EXISTS "trade" ("id"   SERIAL,
                                                 "price" VARCHAR(255), 
                                                 "size" INTEGER, 
                                                 "side" BOOLEAN, 
                                                 "client" VARCHAR(255), 
                                                 "security" INTEGER, 
                                                 PRIMARY KEY ("id"))`
    async function createTradeTable() {
    return await this.query(sqlReq);
}

module.exports = createTradeTable;