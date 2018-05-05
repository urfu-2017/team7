import _ from 'lodash';
import Promise from 'bluebird';
import * as eventNames from './event-names';
import { usersRepo, messagesRepo, chatsRepo } from '../db/postgres';
import { createChat, createPrivateChat } from './chat-creator';
import { createMessage } from './message-creator';
import getMetadata from '../utils/url-metadata';
import getWeather from '../utils/weather';
import getLogger from '../utils/logger';

export const logger = getLogger('socket-server');

export default (socketServer, socket, currentUserId) => {
    const fetchAndSendUser = async (userId) => {
        const user = await usersRepo.getUser(userId);
        if (user) {
            socket.emit(eventNames.server.USER, user);
        }
    };

    const sendUsers = async userIds =>
        Promise.map(_(userIds).uniq(), fetchAndSendUser, { concurrency: 5 });

    const sendMessages = async (chatId) => {
        const messages = await messagesRepo.getMessagesFromChat(chatId);
        socket.emit(eventNames.server.LIST_MESSAGES, { messages, chatId });

        return messages;
    };

    return {
        asyncSocketHandler() {
            return (eventName, asyncMessageHandler) => {
                socket.on(eventName, async (...args) => {
                    try {
                        logger.trace(`client.${eventName}`, args);
                        await asyncMessageHandler(...args);
                    } catch (e) {
                        logger.warn(e, `Socket error (event=${eventName}, user=${currentUserId})`);
                    }
                });
            };
        },

        async sendUser({ userId }) {
            await fetchAndSendUser(userId);
        },

        async sendCurrentUser() {
            const user = await usersRepo.getUser(currentUserId);
            socket.emit(eventNames.server.CURRENT_USER, user);
        },

        async sendUserChats() {
            const user = await usersRepo.getUser(currentUserId);
            Promise.map(user.chatIds, async (chatId) => {
                const chat = await chatsRepo.getChatForUser(currentUserId, chatId);
                socket.emit(eventNames.server.CHAT, chat);
                socket.join(chat.chatId);
                await Promise.join(
                    sendUsers(chat.userIds),
                    sendMessages(chatId)
                );
            }, { concurrency: 5 });
        },

        async sendChatInfo({ chatId }) {
            const messages = await sendMessages(chatId);
            const userIds = _(messages).flatMap(message => message.authorUserId);
            await sendUsers(userIds);
        },

        async searchUser({ query }) {
            const usersFromIndex = await usersRepo.getAllUsers();
            const re = new RegExp(_.escapeRegExp(query), 'i');
            const matchingUserIds = _.chain(usersFromIndex)
                .map((username, userId) => ({ username, userId }))
                .filter(user => re.test(user.username))
                .map(user => user.userId)
                .value();
            await sendUsers(matchingUserIds);
        },

        async newMessage({ chatId, text }) {
            await createMessage(socket, text, currentUserId, chatId);
        },

        async getOrCreatePrivateChat({ userId }) {
            await createPrivateChat(socketServer, { currentUserId, userId });
        },

        async getChatByInviteWord({ inviteWord }) {
            const chat = await chatsRepo.getChatByInviteWord(inviteWord);
            if (!chat.userIds.includes(currentUserId)) {
                await chatsRepo.joinChat(currentUserId, chat.chatId);
            }
            socket.emit(eventNames.server.CHAT, chat);
        },

        async leaveChat({ userId, chatId }) {
            await chatsRepo.leaveChat(userId, chatId);
            socket.emit(eventNames.server.USER_LEAVED_CHAT, { userId, chatId });
        },

        async getUrlMeta(url) {
            try {
                const meta = await getMetadata(url);
                logger.debug('Got meta:', meta);
                socket.emit(eventNames.server.URL_META, { meta, url });
            } catch (e) {
                logger.debug(e, `No metadata for url=${url}`);
            }
        },

        async createChat({ name, userIds }) {
            await createChat(socketServer, { currentUserId, name, userIds });
        },

        async getWeather(city) {
            const response = await getWeather(city);
            socket.emit(eventNames.server.WEATHER, { ...response, city });
        },

        async changeAvatarUrl(url) {
            if (!url.startsWith('/s3/uploads/avatars/')) {
                throw new Error(`Changing user avatar to ${url} has been rejected`);
            }
            const currentUser = await usersRepo.getUser(currentUserId);
            currentUser.avatarUrl = url;
            await usersRepo.updateUser(currentUser);
            socket.emit(eventNames.server.CURRENT_USER, currentUser);
            currentUser.chatIds
                .map(chatId => socket.broadcast.to(chatId))
                .map(endpoint => endpoint.emit(eventNames.server.USER, currentUser));
        },

        async addReaction({ messageId, reaction }) {
            await messagesRepo.addReaction({ messageId, userId: currentUserId, reaction });
            const message = await messagesRepo.getMessage(messageId);
            socket.emit(eventNames.server.UPDATE_MESSAGE, message);
        },

        async removeReaction({ messageId, reaction }) {
            await messagesRepo.removeReaction({ messageId, userId: currentUserId, reaction });
            const message = await messagesRepo.getMessage(messageId);
            socket.emit(eventNames.server.UPDATE_MESSAGE, message);
        }
    };
};
