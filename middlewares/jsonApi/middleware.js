const safeInitApi = require('./_initApi');

async function jsonApiMiddleware(req, res, next) {
    safeInitApi(res);
    next();
}



module.exports = jsonApiMiddleware;