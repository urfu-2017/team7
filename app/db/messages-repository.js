import { post, getAll } from './hrudb-client';

export const createMessage = message => post(`Messages_${message.chatId}`, message);
export const getMessagesFromChat = chatId => getAll(`Messages_${chatId}`);
