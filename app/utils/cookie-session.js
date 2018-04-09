import cookieSession from 'cookie-session';
import config from '../config';


export default () => cookieSession({
    secure: config.IS_PRODUCTION,
    httpOnly: true,
    secret: config.EXPRESS_SESSION_SECRET
});
