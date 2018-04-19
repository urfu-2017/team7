import { knex } from './knex';
import { Chat } from '../datatypes';
import { MAX_CHAT_NAME_LENGTH } from '../../utils/constants';

export const getChat = async (chatId) => {
    const items = await knex('chat')
        .where({ chatId })
        .leftJoin('users_chats', 'users_chats.chatId', 'chat.chatId')
        .select('users_chats.userId', 'chat.name', 'chat.avatarUrl');

    if (!items.length) {
        throw new Error(`No such chat (chatId=${chatId})`);
    }
    const userIds = items.map(x => x.userId).filter(Boolean);
    const { name, avatarUrl } = items[0];
    return new Chat(chatId, name, userIds, avatarUrl);
};

export const createChat = async (longName, avatarUrl) => {
    const name = longName.substring(0, MAX_CHAT_NAME_LENGTH);
    const { chatId } = await knex('chat')
        .insert({ name, avatarUrl })
        .returning('chatId');
    return new Chat(chatId, name, [], avatarUrl);
};

export const joinChat = async (userId, chatId) =>
    knex('users_chats').insert({ userId, chatId });

