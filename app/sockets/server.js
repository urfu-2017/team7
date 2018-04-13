import Server from 'socket.io';
import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import * as eventNames from './event-names';
import * as usersRepository from '../db/users-repository';
import * as messagesRepository from '../db/messages-repository';
import * as chatsRepository from '../db/chats-repository';
import * as userInfoProvider from './user-info-provider';
import { Chat, Message } from '../db/datatypes';
import { getOwlUrl } from '../utils/owl-provider';
import getLogger from '../utils/logger';
import { MAX_CHAT_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '../utils/constants';
import getMetadata from '../utils/url-metadata';

const logger = getLogger('socket-server');

const trySendUserChats = async (socket, userId) => {
    try {
        const user = await usersRepository.getUser(userId);
        const sendChatInfoPromises = user.chatIds.map(async (chatId) => {
            const chat = await chatsRepository.getChat(chatId);
            socket.emit(eventNames.server.CHAT, chat);
            socket.join(chat.chatId);
            const messages = await messagesRepository.getMessagesFromChat(chatId);
            socket.emit(eventNames.server.LIST_MESSAGES, { messages, chatId });
        });
        await Promise.all(sendChatInfoPromises);
    } catch (e) {
        logger.warn(e, 'Failed to send user chats');
    }
};

const getAsyncSocketHandler = (socket, currentUserId) => (eventName, asyncMessageHandler) => {
    socket.on(eventName, async (...args) => {
        try {
            await asyncMessageHandler(...args);
        } catch (e) {
            logger.warn(e, `Socket error (event=${eventName}, user=${currentUserId})`);
        }
    });
};

const registerMessageHandlers = (socketServer, socket, currentUserId) => {
    const sendUser = async (userId) => {
        const user = await usersRepository.getUser(userId);
        if (user) {
            socket.emit(eventNames.server.USER, user);
        }
    };

    const getAllSockets = () => new Promise((resolve, reject) =>
        socketServer.sockets.clients((error, clients) => (error
            ? reject(error)
            : resolve(clients.map(id => socketServer.sockets.connected[id])))));

    const on = getAsyncSocketHandler(socket, currentUserId);

    on(eventNames.client.GET_CHATS, () => trySendUserChats(socket, currentUserId));

    on(eventNames.client.GET_MESSAGES, async ({ chatId }) => {
        logger.trace('client.GET_MESSAGES', { chatId });
        const messages = await messagesRepository.getMessagesFromChat(chatId);
        socket.emit(eventNames.server.LIST_MESSAGES, { chatId, messages });
        const sendUserPromises = _.chain(messages)
            .map(x => x.authorUserId)
            .uniq()
            .map(sendUser)
            .value();
        await Promise.all(sendUserPromises);
    });

    on(eventNames.client.GET_USER, ({ userId }) => sendUser(userId));

    on(eventNames.client.SEARCH_USER, async ({ query }) => {
        logger.trace('client.SEARCH_USER', { query });
        const usersFromIndex = await usersRepository.getAllUsers();
        const re = new RegExp(_.escapeRegExp(query), 'i');
        const sendUserPromises = _.chain(usersFromIndex)
            .map((username, userId) => ({ username, userId }))
            .filter(x => re.test(x.username))
            .map(x => x.userId)
            .map(sendUser)
            .value();
        await Promise.all(sendUserPromises);
    });

    on(eventNames.client.NEW_MESSAGE, async ({ chatId, text }) => {
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
    });

    on(eventNames.client.GET_URL_META, async (url) => {
        logger.trace('client.GET_URL_META', { url });
        try {
            const meta = await getMetadata(url);
            logger.debug('Got meta:', meta);
            socket.emit(eventNames.server.URL_META, { meta, url });
        } catch (e) {
            logger.debug(e, `No metadata for url=${url}`);
        }
    });

    on(eventNames.client.CREATE_CHAT, async ({ name, userIds }) => {
        logger.trace('client.CREATE_CHAT', { name, userIds });
        const chatId = uuidv4();
        const chat = new Chat(
            chatId,
            name.substring(0, MAX_CHAT_NAME_LENGTH),
            [],
            getOwlUrl()
        );
        await chatsRepository.upsertChat(chat);
        const joinChatPromises = userIds.map(userId => chatsRepository.joinChat(userId, chatId));
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
    });
};

const trySendUserInfo = async (socket, userId) => {
    try {
        const user = await usersRepository.getUser(userId);
        socket.emit(eventNames.server.CURRENT_USER, user);
    } catch (e) {
        logger.warn(e, 'Failed to send user info');
    }
};

export default async (server) => {
    const socketServer = new Server(server, {
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    socketServer.on('connection', async (socket) => {
        try {
            const userId = await userInfoProvider.getUserId(socket.handshake);
            registerMessageHandlers(socketServer, socket, userId);
            trySendUserInfo(socket, userId);
            trySendUserChats(socket, userId);

            logger.trace(`Socket connected. socket.id=${socket.id}, userId=${userId}`);
        } catch (e) {
            logger.error(e, 'Socket connection failed.');
            socket.disconnect(true);
        }
    });
};
