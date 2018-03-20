require('dotenv').config();

const cookieParser = require('cookie-parser');
const connectEnsureLogin = require('connect-ensure-login');
const expressSession = require('express-session');
const passport = require('passport');
const passportGithub = require('passport-github');

const { HOST } = require('../constants'); 

const strategy = new passportGithub.Strategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `http://${HOST}/login/return`
    },
    (accessToken, refreshToken, profile, done) => {
        done(null, profile);
    }
);

passport.use(strategy);

module.exports = (app) => {
    app.use(cookieParser());

    app.use(expressSession({
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        // Указываем хранилище (по умолчанию, в памяти)
        // store: new require('connect-mongo')(expressSession)(options)
    }));

    // Определяем функцию для сохранения данных пользователя в сессию
    passport.serializeUser((user, done) => {
        done(null, user);
    });

    // Определяем функцию для получения данных пользователя из сессии
    passport.deserializeUser((user, done) => {
        done(null, user);
    });

    app.use(passport.initialize());

    app.use(passport.session());

    app.get(
        '/login',
        passport.authenticate('github')
    );

    app.get(
        '/login/return',
        passport.authenticate('github', { failureRedirect: '/' }),
        (req, res) => res.redirect('/profile')
    );

    app.get(
        '/profile',
        connectEnsureLogin.ensureLoggedIn('/'),
        (req, res) => res.json({ user: req.user })
    );

    app.get(
        '/logout',
        (req, res) => {
            req.logout();
            res.redirect('/');
        }
    );
};
