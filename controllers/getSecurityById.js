const dbCtr = require('../db/index');
const {isGtEInt} = require('./utils');

/**
 * Express controller. Get some Security from db by id
 * @param {express.Request} req
 * @param {express.Response} res
 * @returns {Promise<void>}
 */
async function getSecurityById(req, res) {
    let id = req.params.id;

    if (!isGtEInt(id, 1)) {
        res.error(400, 'Bad request', `id required and must be an integer id>1`).json();
    }

    const dbResp = await dbCtr.getSecurityById(id);

    res.status(200)
        .send(dbResp);
}

module.exports = getSecurityById
