const socket = require('socket.io-client')('/socket');
const e = require('./eventNames');

exports.sendMessage = (message) => {
    socket.emit(e.MESSAGE, message);
};

exports.getGroups = (user) => {
    socket.emit(e.GET_CHATS, user);
};

exports.onChatsList = (handler) => {
    socket.on(e.CHATS_LIST, handler);
};

exports.onMessage = (handler) => {
    socket.on(e.MESSAGE, handler);
};
