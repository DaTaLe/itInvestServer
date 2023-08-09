require('dotenv').config();
const express = require('express');
require('express-async-errors');
const lpGetter = require("express-longpoll");
let dbCtr = require('./db/index');


async function app() {

    // Db init
    await dbCtr.init();
    dbCtr.setTruncate(process.env.DB_CLEAR_STR);

    // Controllers
    const getSecurity = require('./controllers/getSecurity');
    const getSecurityById = require('./controllers/getSecurityById');
    const postSecurity = require('./controllers/postSecurity');
    const postTrade = require('./controllers/postTrade');

    // Middlewares
    const jsonApi = require('./middlewares/jsonApi');

    const app = express();

    // app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({
        extended: true
    }));

    app.use(jsonApi.middleware);

    // Routers
    const rootRouter = express.Router();

    // Requests
    rootRouter.get('/security', getSecurity);
    rootRouter.get('/security/:id', getSecurityById);
    rootRouter.post('/security', postSecurity);
    rootRouter.post('/trade', postTrade);

    // Routes
    app.use("", rootRouter);
    app.use(jsonApi.routes.notFound);

    // Errors
    app.use(jsonApi.errors.internal);

    let longPoll = lpGetter(rootRouter, {DEBUG: false});

    //Long poll requests
    longPoll.create("/trades");

    /**
     * postgres message handler callback
     * @param msg
     */
    function ntfCallback(msg) {
        switch (msg.channel) {
            case 'new_trade':
                let payload = JSON.parse(msg.payload);
                longPoll.publish("/trades", payload);
                break;
            default:
                console.log(`Message from unexpected channel: ${msg.channel}`)
        }
    }

    dbCtr.setEmitter(ntfCallback);

    app.listen(process.env.PORT, () => {
        console.log(`Started on PORT: ${process.env.PORT}`);
    });

    /**
     * Close clients and exit the process
     * @param {NodeJS.SignalsListener} signal
     */
    async function signalHandler(signal) {
        console.log('Exiting...');
        await dbCtr.notifyListener.release();
        await dbCtr.end();
        process.exit()
    }

    process.on('SIGINT', signalHandler)
    process.on('SIGTERM', signalHandler)
    process.on('SIGQUIT', signalHandler)
}

if (require.main === module) {
    app();
}

