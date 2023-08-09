const {Client} = require('pg');
let pgConf = {...require('../pgConfig')};
pgConf.database = process.env.DB_NAME_INIT;

const {sleepBreath} = require('../../utils')

async function createItInvestDb() {
    let client = new Client(pgConf);
    await client.connect();
    //TODO use pg-format for handling escaping env vars
    try {
        await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
    } catch (err) {
        client.end();
        console.log(err.message);
        return;
    }

    //TODO move constants to env
    let isDbExist = false
    for (let retCounter = 0; retCounter <= 3; retCounter++) {
        const res = await client.query(`SELECT EXISTS(SELECT datname FROM pg_database WHERE datname = '${process.env.DB_NAME}')`);
        isDbExist = res.rows[0].exists;
        if (isDbExist) {
            await client.end();
            return;
        }
        await sleepBreath(2000);
    }
    await client.end();
    throw new Error(`Can\`t create db: ${process.env.DB_NAME}`)
}

module.exports = createItInvestDb;

