function isStr(value){
    let chVal = String(value);
    return (typeof chVal === 'string' || chVal instanceof String);
}
function isInt(value){
    let chVal = Number(value);
    return (Number.isInteger(chVal) && (typeof chVal === "number"));
}
function isGtEInt(value, graterOrEqual){
    let chVal = Number(value);
    return (Number.isInteger(chVal) && (typeof chVal === "number") && chVal >= graterOrEqual);
}
function isPosInt(value){
    return isGtEInt(value, 0)
}
function checkPagination(req, res, page, limit, offset){
    if (page === undefined && offset === undefined) {
        res.error(400,'Bad request',`both page and offset parameter is missing must be one of them`).json();
    }

    if (page !== undefined && offset !== undefined) {
        res.error(400,'Bad request',`both page and offset parameter set must be only one of them`).json();
    }

    if ( !( isPosInt(page) || isPosInt(offset) ) || !isPosInt(limit) ) {
        res.error(400,'Bad request',`parameters page, limit, offset must be unsigned integers`).json();
    }
}
function getOffset(page, limit, offset){
    offset = offset === undefined ? (page - 1) * limit: offset;
    return offset;
}

module.exports = {isStr, isInt, isPosInt, isGtEInt, checkPagination, getOffset}
