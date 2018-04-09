import { post, getAll } from './hrudb-repeater';

export const createMessage = message => post(`Messages_${message.chatId}`, message);
export const getMessagesFromChat = chatId => getAll(`Messages_${chatId}`);
