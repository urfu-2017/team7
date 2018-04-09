import Router from 'express-promise-router';
import connectEnsureLogin from 'connect-ensure-login';
import { passport, CALLBACK_PATH } from '../middlewares/auth';

export default Router()
    .get('/login', passport.authenticate('github'))
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
    .get(
        CALLBACK_PATH,
        passport.authenticate('github', { failureRedirect: '/login', successRedirect: '/' })
    )
    .get(
        '/profile',
        connectEnsureLogin.ensureLoggedIn('/login'),
        (req, res) => res.json({ user: req.user })
    );
