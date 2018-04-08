import Server from 'socket.io';
import * as e from './eventNames';
import { getAllChatsForUser } from '../db/chats-repository';
import { getMessagesFromChat, createMessage } from '../db/messages-repository';

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
            const userChats = getAllChatsForUser(data.userId);
            socket.broadcast
                .to(socket.id)
                .emit(e.LIST_CHATS, userChats);

            userChats
                .map(x => x.groupId)
                .forEach(groupId => socket.join(groupId));
        });

        socket.on(e.GET_MESSAGES, (data) => {
            const messages = getMessagesFromChat(data.groupId);
            socket.broadcast
                .to(socket.id)
                .emit(e.LIST_MESSAGES, messages);
        });

        socket.on(e.NEW_MESSAGE, (data) => {
            createMessage(data);
            socket.broadcast
                .to(data.groupId)
                .emit(e.MESSAGE, data);
        });
    });
}

