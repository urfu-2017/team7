import express from 'express';
import cookieParser from 'cookie-parser';
import apicache from 'apicache';

import cookieSession from './utils/cookie-session';
import config from './config';
import loginController from './controllers/login';
import AvatarController from './controllers/avatar';
import AvatarGenerator from './utils/avatar-generator';
import { installPassport } from './middlewares/auth';
import getLogger from './utils/logger';

const logger = getLogger('express');

function installAllMiddlewares(app) {
    app.use(cookieParser());
    app.use(cookieSession());
    installPassport(app);
    app.use((req, res, next) => {
        logger.trace({ request: req, res });
        next();
    });
    app.set('trust proxy', config.IS_PRODUCTION);
}

export default (nextHandler) => {
    const app = express();
    const avatarController = new AvatarController(new AvatarGenerator());
    installAllMiddlewares(app);
    app.use('/', loginController);
    app.use('/avatar/:userId', apicache.middleware('5 minutes'), (req, res) => avatarController.getAvatar(req, res));
    app.get('*', (req, res) => nextHandler(req, res));
    app.use((err, req, res, next) => {
        logger.error({ err, request: req });
        next();
    });

    return app;
};
