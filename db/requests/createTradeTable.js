// TODO \n the query
async function createTradeTable(){
    return await this.query('CREATE TABLE IF NOT EXISTS "trade" ("id"   SERIAL , "price" VARCHAR(255), "size" INTEGER, "side" BOOLEAN, "client" VARCHAR(255), "security" INTEGER, PRIMARY KEY ("id"))');
}

module.exports = createTradeTable;