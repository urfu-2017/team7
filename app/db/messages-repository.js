import { put, getAll } from './hrudb-client';

export const createMessage = message => put(`Messages_${message.recipientChat}`, message);
export const getMessagesFromChat = chatId => getAll(`Messages_${chatId}`);
