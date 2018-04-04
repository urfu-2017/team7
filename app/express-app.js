import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

import config from './config';
import loginController from './controllers/loginController';
import { installPassport } from './middlewares/auth';

function installAllMiddlewares(app) {
    app.use(cookieParser());
    app.use(cookieSession({
        secure: config.COOKIE_HTTPS,
        httpOnly: true,
        keys: [config.EXPRESS_SESSION_SECRET]
    }));
    installPassport(app);
}

export function getExpressApp() {
    const app = express();
    installAllMiddlewares(app);
    app.use('/', loginController);
    return app;
}

export const installExpressServer = async (server) => {
    const handle = server.getRequestHandler();
    const app = getExpressApp();
    app.get('*', (req, res) => handle(req, res));
    return new Promise((resolve, reject) => {
        app.listen(config.PORT, config.HOST, (err) => {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });
};
