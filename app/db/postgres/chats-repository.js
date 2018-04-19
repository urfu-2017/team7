import Promise from 'bluebird';
import { knex } from './knex';
import { Chat } from '../datatypes';

export const getChat = async (chatId) => {
    const items = await knex('chats')
        .where({ id: chatId })
        .join('userChats', 'userChats.chatId', 'chats.id');

    if (!items.length) {
        throw new Error(`No such chat (chatId=${chatId})`);
    }
    const userIds = items.map(x => x.userId);
    const { name, avatarUrl } = items[0];
    return new Chat(chatId, name, userIds, avatarUrl);
};

export const upsertChat = async (updatedChat) => {
    // TODO: избавиться от upsert
    const [chat] = await knex('chats').where('id', updatedChat.chatId);
    if (!chat) {
        const {
            chatId, name, avatarUrl, userIds
        } = updatedChat;
        await knex('chats').insert({ id: chatId, name, avatarUrl });
        knex().transaction(async trx => Promise.map(
            userIds,
            async userId => trx.insert({ userId, chatId }).into('userChats')
        ));
    }
};

export const joinChat = async (userId, chatId) => knex('userChats').insert({ userId, chatId });

