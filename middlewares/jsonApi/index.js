const jsonApi = require('./middleware');
const errors = require('./erorrs');


module.exports = {
    middleware: jsonApi,
    routes: {
        notFound: errors.notFoundMiddleware,
    },
    errors: {
        internal: errors.internalErrorMiddleware
    }
}