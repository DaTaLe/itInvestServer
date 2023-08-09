const dbCtr = require('../db/index');
const {checkPagination, getOffset} = require('./utils');

/**
 * Express controller. Get some Security from db using pagination limit&offset || page&limit
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
async function getSecurity(req, res) {
    let page = req.query.page;
    let limit = req.query.limit || 20;
    let offset = req.query.offset;

    checkPagination(req, res, page, limit, offset);

    if (!(Number.isInteger(Number(limit)) && (limit > 1 && limit <= 20))) {
        res.error(400, 'Bad request', `limit must be an integer 1<limit<=20`).json();
    }

    offset = getOffset(page, limit, offset);

    const dbResp = await dbCtr.getSecurity(limit, offset);

    let count = await dbCtr.getSecurityCount();
    let totalPages = Math.ceil(count / limit) || 0;

    res.status(200)
        .pagination(page, limit, totalPages)
        .send(dbResp);
}

module.exports = getSecurity
