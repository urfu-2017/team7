import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import * as eventNames from './event-names';
import { usersRepo, messagesRepo, chatsRepo } from '../db/postgres';
import * as userInfoProvider from './user-info-provider';
import { Message } from '../db/datatypes';
import { getOwlUrl } from '../utils/owl-provider';
import { MAX_MESSAGE_LENGTH } from '../utils/constants';
import getMetadata from '../utils/url-metadata';
import getWeather from '../utils/weather';
import getLogger from '../utils/logger';

export const logger = getLogger('socket-server');

export default (socketServer, socket, currentUserId) => {
    const getAllSockets = () => new Promise((resolve, reject) =>
        socketServer.sockets.clients((error, clients) => (error
            ? reject(error)
            : resolve(clients.map(id => socketServer.sockets.connected[id])))));

    const fetchAndSendUser = async (userId) => {
        const user = await usersRepo.getUser(userId);
        if (user) {
            socket.emit(eventNames.server.USER, user);
        }
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
            const sendChatInfoPromises = user.chatIds.map(async (chatId) => {
                const chat = await chatsRepo.getChat(chatId);
                socket.emit(eventNames.server.CHAT, chat);
                socket.join(chat.chatId);

                const messages = await messagesRepo.getMessagesFromChat(chatId);
                socket.emit(eventNames.server.LIST_MESSAGES, { messages, chatId });

                return chat;
            });

            const chats = await Promise.all(sendChatInfoPromises);
            const sendUsersPromises = _.chain(chats)
                .flatMap(chat => chat.userIds)
                .uniq()
                .map(fetchAndSendUser)
                .value();

            await Promise.all(sendUsersPromises);
        },

        async sendChatInfo({ chatId }) {
            const messages = await messagesRepo.getMessagesFromChat(chatId);
            socket.emit(eventNames.server.LIST_MESSAGES, { chatId, messages });
            const sendUserPromises = _.chain(messages)
                .map(message => message.authorUserId)
                .uniq()
                .map(fetchAndSendUser)
                .value();
            await Promise.all(sendUserPromises);
        },

        async searchUser({ query }) {
            const usersFromIndex = await usersRepo.getAllUsers();
            const re = new RegExp(_.escapeRegExp(query), 'i');
            const sendUserPromises = _.chain(usersFromIndex)
                .map((username, userId) => ({ username, userId }))
                .filter(user => re.test(user.username))
                .map(user => user.userId)
                .map(fetchAndSendUser)
                .value();
            await Promise.all(sendUserPromises);
        },

        async newMessage({ chatId, text }) {
            const truncatedText = text.substring(0, MAX_MESSAGE_LENGTH);
            const message = new Message(
                uuidv4(), new Date(),
                currentUserId, truncatedText,
                truncatedText, chatId
            );
            socket.emit(eventNames.server.MESSAGE_SENT, message);

            try {
                await messagesRepo.createMessage(message);
                socket.broadcast.to(message.chatId).emit(eventNames.server.MESSAGE, message);
                socket.emit(eventNames.server.MESSAGE_RECEIVED, message);
            } catch (e) {
                logger.warn(e, `Failed to save message '${message.content}' in db`);
                socket.emit(eventNames.server.MESSAGE_REVOKED, message);
            }
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
            const chat = await chatsRepo.createChat(name, getOwlUrl());
            const joinChatPromises = userIds
                .map(userId => chatsRepo.joinChat(userId, chat.chatId));
            await Promise.all(joinChatPromises);

            const joinRoomPromises = _.chain(await getAllSockets())
                .map(async (otherSocket) => {
                    const otherUserId = await userInfoProvider.getUserId(otherSocket.handshake);
                    if (userIds.includes(otherUserId)) {
                        otherSocket.join(chat.chatId);
                        otherSocket.emit(eventNames.server.CHAT, chat);
                    }
                }).value();
            await Promise.all(joinRoomPromises);
        },

        async getWeather(city) {
            const response = await getWeather(city);
            socket.emit(eventNames.server.WEATHER, { ...response, city });
        },

        async changeAvatarUrl(url) {
            const currentUser = await usersRepo.getUser(currentUserId);
            currentUser.avatarUrl = url;
            await usersRepo.updateUser(currentUser);
            socket.emit(eventNames.server.CURRENT_USER, currentUser);
            currentUser.chatIds
                .map(chatId => socket.broadcast.to(chatId))
                .map(endpoint => endpoint.emit(eventNames.server.USER, currentUser));
        }
    };
};
