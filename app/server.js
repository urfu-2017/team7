import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import loginController from './controllers/loginController';
import { getGithubPassport, installPassport } from './middlewares/auth';
import installSocketServer from './sockets/server';

const installAllMiddlewares = (app, config, passport) => {
    app.use(cookieParser());
    app.use(expressSession({
        secret: config.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
        // Указываем хранилище (по умолчанию, в памяти)
        // store: new require('connect-mongo')(expressSession)(options)
    }));
    installPassport(app, passport);
};

function installExpressApp(server, config) {
    const app = express();
    const passport = getGithubPassport({
        callbackUrl: config.PASSPORT_CALLBACK_URL,
        clientId: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET
    });
    installAllMiddlewares(app, config, passport);

    const handle = server.getRequestHandler();
    app.use('/', loginController(passport));
    app.get('*', (req, res) => handle(req, res));
    return app;
}


export default async (config) => {
    const server = next({ dev: config.IS_PRODUCTION });
    await server.prepare();
    installSocketServer(server);

    return installExpressApp(server, config);
};

