const {Pool} = require('pg');
const schedule = require('node-schedule');
const pgConf = require('./pgConfig');

//Requests imports
const createItInvestDb = require('./requests/createItInvestDb');
const createSecurityTable = require('./requests/createSecurityTable');
const createTradeTable = require('./requests/createTradeTable');
const createFuncNotifyNewTrade = require('./requests/createFuncNotifyNewTrade');
const createTriggerNotifyNewTrade = require('./requests/createTriggerNotifyTrade');
const postSecurity = require('./requests/postSecurity');
const postTrade = require('./requests/postTrade');
const getSecurityById = require('./requests/getSecurityById');
const getSecurity = require('./requests/getSecurity');
const getSecurityCount = require('./requests/getSecurityCount');
const truncateAllTables = require('./requests/truncateAllTables')

class DbController extends Pool {
    constructor(pgConf, ...args) {
        super(pgConf,...args);
        this.notifyListener = undefined;
        this.truncateJob = undefined;
    }
    async query(text, params) {
        const start = Date.now();
        const res = await super.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', { text, duration, rows: res?.rowCount });
        return res;
    }

    async init(){
        await this.createItInvestDb();
        await this.createSecurityTable();
        await this.createTradeTable();
        await this.createFuncNotifyNewTrade();
        await this.createTriggerNotifyNewTrade();

        this.notifyListener = await this.connect();

        //channels listeners
        this.notifyListener.query('LISTEN new_trade');
    }

    setEmitter(callback){
        this.notifyListener.on('notification', callback);
    }

    setTruncate(chronStr){
        this.truncateJob = schedule.scheduleJob(chronStr, async () =>{
            await this.truncateAllTables();
        });
    }
    async connect(...args) {
        return await super.connect(...args);
    }

    //Request methods
    async createItInvestDb(...args){
        return await createItInvestDb.apply(this, args);
    }
    async createSecurityTable(...args){
        return await createSecurityTable.apply(this, args);
    }
    async createTradeTable(...args){
        return await createTradeTable.apply(this, args);
    }
    async createFuncNotifyNewTrade(...args){
        return await createFuncNotifyNewTrade.apply(this, args);
    }
    async createTriggerNotifyNewTrade(...args){
        return await createTriggerNotifyNewTrade.apply(this, args);
    }
    async truncateAllTables(...args){
        return await truncateAllTables.apply(this, args);
    }
    async postSecurity(...args){
        return await postSecurity.apply(this, args);
    }
    async postTrade(...args){
        return await postTrade.apply(this, args);
    }
    async getSecurityById(...args){
        return await getSecurityById.apply(this, args);
    }
    async getSecurity(...args){
        return await getSecurity.apply(this, args);
    }
    async getSecurityCount(...args){
        return await getSecurityCount.apply(this, args);
    }

}

module.exports = new DbController(pgConf);
