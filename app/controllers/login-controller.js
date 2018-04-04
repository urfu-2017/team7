import Router from 'express-promise-router';
import connectEnsureLogin from 'connect-ensure-login';
import { passport } from '../middlewares/auth';


export default Router()
    .get('/login', passport.authenticate('github'))
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
    .get(
        '/login/return',
        passport.authenticate('github', { failureRedirect: '/' }),
        async (req, res) => {
            res.json({ userId: req.user, cookies: req.cookies });
        }
    )
    .get(
        '/profile',
        connectEnsureLogin.ensureLoggedIn('/'),
        (req, res) => res.json({ user: req.user })
    );
