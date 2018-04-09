import { OutgoingMessage } from 'http';
import cookieSession from '../utils/cookie-session';

const session = cookieSession();

// eslint-disable-next-line import/prefer-default-export
export async function getUserId(req) {
    const res = new OutgoingMessage();
    return new Promise(((resolve, reject) => {
        session(req, res, () => {
            const { passport } = req.session;
            if (!passport || !passport.user || !passport.user.userId) {
                reject(new Error("Can't get user id from request. Please login.")); // SSR, bot or unauthorized user.
            } else {
                resolve(passport.user.userId);
            }
        });
    }));
}
