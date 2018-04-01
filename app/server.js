import express from 'express';
import next from 'next';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';

import loginController from './controllers/loginController';
import getGithubPassport from './middleware/auth';

const installMiddleware = (app, config, passport) => {
    app.use(cookieParser());
    app.use(expressSession({
        secret: config.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false
        // Указываем хранилище (по умолчанию, в памяти)
        // store: new require('connect-mongo')(expressSession)(options)
    }));
    app.use(passport.initialize());
    app.use(passport.session());
};

export default async (config) => {
    const app = next({ dev: config.IS_PRODUCTION });
    const handle = app.getRequestHandler();
    await app.prepare();
    const server = express();
    const passport = getGithubPassport({
        callbackUrl: config.PASSPORT_CALLBACK_URL,
        clientId: config.GITHUB_CLIENT_ID,
        clientSecret: config.GITHUB_CLIENT_SECRET
    });
    installMiddleware(server, config, passport);
    server.use('/', loginController(passport));
    server.get('/b', (req, res) => app.render(req, res, '/a', req.query));
    server.get('/posts/:id', (req, res) => app.render(req, res, '/posts', { id: req.params.id }));
    server.get('*', (req, res) => handle(req, res));

    return server;
};
