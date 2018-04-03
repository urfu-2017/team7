import { config } from 'dotenv';

export default () => {
    config();

    const {
        PORT,
        HOST,
        GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET,
        PASSPORT_CALLBACK_URL,
        EXPRESS_SESSION_SECRET
    } = process.env;
    const IS_PRODUCTION = process.env.NODE_ENV === 'production';

    return {
        PORT: parseInt(PORT, 10) || 3000,
        HOST: HOST || 'localhost',
        GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET,
        EXPRESS_SESSION_SECRET,
        IS_PRODUCTION,
        PASSPORT_CALLBACK_URL: PASSPORT_CALLBACK_URL || `https://${HOST}/login/return`
    };
};
