const safeInitApi = require('./_initApi');


function notFoundMiddleware(req, res, next) {
    safeInitApi(res);
    return res.error(404, 'Not found').json();
}

function internalErrorsMiddleware(error, req, res, next) {
    safeInitApi(res);
    return res.error(500, 'Internal server error', undefined, error.stack || undefined).json();
    // return res.error(500, 'Internal server error', undefined).json();

}


module.exports = {
    notFoundMiddleware: notFoundMiddleware,
    internalErrorMiddleware: internalErrorsMiddleware
}