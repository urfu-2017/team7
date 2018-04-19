import uuidv4 from 'uuid/v4';
import { get, put } from './hrudb-repeater';
import { getUser } from './users-repository';
import getLogger from '../../utils/logger';
import { Chat } from '../datatypes';
import { MAX_CHAT_NAME_LENGTH } from '../../utils/constants';

const logger = getLogger('chats-repo');

export const getChat = async chatId => get(`Chats_${chatId}`);

export const createChat = async (longName, avatarUrl) => {
    const name = longName.substring(0, MAX_CHAT_NAME_LENGTH);
    const chatId = uuidv4();
    const chat = new Chat(chatId, name, [], avatarUrl);
    await put(`Chats_${chatId}`, chat);
    return chat;
};

export const joinChat = async (userId, chatId) => {
    const user = await getUser(userId);
    const chat = await getChat(chatId);

    if (!user.chatIds.includes(chatId)) {
        user.chatIds.push(chatId);
    }
    if (!chat.userIds.includes(userId)) {
        chat.userIds.push(userId);
    }

    try {
        // TODO: если что-то одно зафейлится, будет плохо
        return Promise.all([put(`Users_${userId}`, user), put(`Chats_${chatId}`, chat)]);
    } catch (e) {
        logger.fatal(e, `Failed to maintain consistency while joining user(${userId}) into chat(${chatId})! Data will be corrupt!`);
        throw e;
    }
};

