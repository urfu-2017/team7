import connect from 'socket.io-client';
import * as e from './eventNames';

const socket = connect('/socket');

exports.sendMessage = (message) => {
    socket.emit(e.NEW_MESSAGE, message);
};

exports.getGroups = (user) => {
    socket.emit(e.GET_CHATS, user);
};

exports.onChatsList = (handler) => {
    socket.on(e.LIST_CHATS, handler);
};

exports.onMessage = (handler) => {
    socket.on(e.MESSAGE, handler);
};
