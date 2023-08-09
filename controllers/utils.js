/**
 * Checks value param is string
 * @param {*} value
 * @returns {boolean}
 */
function isStr(value) {
    let chVal = String(value);
    return (typeof chVal === 'string' || chVal instanceof String);
}

/**
 * Checks value param is integer
 * @param {*} value
 * @returns {boolean}
 */
function isInt(value) {
    let chVal = Number(value);
    return (Number.isInteger(chVal) && (typeof chVal === "number"));
}

/**
 * Checks value param is integer and >= graterOrEqual
 * @param {*} value
 * @param {number} graterOrEqual
 * @returns {boolean}
 */
function isGtEInt(value, graterOrEqual) {
    let chVal = Number(value);
    return (Number.isInteger(chVal) && (typeof chVal === "number") && chVal >= graterOrEqual);
}

/**
 * Checks value param is unsigned integer
 * @param {*} value
 * @returns {boolean}
 */
function isPosInt(value) {
    return isGtEInt(value, 0)
}

/**
 *  Validates request with pagination
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {number} page - offset/limit representation
 * @param {number} limit - limit rows for one query
 * @param {number} offset - skip offset count of rows
 */
function checkPagination(req, res, page, limit, offset) {

    if (page === undefined && offset === undefined) {
        res.error(400, 'Bad request', `both page and offset parameter is missing must be one of them`).json();
    }

    if (page !== undefined && offset !== undefined) {
        res.error(400, 'Bad request', `both page and offset parameter set must be only one of them`).json();
    }

    if (!(isGtEInt(page, 1) && isGtEInt(limit, 1))
        && !(isPosInt(offset) && isGtEInt(limit, 1))) {
        res.error(400, 'Bad request', `parameters page >= 1, limit >= 1, offset >= 0 must be unsigned integers`).json();
    }
}

/**
 * get correct offset for pagination
 * @param {number} page - offset/limit representation
 * @param {number} limit - limit rows for one query
 * @param {number} offset - skip offset count of rows
 * @returns {number|offset}
 */
function getOffset(page, limit, offset) {
    offset = offset === undefined ? (page - 1) * limit : offset;
    return offset;
}

module.exports = {isStr, isInt, isPosInt, isGtEInt, checkPagination, getOffset}
