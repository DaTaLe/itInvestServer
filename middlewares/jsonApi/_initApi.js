const KEY = '_JSON_API_';


function _setMeta(res) {
    function func(obj) {
        if (obj && typeof obj === 'object') {
            res[KEY].meta || (res[KEY].meta = {});
            res[KEY].meta = Object.assign(res[KEY].meta, obj);
        }
        return res;
    }

    return func;
}


function _setPagination(res) {
    function func(currentPage, limit, totalCount) {
        let pagination = {};

        if (currentPage != null)
            pagination.page = currentPage;

        if (limit)
            pagination.limit = limit;

        if (totalCount != null)
            pagination.total = totalCount;

        if (currentPage != null && limit != null && totalCount != null) {

            let host = res.req.headers.host;
            let requestQuery = res.req._parsedUrl.query;
            let baseUrl = res.req.baseUrl;
            let pathname = res.req._parsedUrl.pathname;

            const pageLimitRegex = /(page=\d*&)|(page=\d+)|(limit=\d*&)|(limit=\d+)/gm

            let clearRequestQuery = requestQuery.replace(pageLimitRegex, '');

            let numCurrentPage = Number(currentPage);
            let numLimit = Number(limit);
            let numTotalCount = Number(totalCount);

            let nextPage = numCurrentPage + 1 > numTotalCount ? numCurrentPage : numCurrentPage + 1;

            let nextPageUrl = `http://${host}${baseUrl}${pathname}?page=${nextPage}&limit=${numLimit}&${clearRequestQuery}`;

            pagination.nextPage = nextPageUrl;
        }

        if (Object.keys(pagination).length > 0)
            res.meta({pagination});

        return res;
    }

    return func;
}


function _setError(res) {
    function func(statusCode, title, details, stackTrace) {
        if (!statusCode)
            return res;

        res[KEY].errors || (res[KEY].errors = []);
        res.status(statusCode);

        const errObj = {
            status: statusCode,
            title: title || res.statusMessage, // TODO res.statusMessage всегда undefined
            details: details,
            stackTrace: stackTrace
        }
        res[KEY].errors.push(errObj);

        return res;
    }

    return func;
}


function _setJson(res) {
    let oldJson = res.json;

    function func(data) {
        data !== undefined && (res[KEY].data = data);
        res[KEY].isSuccess = res.statusCode < 400;

            // data !== undefined && (res[KEY] = data);

            res.json = oldJson;           // set function back to avoid the 'double-send'
        return res.json(res[KEY]);     // just call as normal with data
    }

    return func;
}


function initApi(res) {
    if (res[KEY]) {
        return;
    }

    res[KEY] = {};

    res.meta = _setMeta(res);
    res.pagination = _setPagination(res);
    res.error = _setError(res);
    res._json = res.json;
    res.json = _setJson(res);
}


module.exports = initApi;




