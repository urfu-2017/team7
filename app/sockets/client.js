import connect from 'socket.io-client';
import { clientNames, serverNames } from './eventNames';

const isBrowser = typeof window !== 'undefined';
const socketOptions = {
    transports: ['websocket'],
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: Infinity
};
const socket = isBrowser
    ? connect(socketOptions)
    : { emit: () => { }, on: () => { } };


export function sendMessage(message) {
    socket.emit(clientNames.NEW_MESSAGE, message);
}

export function getChats() {
    socket.emit(clientNames.GET_CHATS);
}

/**
 * @callback onChatsListCallback
 * @param {Chat[]} chats
 */

/**
 * @param {onChatsListCallback} handler
 */
export function onChatsList(handler) {
    socket.on(serverNames.LIST_CHATS, handler);
}


/**
 * @param {object} payload
 * @param {string} payload.chatId
 */
export function getMessages(payload) {
    socket.emit(clientNames.GET_MESSAGES, payload);
}

export function onMessagesList(handler) {
    socket.on(serverNames.LIST_MESSAGES, handler);
}

export function onMessage(handler) {
    socket.on(serverNames.MESSAGE, handler);
}

/**
 * @param {object} payload
 * @param {string} payload.userId
 */
export function getUser(payload) {
    socket.emit(clientNames.GET_USER, payload);
}

export function onUser(handler) {
    socket.on(serverNames.USER, handler);
}

export function onError(handler) {
    socket.on('error', handler);
}

