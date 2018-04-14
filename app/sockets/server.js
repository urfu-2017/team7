import Server from 'socket.io';
import urlMetadata from 'url-metadata2';
import uuidv4 from 'uuid/v4';
import * as eventNames from './eventNames';
import * as usersRepository from '../db/users-repository';
import * as messagesRepository from '../db/messages-repository';
import * as chatsRepository from '../db/chats-repository';
import * as userInfoProvider from './user-info-provider';
import { Chat, Message } from '../db/datatypes';
import getWeather from '../utils/weather';

const registerMessageHandlers = (socketServer, socket, userId) => {
    socket.on(eventNames.client.GET_CHATS, async () => {
        const userChats = await chatsRepository.getAllChatsForUser(userId);
        socket.emit(eventNames.server.LIST_CHATS, userChats);

        userChats
            .map(x => x.chatId)
            .forEach(chatId => socket.join(chatId));
    });

    socket.on(eventNames.client.GET_MESSAGES, async ({ chatId }) => {
        const messages = await messagesRepository.getMessagesFromChat(chatId);
        socket.emit(eventNames.server.LIST_MESSAGES, { chatId, messages });
    });

    socket.on(eventNames.client.GET_USER, async (payload) => {
        const user = await usersRepository.getUser(payload.userId);
        if (user) {
            socket.emit(eventNames.server.USER, user);
        }
    });

    socket.on(eventNames.client.NEW_MESSAGE, async ({ chatId, text }) => {
        const message = new Message(
            uuidv4(),
            new Date(),
            userId,
            text,
            text,
            chatId,
        );
        await messagesRepository.createMessage(message);
        socketServer.to(message.chatId)
            .emit(eventNames.server.MESSAGE, message);
    });

    socket.on(eventNames.client.GET_URL_META, async (url) => {
        const meta = await urlMetadata(url);
        socket.emit(eventNames.server.URL_META, {
            ...meta,
            url
        });
    });

    socket.on(eventNames.client.GET_WEATHER, async (city) => {
        const response = await getWeather(city);
        socket.emit(eventNames.server.WEATHER, { ...response, city });
    });
};

const trySendUserInfo = async (socket, userId) => {
    try {
        const user = await usersRepository.getUser(userId);
        socket.emit(eventNames.server.CURRENT_USER, user);
        // send more information
    } catch (e) {
        console.warn('Failed to send user info');
    }
};

export default async (server) => {
    const commonChat = new Chat(
        '6584f174-0ce1-43bd-88ac-026cfe879022',
        'Общий чат', [],
        'https://image.flaticon.com/icons/png/128/167/167742.png'
    );
    await chatsRepository.upsertChat(commonChat);

    const socketServer = new Server(server, {
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    socketServer.on('connection', async (socket) => {
        try {
            const userId = await userInfoProvider.getUserId(socket.handshake);
            await chatsRepository.joinChat(userId, commonChat.chatId);

            registerMessageHandlers(socketServer, socket, userId);

            await trySendUserInfo(socket, userId);
            // TODO: втащить нормальный логгер
            console.info('Socket connected. ID: ', socket.id); // eslint-disable-line no-console
        } catch (e) {
            console.error('Socket connection failed.', e.message); // eslint-disable-line no-console
            socket.disconnect(true);
        }
    });
};
