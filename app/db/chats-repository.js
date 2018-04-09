import { get, put } from './hrudb-repeater';
import { getUser } from './users-repository';

export const getChat = async chatId => get(`Chats_${chatId}`);

export const getAllChatsForUser = async (userId) => {
    const user = await getUser(userId);
    return Promise.all(user.chatIds.map(getChat));
};


export const upsertChat = chat => put(`Chats_${chat.chatId}`, chat);

