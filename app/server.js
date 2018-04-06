import next from 'next';
import installSocketServer from './sockets/server';
import { installExpressServer } from './express-app';
import config from './config';


export default async () => {
    const server = next({ dev: config.IS_PRODUCTION });
    await server.prepare();
    await installSocketServer(server);
    await installExpressServer(server);
    // eslint-disable-next-line no-console
    console.info(`> Running on http://${config.HOST}:${config.PORT}`);
};

