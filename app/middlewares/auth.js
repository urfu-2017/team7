import { Passport } from 'passport';
import { Strategy } from 'passport-github';


export default ({ callbackUrl, clientId, clientSecret }) => {
    const githubStrategy = new Strategy(
        {
            clientID: clientId,
            clientSecret,
            callbackURL: callbackUrl
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    );

    const passport = new Passport();
    passport.use(githubStrategy);

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
