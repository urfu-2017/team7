import { config } from 'dotenv';
import uuidv4 from 'uuid/v4';

config();
const {
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    EXPRESS_SESSION_SECRET,
    HRUDB_TOKEN,
    HRUDB_URL,
    LOGGLY_TOKEN,
    LOGGLY_SUBDOMAIN,
    TELEGRAM_BOT_TOKEN,
    CONSOLE_LOG_LEVEL,
    WEATHER_TOKEN,
    POSTGRES_CONNECTION_STRING,
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    S3_ENDPOINT,
    S3_BUCKET
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
    EXPRESS_SESSION_SECRET: EXPRESS_SESSION_SECRET || uuidv4(),
    HRUDB_TOKEN,
    WEATHER_TOKEN,
    IS_PRODUCTION: process.env.NODE_ENV === 'production',
    HRUDB_URL: HRUDB_URL || 'https://hrudb.herokuapp.com',
    LOGGLY_TOKEN,
    LOGGLY_SUBDOMAIN,
    S3_PORT: parseInt(process.env.S3_PORT, 10) || 7000,
    S3_SECURE: process.env.S3_SECURE !== 'false',
    S3_ENDPOINT: S3_ENDPOINT || 'kilogram.online',
    S3_BUCKET: S3_BUCKET || 'test',
    TELEGRAM_CHAT_IDS,
    TELEGRAM_BOT_TOKEN,
    POSTGRES_CONNECTION_STRING: POSTGRES_CONNECTION_STRING || 'postgres://user:pass@example.com:5432/dbname',
    S3_ACCESS_KEY,
    S3_SECRET_KEY,
    CONSOLE_LOG_LEVEL: CONSOLE_LOG_LEVEL || 'info'
};
