import Knex from 'knex';
import getLogger from '../../utils/logger';
import config from '../../config';

const logger = getLogger('postgres-knex');


const createTables = async (knex) => {
    await knex.schema.createTable('users', (table) => {
        table.uuid('id').primary();
        table.string('username');
        table.string('avatarUrl');
    });

    await knex.schema.createTable('chats', (table) => {
        table.uuid('id').primary();
        table.string('name');
        table.string('avatarUrl');
    });

    await knex.schema.createTable('userChats', (table) => {
        table.uuid('chatId').references('chats.id');
        table.uuid('userId').references('users.id');
        table.primary(['chatId', 'userId']);
    });

    await knex.schema.createTable('messages', (table) => {
        table.uuid('messageId').primary();
        table.timestamp('timestamp');
        table.uuid('authorUserId').references('users.id');
        table.string('content');
        table.string('originalContent');
        table.uuid('chatId').references('chats.id');
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
        const tablesExits = await knexInstance.schema.hasTable('users');

        if (!tablesExits) {
            await createTables(knexInstance);
        }
    } catch (e) {
        logger.fatal(e, 'Connection to postgres failed');
        throw e;
    }
};

