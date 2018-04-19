import { knex } from './knex';

export const createMessage = async message => knex('messages').insert(message);
export const getMessagesFromChat = async (chatId) => {
    const messages = await knex('messages').where({ chatId });
    return messages.map(msg =>
        Object.assign({}, msg, { timestamp: new Date(msg.timestamp) }));
};
