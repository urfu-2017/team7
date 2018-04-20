import { knex } from './knex';

export const createMessage = async message => knex('message').insert(message);
export const getMessagesFromChat = async (chatId) => {
    const messages = await knex('message').where({ chatId });

    return messages.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }));
};
