import Router from 'express-promise-router';
import connectEnsureLogin from 'connect-ensure-login';
import { saveUser, getUser } from '../db/users-repository';
import { User } from '../db/datatypes';


export default passport => Router()
    .get('/login', passport.authenticate('github'))
    .get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
    .get(
        '/login/return',
        passport.authenticate('github', { failureRedirect: '/' }),
        async (req, res) => {
            const { username, _json: { id } } = req.user;
            let user = await getUser(id);
            if (!user) {
                user = new User(id, username, null, []);
                await saveUser(user);
            }

            res.json(user);
        }
    )
    .get(
        '/profile',
        connectEnsureLogin.ensureLoggedIn('/'),
        (req, res) => res.json({ user: req.user })
    );
