const e = require('./eventNames');
const socketio = require('socket.io');

// TODO: что-то сделать со сборкой зависимостей
// Возможно создавать инстанс класса прямо в файле модуля
const HrudbClient = require('../db/hrudb-client');
const UsersRepository = require('../db/users-repository');
const MessagesRepository = require('../db/messages-repository');
const ChatsRepository = require('../db/chats-repository');


const hrudbClient = new HrudbClient('');
const usersRepository = new UsersRepository(hrudbClient);
const chatsRepository = new ChatsRepository(hrudbClient, usersRepository);
const messagesRepository = new MessagesRepository(hrudbClient);


exports.listen = (server) => {
    const io = socketio(server, {
        path: '/socket',
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    io.on('connection', (socket) => {
        socket.on(e.GET_CHATS, (data) => {
            const userChats = chatsRepository.getAllChatsForUser(data.userId);
            socket.broadcast
                .to(socket.id)
                .emit(e.CHATS_LIST, userChats);

            userChats
                .map(x => x.name)
                .forEach(name => socket.join(name));
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
};

