import uuidv4 from 'uuid/v4';
import mngen from 'mngen';
import _ from 'lodash';
import Promise from 'bluebird';
import { knex, transactAsync } from './knex';
import { Chat } from '../datatypes';
import { MAX_CHAT_NAME_LENGTH } from '../../utils/constants';

export const getChatByInviteWord = async (inviteWord) => {
    const items = await knex('chat')
        .where('chat.inviteWord', inviteWord)
        .leftJoin('users_chats', 'users_chats.chatId', 'chat.chatId')
        .select('users_chats.userId', 'chat.*');

    if (!items.length) {
        throw new Error(`No such chat (inviteWord=${inviteWord})`);
    }

    const userIds = items.map(x => x.userId).filter(Boolean);
    const [{ chatId, name, avatarUrl }] = items;

    return new Chat(chatId, name, userIds, avatarUrl, false, inviteWord);
};

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
    const [{
        name, avatarUrl, isPrivate, inviteWord
    }] = items;
    if (isPrivate) {
        const index = items.findIndex(x => x.userId === userId);
        const { username, userAvatarUrl } = items[index - 1] || items[index + 1] || items[index];

        return new Chat(chatId, `@${username}`, userIds, userAvatarUrl, true, null);
    }

    return new Chat(chatId, name, userIds, avatarUrl, false, inviteWord);
};

export const createChat = async (longName, avatarUrl) => {
    const name = longName.substring(0, MAX_CHAT_NAME_LENGTH);
    const chatId = uuidv4();
    let chat;
    await Promise.mapSeries(_.range(1, 5), async (i) => {
        if (chat) {
            return;
        }
        const inviteWord = mngen.word(i);
        await knex('chat').insert({
            name, avatarUrl, chatId, isPrivate: false, inviteWord, isSelfChat: false
        }).then(() => {
            chat = new Chat(chatId, name, [], avatarUrl, false, inviteWord);
        }, () => null);
    });
    if (!chat) {
        throw new Error(`Can't create chat: longName='${longName}', avatarUrl=${avatarUrl}`);
    }

    return chat;
};

const getPrivateChatId = async (user1id, user2id, trx) => {
    const isSelfChat = user1id === user2id;
    const [privateChat] = await knex('chat')
        .transacting(trx)
        .join('users_chats as uc1', 'uc1.chatId', 'chat.chatId')
        .join('users_chats as uc2', 'uc2.chatId', 'uc1.chatId')
        .where('uc1.userId', user1id)
        .andWhere('uc2.userId', user2id)
        .andWhere('chat.isPrivate', true)
        .andWhere('chat.isSelfChat', isSelfChat)
        .select('chat.chatId');

    return privateChat ? privateChat.chatId : null;
};

export const getOrCreatePrivateChatId = async (user1id, user2id) => {
    let chatId = uuidv4();
    const isSelfChat = user1id === user2id;

    await transactAsync(async (trx) => {
        const privateChatId = await getPrivateChatId(user1id, user2id, trx);
        if (privateChatId) {
            chatId = privateChatId;

            return;
        }

        await Promise.all([
            knex('chat').transacting(trx).insert({ chatId, isPrivate: true, isSelfChat }),
            knex('users_chats').transacting(trx).insert({ userId: user1id, chatId }),
            isSelfChat ?
                Promise.resolve() :
                knex('users_chats').transacting(trx).insert({ userId: user2id, chatId })
        ]);
    });

    return chatId;
};

export const joinChat = async (userId, chatId) =>
    knex('users_chats').insert({ userId, chatId });

export const leaveChat = async (userId, chatId) => {
    const [{ isPrivate }] = await knex('chat').where({ chatId });

    return knex('users_chats')
        .where(isPrivate ? { chatId } : { chatId, userId })
        .del();
};
