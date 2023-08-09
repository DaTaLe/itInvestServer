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

/**
 * Main db manipulation class
 * @extends Pool
 */
class DbController extends Pool {
    /**
     * Constructor
     * @param {object} pgConf - db connection options see https://node-postgres.com/apis/pool
     * @param args - parent constructor args
     */
    constructor(pgConf, ...args) {
        super(pgConf, ...args);
        this.notifyListener = undefined;
        this.truncateJob = undefined;
    }

    /**
     * Run a single query on the database on the first available idle client with logging
     * @param text
     * @param params
     * @returns {Promise<*>}
     */
    async query(text, params) {
        const start = Date.now();
        const res = await super.query(text, params);
        const duration = Date.now() - start;
        console.log('executed query', {text, duration, rows: res?.rowCount});
        return res;
    }

    /**
     * Inits db set up all tables, and other staff
     * @returns {Promise<void>}
     */
    async init() {
        await this.createItInvestDb();
        await this.createSecurityTable();
        await this.createTradeTable();
        await this.createFuncNotifyNewTrade();
        await this.createTriggerNotifyNewTrade();

        this.notifyListener = await this.connect();

        //channels listeners
        this.notifyListener.query('LISTEN new_trade');
    }

    /**
     * Set callback function to handle db event stream
     * @param {function} callback
     * returns void
     */
    setEmitter(callback) {
        this.notifyListener.on('notification', callback);
    }

    /**
     * Set scheduled job for db clear
     * @param cronStr - Cron time string format
     */
    setTruncate(cronStr) {
        this.truncateJob = schedule.scheduleJob(cronStr, async () => {
            await this.truncateAllTables();
        });
    }

    /**
     * Get idle pg client from pool on process.nextTick
     * @param args
     * @returns {Promise<pg.Client>}
     */
    async connect(...args) {
        return await super.connect(...args);
    }

    //Request methods
    /**
     * Creates itInvest db. Waits until db fully set up for 6 seconds, 3 retry
     * @returns {Promise<void>}
     */
    async createItInvestDb(...args) {
        return await createItInvestDb.apply(this, args);
    }

    /**
     * @returns {Promise<pg.Result>}
     */
    async createSecurityTable(...args) {
        return await createSecurityTable.apply(this, args);
    }

    /**
     * @returns {Promise<pg.Result>}
     */
    async createTradeTable(...args) {
        return await createTradeTable.apply(this, args);
    }

    /**
     * Creates plpgsql function
     * for new trade notification
     * @returns {Promise<pg.Result>}
     */
    async createFuncNotifyNewTrade(...args) {
        return await createFuncNotifyNewTrade.apply(this, args);
    }

    /**
     * Creates postgres trigger
     * for new trade notification,
     * call after some data modify
     * @returns {Promise<pg.Result>}
     */
    async createTriggerNotifyNewTrade(...args) {
        return await createTriggerNotifyNewTrade.apply(this, args);
    }

    /**
     * Clear all data from db
     * @returns {Promise<pg.Result>}
     */
    async truncateAllTables(...args) {
        return await truncateAllTables.apply(this, args);
    }

    /**
     * Creates new post row in db
     * @param {string} seccode
     * @param {number} price
     * @param {string} isin
     * @param {number} lotsize
     * @returns {Promise<object>}
     */
    async postSecurity(...args) {
        return await postSecurity.apply(this, args);
    }

    /**
     * Creates new trade row in db
     * @param {string} price
     * @param {number} size
     * @param {number} side
     * @param {string} client
     * @param {number} security
     * @returns {Promise<object>}
     */
    async postTrade(...args) {
        return await postTrade.apply(this, args);
    }

    /**
     * Get row from Security table with id
     * @param {number} id
     * @returns {Promise<object>}
     */
    async getSecurityById(...args) {
        return await getSecurityById.apply(this, args);
    }

    /**
     * Get limit count of rows from Security table with offset
     * @param {number} limit
     * @param {number} offset
     * @returns {Promise<array>}
     */
    async getSecurity(...args) {
        return await getSecurity.apply(this, args);
    }

    /**
     * Get exact count of rows in Security table
     * @returns {Promise<number>}
     */
    async getSecurityCount(...args) {
        return await getSecurityCount.apply(this, args);
    }

}

module.exports = new DbController(pgConf);