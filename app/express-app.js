import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

import config from './config';
import loginController from './controllers/login-controller';
import { installPassport } from './middlewares/auth';

function installAllMiddlewares(app) {
    app.use(cookieParser());
    app.use(cookieSession({
        secure: config.COOKIE_HTTPS,
        httpOnly: true,
        secret: config.EXPRESS_SESSION_SECRET
    }));
    installPassport(app);
}

export default (nextHandler) => {
    const app = express();
    installAllMiddlewares(app);
    app.use('/', loginController);
    app.get('*', (req, res) => nextHandler(req, res));

    return app;
};
