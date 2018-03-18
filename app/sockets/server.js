'use strict';
const e = require('./eventNames');
function getUserChats(userId) {
    return [{ id: '123', name: 'Chatname', users:[] }];
}


function getMessages(groupId) {
    return [
        { id: '1', content: 'ololo', author:{} },
        { id: '2', content: 'kekeke', author:{} },
        { id: '3', content: 'azaza', author:{} }];
}

function saveMessage() {

}
exports.listen = function (server) {
    const io = require('socket.io')(server, {
        path: '/socket',
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    io.on('connection', socket => {
        socket.on(e.GET_CHATS, data => {
            let userChats = getUserChats(data.userId);
            socket.broadcast
                .to(socket.id)
                .emit(e.CHATS_LIST, userChats);

            userChats
                .map(x => x.name)
                .forEach(name => socket.join(name));
        });

        socket.on(e.GET_MESSAGES, data => {
            let messages = getMessages(data.groupId);
            socket.broadcast
                .to(socket.id)
                .emit(e.LIST_MESSAGES, messages);
        });

        socket.on(e.NEW_MESSAGE, data => {
            saveMessage(data);
            socket.broadcast
                .to(data.groupId)
                .emit(e.MESSAGE, data);
        })

    });

};

