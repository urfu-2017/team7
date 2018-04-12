import { Passport } from 'passport';
import { Strategy } from 'passport-github';
import config from '../config';
import loginUser from '../db/login-manager';

export const CALLBACK_PATH = '/login/return';

const strategyOptions = {
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: config.SITE_URL + CALLBACK_PATH
};
const githubStrategy = new Strategy(strategyOptions, (accessToken, refreshToken, profile, done) => {
    const { username, id } = profile;
    loginUser(id, username)
        .then(() => done(null, { userId: id }))
        .catch(err => done(err));
});

export const passport = new Passport();

passport.use(githubStrategy);

// Определяем функцию для сохранения данных пользователя в сессию
passport.serializeUser((user, done) => {
    done(null, user);
});

// Определяем функцию для получения данных пользователя из сессии
passport.deserializeUser((user, done) => {
    done(null, user);
});

export const installPassport = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());
};

