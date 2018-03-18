const socket = require('socket.io-client')('/socket');
const e = require('./eventNames');

exports.sendMessage = function(message)
{
    socket.emit(e.MESSAGE, message)
};

exports.getGroups = function(user)
{
    socket.emit(e.GET_CHATS, user)
};

exports.onChatsList = function(handler){
    socket.on(e.CHATS_LIST, handler);
};

exports.onMessage = function(handler){
    socket.on(e.MESSAGE, handler);
};
