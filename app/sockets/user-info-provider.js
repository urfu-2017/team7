import cookieSession from 'cookie-session';
import { OutgoingMessage } from 'http';
import config from '../config';


const session = cookieSession({
    secure: config.COOKIE_HTTPS,
    httpOnly: true,
    secret: config.EXPRESS_SESSION_SECRET
});

// eslint-disable-next-line import/prefer-default-export
export async function getUserId(req) {
    const res = new OutgoingMessage();
    return new Promise(((resolve, reject) => {
        session(req, res, () => {
            const { passport } = req.session;
            if (!passport || !passport.user || !passport.user.userId) {
                reject(new Error("Can't get user id from request.")); // SSR or unauthorised bot
            } else {
                resolve(passport.user.userId);
            }
        });
    }));
}
