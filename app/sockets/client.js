import connect from 'socket.io-client';
import * as eventNames from './event-names';

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

export const getPrivateChat = (userId) => {
    socket.emit(eventNames.client.GET_PRIVATE_CHAT, { userId });
};

export const getChatByInviteWord = (inviteWord) => {
    socket.emit(eventNames.client.INVITE_WORD, { inviteWord });
};

export const sendMessage = (message) => {
    socket.emit(eventNames.client.NEW_MESSAGE, message);
};

export const createChat = (chat) => {
    socket.emit(eventNames.client.CREATE_CHAT, chat);
};

export const getChats = () => {
    socket.emit(eventNames.client.GET_CHATS);
};

export const getUrlMeta = (url) => {
    socket.emit(eventNames.client.GET_URL_META, url);
};

export const getMessages = (payload) => {
    socket.emit(eventNames.client.GET_CHAT_INFO, payload);
};

export const onMessagesList = (handler) => {
    socket.on(eventNames.server.LIST_MESSAGES, handler);
};

export const onMessage = (handler) => {
    socket.on(eventNames.server.MESSAGE, handler);
};

export const onMessageSent = (handler) => {
    socket.on(eventNames.server.MESSAGE_SENT, handler);
};

export const onMessageReceived = (handler) => {
    socket.on(eventNames.server.MESSAGE_RECEIVED, handler);
};

export const onMessageRevoked = (handler) => {
    socket.on(eventNames.server.MESSAGE_REVOKED, handler);
};

export const onChat = (handler) => {
    socket.on(eventNames.server.CHAT, handler);
};

export const getUser = (payload) => {
    socket.emit(eventNames.client.GET_USER, payload);
};

export const searchUser = (payload) => {
    socket.emit(eventNames.client.SEARCH_USER, payload);
};

export const onUser = (handler) => {
    socket.on(eventNames.server.USER, handler);
};

export const onError = (handler) => {
    socket.on('error', handler);
};

export const onUrlMeta = (handler) => {
    socket.on(eventNames.server.URL_META, handler);
};

export const getCurrentUser = () => {
    socket.emit(eventNames.client.GET_CURRENT_USER);
};

export const changeAvatarUrl = (avatarUrl) => {
    socket.emit(eventNames.client.CHANGE_AVATAR_URL, avatarUrl);
};

export const onCurrentUser = (handler) => {
    socket.on(eventNames.server.CURRENT_USER, handler);
};

export const getWeather = (city) => {
    socket.emit(eventNames.client.GET_WEATHER, city);
};

export const onWeather = (handler) => {
    socket.on(eventNames.server.WEATHER, handler);
};

export const leaveChat = (payload) => {
    socket.emit(eventNames.client.LEAVE_CHAT, payload);
};

export const onUserLeavedChat = (handler) => {
    socket.on(eventNames.server.USER_LEAVED_CHAT, handler);
};
