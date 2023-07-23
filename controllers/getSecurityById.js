const dbCtr = require('../db/index');
const {isGtEInt} = require('./utils');

async function getSecurityById(req,res) {
    let id = req.params.id;

    if (!isGtEInt(id,1)) {
        res.error(400,'Bad request',`id required and must be an integer id>1`).json();
    }

    const dbResp = await dbCtr.getSecurityById(id);

    res.status(200)
        .send(dbResp);
}

module.exports = getSecurityById
