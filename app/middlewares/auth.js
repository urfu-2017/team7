import { Passport } from 'passport';
import { Strategy } from 'passport-github';
import config from '../config';
import { upsertUser } from '../db/users-repository';
import { User } from '../db/datatypes';

const getGithubStrategy = ({ callbackUrl, clientId, clientSecret }) =>
    new Strategy({
        clientID: clientId,
        clientSecret,
        callbackURL: callbackUrl
    }, (accessToken, refreshToken, profile, done) => {
        const { username, id } = profile;
        upsertUser(new User(id, username, null, []))
            .then(() => done(null, { userId: id }))
            .catch(err => done(err));
    });

export const passport = new Passport();

passport.use(getGithubStrategy({
    callbackUrl: config.PASSPORT_CALLBACK_URL,
    clientId: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET
}));

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

