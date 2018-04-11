import { config } from 'dotenv';

config();
const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    EXPRESS_SESSION_SECRET,
    HRUDB_TOKEN,
    HRUDB_URL,
    LOGGLY_TOKEN,
    LOGGLY_SUBDOMAIN,
    TELEGRAM_BOT_TOKEN
} = process.env;

const HTTP_SCHEME = process.env.HTTP_SCHEME || 'http';
const PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || 'localhost';
const SITE_URL = process.env.SITE_URL || `${HTTP_SCHEME}://${HOST}:${PORT}`;
const TELEGRAM_CHAT_IDS = JSON.parse(process.env.TELEGRAM_CHAT_IDS || '[]');

export default {
    HTTP_SCHEME,
    PORT,
    HOST,
    SITE_URL,
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    EXPRESS_SESSION_SECRET,
    HRUDB_TOKEN,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    HRUDB_URL: HRUDB_URL || 'https://hrudb.herokuapp.com',
    LOGGLY_TOKEN,
    LOGGLY_SUBDOMAIN,
    TELEGRAM_CHAT_IDS,
    TELEGRAM_BOT_TOKEN
};
