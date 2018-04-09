import { getAll, put } from './hrudb-client';
import * as chatsRepository from './chats-repository';

export const upsertUser = async (updatedUser) => {
    const users = await getAll('Users');
    const userInDb = users.find(x => x.userId === updatedUser.userId);
    if (userInDb) {
        const index = users.indexOf(userInDb);
        users[index] = updatedUser;
        await put('Users', users);
    } else {
        users.push(updatedUser);
        await put('Users', users);
    }
};

export const getUser = async (userId) => {
    const users = await getAll('Users');
    return users.length === 0
        ? null
        : users[0].find(user => user.userId === userId) || null;
};

function pushAndDistinct(array, element) {
    array.push(element);
    return Array.from(new Set(array));
}

export const joinChat = async (userId, chatId) => {
    const user = await getUser(userId);
    const chat = await chatsRepository.getChat(chatId);

    user.chatIds = pushAndDistinct(user.chatIds, chatId);
    chat.userIds = pushAndDistinct(chat.userIds, userId);

    return Promise.all([
        await upsertUser(user),
        await chatsRepository.upsertChat(chat)]);
};
