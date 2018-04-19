import Promise from 'bluebird';
import { knex } from './knex';
import { User } from '../datatypes';


export const upsertUser = async (updatedUser) => {
    // TODO: избавиться от upsert
    const [user] = await knex('users').where('id', updatedUser.userId);
    if (!user) {
        const {
            userId, username, avatarUrl, chatIds
        } = updatedUser;
        await knex('users').insert({ id: userId, username, avatarUrl });
        knex().transaction(async trx => Promise.map(
            chatIds,
            async chatId => trx.insert({ userId, chatId }).into('userChats')
        ));
    }
};

export const getAllUsers = async () => {
    const result = {};
    const users = await knex('users').select('id', 'username');
    users.forEach(({ id, username }) => {
        result[id] = username;
    });
    return result;
};

export const removeAllUsers = async () => knex('users').del();

export const getUser = async (userId) => {
    const items = await knex('users')
        .where({ id: userId })
        .leftJoin('userChats', 'userChats.userId', '=', 'users.id');
    if (!items.length) {
        throw new Error(`No such user (userId=${userId})`);
    }

    const chatIds = items.map(x => x.chatId).filter(Boolean);
    const { username, avatarUrl } = items[0];
    return new User(userId, username, avatarUrl, chatIds);
};


// TODO: избавиться от него, используется только в hrudb.loginUser
export const upsertAllUsers = async () => {};

export const removeUser = async userId => knex('users').where({ id: userId }).del();
