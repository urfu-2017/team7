import { get, put } from './hrudb-client';
import { getUser } from './users-repository';


export const getAllChatsForUser = async (userId) => {
    const user = await getUser(userId);
    const chats = await Promise.all(user.chats.map(chatId => get(`Chats_${chatId}`)));

    return chats;
};

export const createChat = chat => put(`Chats_${chat.id}`, chat);

