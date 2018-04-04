import express from 'express';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import config from './config';
import loginController from './controllers/loginController';
import { getGithubPassport, installPassport } from './middlewares/auth';

function installAllMiddlewares(app, passport) {
    app.use(cookieParser());
    app.use(expressSession({
        secret: config.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
        // Указываем хранилище (по умолчанию, в памяти)
        // store: new require('connect-mongo')(expressSession)(options)
    }));
    installPassport(app, passport);
}


export function getExpressApp() {
    const app = express();
    const passport = getGithubPassport({
        callbackUrl: config.PASSPORT_CALLBACK_URL,
        clientId: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET
    });
    installAllMiddlewares(app, passport);
    app.use('/', loginController(passport));
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
