import express from 'express';
import cookieParser from 'cookie-parser';
import cookieSession from './utils/cookie-session';
import config from './config';
import loginController from './controllers/login';
import { installPassport } from './middlewares/auth';

function installAllMiddlewares(app) {
    app.use(cookieParser());
    app.use(cookieSession());
    installPassport(app);
    app.set('trust proxy', config.IS_PRODUCTION);
}

export default (nextHandler) => {
    const app = express();
    installAllMiddlewares(app);
    app.use('/', loginController);
    app.get('*', (req, res) => nextHandler(req, res));

    return app;
};
