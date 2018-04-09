import { get, put } from './hrudb-repeater';
import { getUser, upsertUser } from './users-repository';

export const getChat = async chatId => get(`Chats_${chatId}`);

export const getAllChatsForUser = async (userId) => {
    const user = await getUser(userId);
    return Promise.all(user.chatIds.map(getChat));
};


function pushAndDistinct(array, element) {
    array.push(element);
    return Array.from(new Set(array));
}

export const upsertChat = chat => put(`Chats_${chat.chatId}`, chat);

export const joinChat = async (userId, chatId) => {
    const user = await getUser(userId);
    const chat = await getChat(chatId);

    user.chatIds = pushAndDistinct(user.chatIds, chatId);
    chat.userIds = pushAndDistinct(chat.userIds, userId);

    return Promise.all([upsertUser(user), upsertChat(chat)]);
};

