import next from 'next';
import { Server } from 'http';
import installSocketServer from './sockets/server';
import buildExpressApp from './express-app';
import config from './config';


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
    const nextApp = next({ dev: !config.IS_PRODUCTION });
    await nextApp.prepare();
    const expressApp = buildExpressApp(nextApp.getRequestHandler());
    const server = Server(expressApp);
    await installSocketServer(server);
    await listen(server);
    // eslint-disable-next-line no-console
    console.info(`> Running on http://${config.HOST}:${config.PORT}`);
};

