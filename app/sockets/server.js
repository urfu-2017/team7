import Server from 'socket.io';
import uuidv4 from 'uuid/v4';
import { clientNames, serverNames } from './eventNames';
import * as usersRepository from '../db/users-repository';
import * as messagesRepository from '../db/messages-repository';
import * as chatsRepository from '../db/chats-repository';
import * as userInfoProvider from './user-info-provider';
import { Chat, Message } from '../db/datatypes';

function registerMessageHandlers(socketServer, socket, userId) {
    socket.on(clientNames.GET_CHATS, async () => {
        const userChats = await chatsRepository.getAllChatsForUser(userId);
        socket.emit(serverNames.LIST_CHATS, userChats);

        userChats
            .map(x => x.chatId)
            .forEach(chatId => socket.join(chatId));
    });

    socket.on(clientNames.GET_MESSAGES, async ({ chatId }) => {
        const messages = await messagesRepository.getMessagesFromChat(chatId);
        socket.emit(serverNames.LIST_MESSAGES, messages);
    });

    socket.on(clientNames.GET_USER, async (payload) => {
        const user = await usersRepository.getUser(payload.userId);
        socket.emit(serverNames.USER, user);
    });

    socket.on(clientNames.NEW_MESSAGE, async ({ chatId, text }) => {
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
            .emit(serverNames.MESSAGE, message);
    });
}

export default async function (server) {
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
            await usersRepository.joinChat(userId, commonChat.chatId);

            registerMessageHandlers(socketServer, socket, userId);
            console.info('Incoming socket connected.');
        } catch (e) {
            console.error('Incoming socket connection failed.', e);
            socket.disconnect(true);
        }
    });
}

