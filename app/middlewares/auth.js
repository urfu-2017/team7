import { Passport } from 'passport';
import { Strategy } from 'passport-github';


export const getGithubStrategy = ({ callbackUrl, clientId, clientSecret }) =>
    new Strategy({
        clientID: clientId,
        clientSecret,
        callbackURL: callbackUrl
    }, (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    });

export const getPassport = (strategies) => {
    const passport = new Passport();
    strategies.forEach(x => passport.use(x));

    // Определяем функцию для сохранения данных пользователя в сессию
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Определяем функцию для получения данных пользователя из сессии
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    return passport;
};

export const installPassport = (app, passport) => {
    app.use(passport.initialize());
    app.use(passport.session());
};

export const getGithubPassport = ({ callbackUrl, clientId, clientSecret }) => {
    const strategy = getGithubStrategy({ callbackUrl, clientId, clientSecret });

    return getPassport([strategy]);
};
