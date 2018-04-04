import Server from 'socket.io';
import * as e from './eventNames';
import HrudbClient from '../db/hrudb-client';
import UsersRepository from '../db/users-repository';
import MessagesRepository from '../db/messages-repository';
import ChatsRepository from '../db/chats-repository';
import User from '../db/datatypes';


// TODO: что-то сделать со сборкой зависимостей
// Возможно создавать инстанс класса прямо в файле модуля
const hrudbClient = new HrudbClient('8f92d8b92cffc5d2c4ddb2af9959dfa9391b6f43');
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

    io.on('connection', (socket) => {
        socket.on(e.GET_CHATS, () => {
            const userId = uuidv4();
            const user = new User(userId, uuidv4(), null, []);
            usersRepository.saveUser(user);

            const userChats = chatsRepository.getAllChatsForUser(userId);
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

