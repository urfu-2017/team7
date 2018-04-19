import { knex } from './knex';
import { User } from '../datatypes';


export const getAllUsers = async () => {
    const result = {};
    const users = await knex('user').select('userId', 'username');
    users.forEach(({ userId, username }) => {
        result[userId] = username;
    });
    return result;
};

export const removeAllUsers = async () => knex('user').del();

export const getUser = async (userId) => {
    const items = await knex('user')
        .select('users_chats.chatId', 'user.*')
        .leftJoin('users_chats', 'users_chats.userId', 'user.userId')
        .where('user.userId', userId);
    if (!items.length) {
        throw new Error(`No such user (userId=${userId})`);
    }

    const chatIds = items.map(x => x.chatId).filter(Boolean);
    const { username, avatarUrl, githubId } = items[0];
    return new User(userId, githubId, username, avatarUrl, chatIds);
};

export const removeUser = async userId => knex('user').where({ userId }).del();
