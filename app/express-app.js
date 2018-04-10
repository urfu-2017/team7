import express from 'express';
import cookieParser from 'cookie-parser';
import apicache from 'apicache';

import cookieSession from './utils/cookie-session';
import config from './config';
import loginController from './controllers/login';
import AvatarController from './controllers/avatar';
import AvatarGenerator from './utils/avatarGenerator';
import { installPassport } from './middlewares/auth';

function installAllMiddlewares(app) {
    app.use(cookieParser());
    app.use(cookieSession());
    installPassport(app);
    app.set('trust proxy', config.IS_PRODUCTION);
}

export default (nextHandler) => {
    const app = express();
    const avatarController = new AvatarController(new AvatarGenerator());
    installAllMiddlewares(app);
    app.use('/', loginController);
    app.use('/avatar/:userId', apicache.middleware('5 minutes'), (req, res) => avatarController.getAvatar(req, res));
    app.get('*', (req, res) => nextHandler(req, res));

    return app;
};
