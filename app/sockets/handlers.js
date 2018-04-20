import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import * as eventNames from './event-names';
import * as usersRepository from '../db/postgres/users-repository';
import * as messagesRepository from '../db/postgres/messages-repository';
import * as chatsRepository from '../db/postgres/chats-repository';
import * as userInfoProvider from './user-info-provider';
import { Chat, Message } from '../db/datatypes';
import { getOwlUrl } from '../utils/owl-provider';
import getLogger from '../utils/logger';
import { MAX_CHAT_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '../utils/constants';
import getMetadata from '../utils/url-metadata';
import getWeather from '../utils/weather';

const logger = getLogger('socket-server');

export default (socketServer, socket, currentUserId) => {
    const getAllSockets = () => new Promise((resolve, reject) =>
        socketServer.sockets.clients((error, clients) => (error
            ? reject(error)
            : resolve(clients.map(id => socketServer.sockets.connected[id])))));

    const sendUser = async ({ userId }) => {
        const user = await usersRepository.getUser(userId);
        if (user) {
            socket.emit(eventNames.server.USER, user);
        }
    };

    return {
        asyncSocketHandler() {
            return (eventName, asyncMessageHandler) => {
                socket.on(eventName, async (...args) => {
                    try {
                        await asyncMessageHandler(...args);
                    } catch (e) {
                        logger.warn(e, `Socket error (event=${eventName}, user=${currentUserId})`);
                    }
                });
            };
        },

        sendUser({ userId }) {
            sendUser({ userId });
        },

        async trySendUserInfo() {
            try {
                const user = await usersRepository.getUser(currentUserId);
                socket.emit(eventNames.server.CURRENT_USER, user);
            } catch (e) {
                logger.warn(e, `Failed to send user info ${currentUserId}`);
            }
        },

        async trySendUserChats() {
            try {
                const user = await usersRepository.getUser(currentUserId);
                const sendChatInfoPromises = user.chatIds.map(async (chatId) => {
                    const chat = await chatsRepository.getChat(chatId);
                    socket.emit(eventNames.server.CHAT, chat);
                    socket.join(chat.chatId);

                    const messages = await messagesRepository.getMessagesFromChat(chatId);
                    socket.emit(eventNames.server.LIST_MESSAGES, { messages, chatId });

                    return chat;
                });

                const chats = await Promise.all(sendChatInfoPromises);
                const sendUsersPromises = _.chain(chats)
                    .flatMap(chat => chat.userIds)
                    .uniq()
                    .map(userId => sendUser({ userId }))
                    .value();

                await Promise.all(sendUsersPromises);
            } catch (e) {
                logger.warn(e, `Failed to send user chats (userId=${currentUserId})`);
            }
        },

        async sendMessages({ chatId }) {
            logger.trace('client.GET_MESSAGES', { chatId });
            const messages = await messagesRepository.getMessagesFromChat(chatId);
            socket.emit(eventNames.server.LIST_MESSAGES, { chatId, messages });
            const sendUserPromises = _.chain(messages)
                .map(message => message.authorUserId)
                .uniq()
                .map(userId => sendUser({ userId }))
                .value();
            await Promise.all(sendUserPromises);
        },

        async searchUser({ query }) {
            logger.trace('client.SEARCH_USER', { query });
            const usersFromIndex = await usersRepository.getAllUsers();
            const re = new RegExp(_.escapeRegExp(query), 'i');
            const sendUserPromises = _.chain(usersFromIndex)
                .map((username, userId) => ({ username, userId }))
                .filter(user => re.test(user.username))
                .map(user => user.userId)
                .map(userId => sendUser({ userId }))
                .value();
            await Promise.all(sendUserPromises);
        },

        async newMesage({ chatId, text }) {
            logger.trace('client.NEW_MESSAGE', { chatId, text });
            const truncatedText = text.substring(0, MAX_MESSAGE_LENGTH);
            const message = new Message(
                uuidv4(), new Date(),
                currentUserId, truncatedText,
                truncatedText, chatId
            );
            socket.emit(eventNames.server.MESSAGE_SENT, message);

            try {
                await messagesRepository.createMessage(message);
                socket.broadcast.to(message.chatId).emit(eventNames.server.MESSAGE, message);
                socket.emit(eventNames.server.MESSAGE_RECEIVED, message);
            } catch (e) {
                logger.warn(e, `Failed to save message '${message.content}' in db`);
                socket.emit(eventNames.server.MESSAGE_REVOKED, message);
            }
        },

        async getUrlMeta(url) {
            logger.trace('client.GET_URL_META', { url });
            try {
                const meta = await getMetadata(url);
                logger.debug('Got meta:', meta);
                socket.emit(eventNames.server.URL_META, { meta, url });
            } catch (e) {
                logger.debug(e, `No metadata for url=${url}`);
            }
        },

        async createChat({ name, userIds }) {
            logger.trace('client.CREATE_CHAT', { name, userIds });
            const chatId = uuidv4();
            const chat = new Chat(
                chatId,
                name.substring(0, MAX_CHAT_NAME_LENGTH),
                [],
                getOwlUrl()
            );
            await chatsRepository.upsertChat(chat);
            const joinChatPromises = userIds
                .map(userId => chatsRepository.joinChat(userId, chatId));
            await Promise.all(joinChatPromises);

            const joinRoomPromises = _.chain(await getAllSockets())
                .map(async (otherSocket) => {
                    const otherUserId = await userInfoProvider.getUserId(otherSocket.handshake);
                    if (userIds.includes(otherUserId)) {
                        otherSocket.join(chatId);
                        otherSocket.emit(eventNames.server.CHAT, chat);
                    }
                }).value();
            await Promise.all(joinRoomPromises);
        },

        async getWeather(city) {
            const response = await getWeather(city);
            socket.emit(eventNames.server.WEATHER, { ...response, city });
        }
    };
};
