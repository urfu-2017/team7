import next from 'next';
import { Server } from 'http';
import installSocketServer from './sockets/server';
import buildExpressApp from './express-app';
import config from './config';
import getLogger from './utils/logger';
import { connect } from './db';

const logger = getLogger('entry-point');


function listen(server) {
    return new Promise((resolve, reject) => {
        server.listen(config.PORT, config.HOST, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
}

export default async () => {
    try {
        await connect();
        const nextApp = next({ dev: !config.IS_PRODUCTION });
        await nextApp.prepare();
        const expressApp = buildExpressApp(nextApp.getRequestHandler());
        const server = Server(expressApp);
        await installSocketServer(server);
        await listen(server);
        logger.info(`Running on http://${config.HOST}:${config.PORT}`);
    } catch (e) {
        logger.fatal(e, 'Failed to run server');
        setTimeout(() => process.exit(1), 10000);
    }
};

