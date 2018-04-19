import Knex from 'knex';
import getLogger from '../../utils/logger';
import config from '../../config';

const logger = getLogger('postgres-knex');


export const createTables = async (knex) => {
    await knex.schema.createTable('user', (table) => {
        table.uuid('userId').primary();
        table.integer('githubId').unique().notNullable();
        table.string('username');
        table.string('avatarUrl');
    });

    await knex.schema.createTable('chat', (table) => {
        table.uuid('chatId').primary();
        table.string('name');
        table.string('avatarUrl');
    });

    await knex.schema.createTable('users_chats', (table) => {
        table.uuid('chatId').references('chat.chatId');
        table.uuid('userId').references('user.userId');
        table.primary(['chatId', 'userId']);
    });

    await knex.schema.createTable('message', (table) => {
        table.uuid('messageId').primary();
        table.timestamp('timestamp');
        table.uuid('authorUserId').references('user.userId');
        table.string('content');
        table.string('originalContent');
        table.uuid('chatId').references('chat.chatId');
    });
};

let knexInstance;

export const knex = (...args) => (args.length ? knexInstance(...args) : knexInstance);

export const connect = async () => {
    if (knexInstance) {
        logger.warn('Already connected');
        return;
    }
    try {
        knexInstance = await Knex({
            client: 'pg',
            acquireConnectionTimeout: 10000,
            connection: config.POSTGRES_CONNECTION_STRING
        });
        const tablesExits = await knexInstance.schema.hasTable('user');

        if (!tablesExits) {
            await createTables(knexInstance);
        }
    } catch (e) {
        logger.fatal(e, 'Connection to postgres failed');
        throw e;
    }
};

