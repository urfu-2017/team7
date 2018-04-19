import { knex } from './knex';

export const createMessage = message => knex('messages').insert(message);
export const getMessagesFromChat = chatId => knex('messages').where({ chatId });

