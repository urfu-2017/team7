import { get, put } from './hrudb-repeater';
import { getUser, upsertUser } from './users-repository';

export const getChat = async chatId => get(`Chats_${chatId}`);

export const getAllChatsForUser = async (userId) => {
    const user = await getUser(userId);
    return Promise.all(user.chatIds.map(getChat));
};

export const upsertChat = chat => put(`Chats_${chat.chatId}`, chat);

export const joinChat = async (userId, chatId) => {
    const user = await getUser(userId);
    const chat = await getChat(chatId);

    if (!user.chatIds.includes(chatId)) {
        user.chatIds.push(chatId);
    }
    if (!chat.userIds.includes(userId)) {
        chat.userIds.push(userId);
    }

    // TODO: если что-то одно зафейлится, будет плохо
    return Promise.all([upsertUser(user), upsertChat(chat)]);
};

