/* eslint-disable no-console */
import Server from 'socket.io';
import _ from 'lodash';
import urlMetadata from 'url-metadata2';
import uuidv4 from 'uuid/v4';
import * as eventNames from './eventNames';
import * as usersRepository from '../db/users-repository';
import * as messagesRepository from '../db/messages-repository';
import * as chatsRepository from '../db/chats-repository';
import * as userInfoProvider from './user-info-provider';
import { Chat, Message } from '../db/datatypes';
import { getOwlUrl } from '../utils/owl-provider';
import getLogger from '../utils/logger';
import { MAX_CHAT_NAME_LENGTH, MAX_MESSAGE_LENGTH } from '../utils/constants';

const logger = getLogger('socket-server');

const trySendUserChats = async (socket, userId) => {
    try {
        const userChats = await chatsRepository.getAllChatsForUser(userId);
        socket.emit(eventNames.server.LIST_CHATS, userChats);

        userChats.forEach(x => socket.join(x.chatId));
    } catch (e) {
        logger.warn('Failed to send user chats');
    }
};

const registerMessageHandlers = (socketServer, socket, currentUserId) => {
    async function sendUser(userId) {
        const user = await usersRepository.getUser(userId);
        if (user) {
            socket.emit(eventNames.server.USER, user);
        }
    }

    function getAllSockets() {
        return new Promise((resolve, reject) =>
            socketServer.sockets.clients((error, clients) => (error
                ? reject(error)
                : resolve(clients.map(id => socketServer.sockets.connected[id])))));
    }

    socket.on(eventNames.client.GET_CHATS, () => trySendUserChats(socket, currentUserId));

    socket.on(eventNames.client.GET_MESSAGES, async ({ chatId }) => {
        const messages = await messagesRepository.getMessagesFromChat(chatId);
        socket.emit(eventNames.server.LIST_MESSAGES, { chatId, messages });
        const sendUserPromises = _.chain(messages)
            .map(x => x.authorUserId)
            .uniq()
            .map(sendUser)
            .value();
        await Promise.all(sendUserPromises);
    });

    socket.on(eventNames.client.GET_USER, ({ userId }) => sendUser(userId));

    socket.on(eventNames.client.SEARCH_USER, async ({ query }) => {
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

    socket.on(eventNames.client.NEW_MESSAGE, async ({ chatId, text }) => {
        const truncatedText = text.substring(0, MAX_MESSAGE_LENGTH);
        const message = new Message(
            uuidv4(), new Date(),
            currentUserId, truncatedText,
            truncatedText, chatId
        );
        await messagesRepository.createMessage(message);
        socketServer.to(message.chatId).emit(eventNames.server.MESSAGE, message);
    });

    socket.on(eventNames.client.GET_URL_META, async (url) => {
        const meta = await urlMetadata(url);
        socket.emit(eventNames.server.URL_META, { ...meta, url });
    });

    socket.on(eventNames.client.CREATE_CHAT, async ({ name, userIds }) => {
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

        const sockets = await getAllSockets();
        sockets.forEach((otherSocket) => {
            otherSocket.join(chatId);
            otherSocket.emit(eventNames.server.CHAT, chat);
        });
    });
};

const trySendUserInfo = async (socket, userId) => {
    try {
        const user = await usersRepository.getUser(userId);
        socket.emit(eventNames.server.CURRENT_USER, user);
    } catch (e) {
        logger.error(e, 'Failed to send user info');
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
            await trySendUserInfo(socket, userId);
            await trySendUserChats(socket, userId);
            logger.info('Socket connected. ID: ', socket.id);
        } catch (e) {
            logger.error(e, 'Socket connection failed.');
            socket.disconnect(true);
        }
    });
};
