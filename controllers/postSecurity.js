const dbCtr = require('../db/index');
const {isInt, isStr} = require('./utils');

async function postSecurity(req,res) {
    let seccode = req.body.seccode;
    let price = Number(req.body.price);
    let isin = req.body.isin;
    let lotsize = Number(req.body.lotsize);

    if (!isInt(price)) {
        res.error(400,'Bad request',`price required and must be an integer`).json();
    }
    if (!isInt(lotsize)) {
        res.error(400,'Bad request',`lotsize required and must be an integer`).json();
    }
    if (!isStr(seccode)) {
        res.error(400,'Bad request',`seccode required and must be an string`).json();
    }
    if (!isStr(isin)) {
        res.error(400,'Bad request',`isin required and must be an string`).json();
    }

    const dbResp = await dbCtr.postSecurity(seccode, price, isin, lotsize);

    res.status(200)
        .json(dbResp);
}

module.exports = postSecurity