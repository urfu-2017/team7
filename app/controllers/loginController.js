import { Router } from 'express';
import connectEnsureLogin from 'connect-ensure-login';


export default passport => Router()
    .get('/login', passport.authenticate('github'))
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
    .get(
        '/login/return',
        passport.authenticate('github', { failureRedirect: '/' }),
        (req, res) => res.redirect('/profile')
    )
    .get(
        '/profile',
        connectEnsureLogin.ensureLoggedIn('/'),
        (req, res) => res.json({ user: req.user })
    );
