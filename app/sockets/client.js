import connect from 'socket.io-client';
import * as e from './eventNames';

const socket = connect('/socket');

const socket = client('/socket');

export function sendMessage(message) {
    socket.emit(e.NEW_MESSAGE, message);
}

export function getChats() {
    socket.emit(e.GET_CHATS);
}

/**
 * @callback onChatsListCallback
 * @param {Chat[]} chats
 */

/**
 * @param {onChatsListCallback} handler
 */
export function onChatsList(handler) {
    socket.on(e.LIST_CHATS, handler);
}


export function onMessage(handler) {
    socket.on(e.MESSAGE, handler);
}

