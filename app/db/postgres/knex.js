import Knex from 'knex';
import getLogger from '../../utils/logger';
import config from '../../config';
import { MAX_CHAT_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '../../utils/constants';

const logger = getLogger('postgres-knex');

const createTableFor = knex => async (tableName, tableCallback) => {
    if (await knex.schema.hasTable(tableName)) {
        return;
    }
    await knex.schema.createTable(tableName, tableCallback);
};

export const createTables = async (knex) => {
    const createTable = createTableFor(knex);

    await createTable('user', (table) => {
        table.uuid('userId').primary();
        table.integer('githubId').unique().notNullable();
        table.string('username');
        table.string('avatarUrl');
    });

    await createTable('chat', (table) => {
        table.uuid('chatId').primary();
        table.string('name', MAX_CHAT_NAME_LENGTH);
        table.boolean('isPrivate').notNullable();
        table.boolean('isSelfChat').notNullable();
        table.string('inviteWord').unique();
        table.string('avatarUrl');
    });

    await createTable('users_chats', (table) => {
        table.uuid('chatId').references('chat.chatId');
        table.uuid('userId').references('user.userId');
        table.primary(['chatId', 'userId']);
    });

    await createTable('message', (table) => {
        table.uuid('messageId').primary();
        table.timestamp('timestamp');
        table.uuid('authorUserId').references('user.userId');
        table.string('content', MAX_MESSAGE_LENGTH);
        table.string('originalContent', MAX_MESSAGE_LENGTH);
        table.uuid('chatId').references('chat.chatId');
    });

    await createTable('reactions', (table) => {
        table.uuid('messageId').references('message.messageId');
        table.uuid('userId').references('user.userId');
        table.primary(['messageId', 'userId', 'reaction']);
        table.string('reaction');
    });
};

let knexInstance;

export const transactAsync = async asyncCallback =>
    knexInstance.transaction(trx => asyncCallback(trx).then(trx.commit, trx.rollback));

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
        await createTables(knexInstance);
    } catch (e) {
        logger.fatal(e, 'Connection to postgres failed');
        throw e;
    }
};

