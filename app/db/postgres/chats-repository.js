import uuidv4 from 'uuid/v4';
import { knex, transactAsync } from './knex';
import { Chat } from '../datatypes';
import { MAX_CHAT_NAME_LENGTH } from '../../utils/constants';


export const getChatForUser = async (userId, chatId) => {
    const items = await knex('chat')
        .where('chat.chatId', chatId)
        .leftJoin('users_chats', 'users_chats.chatId', 'chat.chatId')
        .leftJoin('user', 'user.userId', 'users_chats.userId')
        .select('user.userId', 'user.username', 'user.avatarUrl as userAvatarUrl', 'chat.*');

    if (!items.length) {
        throw new Error(`No such chat (chatId=${chatId})`);
    }
    const userIds = items.map(x => x.userId).filter(Boolean);
    const [{ name, avatarUrl, isPrivate }] = items;
    if (isPrivate) {
        const index = items.findIndex(x => x.userId === userId);
        const { username, userAvatarUrl } = items[index - 1] || items[index + 1];

        return new Chat(chatId, `@${username}`, userIds, userAvatarUrl, true);
    }

    return new Chat(chatId, name, userIds, avatarUrl, false);
};


export const createChat = async (longName, avatarUrl) => {
    const name = longName.substring(0, MAX_CHAT_NAME_LENGTH);
    const chatId = uuidv4();
    await knex('chat').insert({
        name, avatarUrl, chatId, isPrivate: false
    });

    return new Chat(chatId, name, [], avatarUrl, false);
};

export const createPrivateChat = async (user1id, user2id) => {
    const chatId = uuidv4();
    await transactAsync(async trx => Promise.all([
        knex('chat').transacting(trx).insert({ chatId, isPrivate: true }),
        knex('users_chats').transacting(trx).insert({ userId: user1id, chatId }),
        knex('users_chats').transacting(trx).insert({ userId: user2id, chatId })
    ]));

    return chatId;
};

export const joinChat = async (userId, chatId) =>
    knex('users_chats').insert({ userId, chatId });
