import connect from 'socket.io-client';
import * as eventNames from './eventNames';

const socketOptions = {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
};
const socket = process.browser
    ? connect(socketOptions)
    : { emit: () => { }, on: () => { } };


export function sendMessage(message) {
    socket.emit(eventNames.client.NEW_MESSAGE, message);
}

export function getChats() {
    socket.emit(eventNames.client.GET_CHATS);
}

export function getUrlMeta(url) {
    socket.emit(eventNames.client.GET_URL_META, url);
}

/**
 * @callback onChatsListCallback
 * @param {Chat[]} chats
 */

/**
 * @param {onChatsListCallback} handler
 */
export function onChatsList(handler) {
    socket.on(eventNames.server.LIST_CHATS, handler);
}


/**
 * @param {object} payload
 * @param {string} payload.chatId
 */
export function getMessages(payload) {
    socket.emit(eventNames.client.GET_MESSAGES, payload);
}

export function onMessagesList(handler) {
    socket.on(eventNames.server.LIST_MESSAGES, handler);
}

export function onMessage(handler) {
    socket.on(eventNames.server.MESSAGE, handler);
}

/**
 * @param {object} payload
 * @param {string} payload.userId
 */
export function getUser(payload) {
    socket.emit(eventNames.client.GET_USER, payload);
}

export function onUser(handler) {
    socket.on(eventNames.server.USER, handler);
}

export function onError(handler) {
    socket.on('error', handler);
}

export function onUrlMeta(handler) {
    socket.on(eventNames.server.URL_META, handler);
}

export function getCurrentUser() {
    socket.emit(eventNames.client.GET_CURRENT_USER);
}

export function onCurrentUser(handler) {
    socket.on(eventNames.server.CURRENT_USER, handler);
}
