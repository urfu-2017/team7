import Server from 'socket.io';
import * as e from './eventNames';

import HrudbClient from '../db/hrudb-client';
import UsersRepository from '../db/users-repository';
import MessagesRepository from '../db/messages-repository';
import ChatsRepository from '../db/chats-repository';


// TODO: что-то сделать со сборкой зависимостей
// Возможно создавать инстанс класса прямо в файле модуля
const hrudbClient = new HrudbClient('');
const usersRepository = new UsersRepository(hrudbClient);
const chatsRepository = new ChatsRepository(hrudbClient, usersRepository);
const messagesRepository = new MessagesRepository(hrudbClient);


export default async function (server) {
    const socketServer = Server(server, {
        path: '/socket',
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    socketServer.on('connection', (socket) => {
        socket.on(e.GET_CHATS, (data) => {
            // TODO: доставать data.userId из куки. (socket.request)
            const userChats = chatsRepository.getAllChatsForUser(data.userId);
            socket.broadcast
                .to(socket.id)
                .emit(e.LIST_CHATS, userChats);

            userChats
                .map(x => x.groupId)
                .forEach(groupId => socket.join(groupId));
        });

        socket.on(e.GET_MESSAGES, (data) => {
            const messages = messagesRepository.getMessagesFromChat(data.groupId);
            socket.broadcast
                .to(socket.id)
                .emit(e.LIST_MESSAGES, messages);
        });

        socket.on(e.NEW_MESSAGE, (data) => {
            messagesRepository.createMessage(data);
            socket.broadcast
                .to(data.groupId)
                .emit(e.MESSAGE, data);
        });
    });
}

