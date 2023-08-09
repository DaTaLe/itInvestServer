const dbCtr = require('../db/index');
const {isInt, isStr} = require('./utils');

/**
 * Add new Trade to db
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
async function postTrade(req, res) {
    let price = req.body.price;
    let size = Number(req.body.size);
    let side = Boolean(req.body.side);
    let client = req.body.client;
    let security = Number(req.body.security);

    if (!isStr(price)) {
        res.error(400, 'Bad request', `price required and must be an string`).json();
    }
    if (!isStr(client)) {
        res.error(400, 'Bad request', `client required and must be an string`).json();
    }
    if (!isInt(size)) {
        res.error(400, 'Bad request', `size required and must be an integer`).json();
    }
    if (!isInt(security)) {
        res.error(400, 'Bad request', `security required and must be an integer`).json();
    }
    if (!(typeof side === "boolean")) {
        res.error(400, 'Bad request', `side required and must be an boolean`).json();
    }

    const dbResp = await dbCtr.postTrade(price, size, side, client, security);

    res.status(200)
        .json(dbResp);
}

module.exports = postTrade