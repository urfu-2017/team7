import express from 'express';
import cookieParser from 'cookie-parser';
import apicache from 'apicache';
import cookieSession from './utils/cookie-session';
import config from './config';
import loginController from './controllers/login';
import avatarController from './controllers/avatar';
import { installPassport } from './middlewares/auth';
import getLogger from './utils/logger';
import { STATIC_MAX_AGE_SECONDS } from './utils/constants';
import s3router from './s3/router';

const logger = getLogger('express');

function installAllMiddlewares(app) {
    app.use(cookieParser());
    app.use(cookieSession());
    installPassport(app);
    app.set('trust proxy', config.IS_PRODUCTION);
}

export default (nextHandler) => {
    const app = express();
    const cache = apicache.options({
        headers: {
            'Cache-Control': `public, max-age=${STATIC_MAX_AGE_SECONDS}`
        }
    }).middleware;
    installAllMiddlewares(app);
    app.use('/', loginController);
    app.use('/avatar', cache('5 minutes'), avatarController);
    app.use('/static', express.static('static', { maxAge: STATIC_MAX_AGE_SECONDS * 1000 }));
    app.use('/s3', s3router);
    app.get('*', (req, res) => nextHandler(req, res));
    app.use((err, req, res, next) => {
        logger.error({ err, request: req });
        next();
    });

    return app;
};
