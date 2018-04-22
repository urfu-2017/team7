import { knex } from './knex';
import { User } from '../datatypes';


export const getAllUsers = async () => {
    const users = await knex('user').select('userId', 'username');

    return users.reduce((result, { userId, username }) => {
        result[userId] = username; // eslint-disable-line no-param-reassign

        return result;
    }, {});
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
    const [{ username, avatarUrl, githubId }] = items;

    return new User(userId, githubId, username, avatarUrl, chatIds);
};

export const removeUser = async userId => knex('user').where({ userId }).del();

export const updateUser = async ({
    username, avatarUrl, githubId, userId
}) => knex('user')
    .where({ userId })
    .update({ username, avatarUrl, githubId });

