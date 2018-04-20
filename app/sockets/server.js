import Server from 'socket.io';
import * as eventNames from './event-names';
import * as userInfoProvider from './user-info-provider';
import getLogger from '../utils/logger';
import getHandlers from './handlers';

const logger = getLogger('socket-server');

const registerMessageHandlers = (socketServer, socket, currentUserId) => {
    const handlers = getHandlers(socketServer, socket, currentUserId);

    const on = handlers.asyncSocketHandler();

    on(eventNames.client.GET_CHATS, handlers.trySendUserChats);

    on(eventNames.client.GET_MESSAGES, handlers.sendChatInfo);

    on(eventNames.client.GET_USER, handlers.sendUser);

    on(eventNames.client.SEARCH_USER, handlers.searchUser);

    on(eventNames.client.NEW_MESSAGE, handlers.newMesage);

    on(eventNames.client.GET_URL_META, handlers.getUrlMeta);

    on(eventNames.client.CREATE_CHAT, handlers.createChat);

    on(eventNames.client.GET_WEATHER, handlers.getWeather);

    on(eventNames.client.CHANGE_AVATAR_URL, handlers.changeAvatarUrl);

    return handlers;
};

export default async (server) => {
    const socketServer = new Server(server, {
        serveClient: false,
        pingInterval: 10000,
        pingTimeout: 5000,
        cookie: false
    });

    socketServer.on('connection', async (socket) => {
        try {
            const userId = await userInfoProvider.getUserId(socket.handshake);
            const handlers = registerMessageHandlers(socketServer, socket, userId);

            handlers.trySendUserInfo();
            handlers.trySendUserChats();

            logger.trace(`Socket connected. socket.id=${socket.id}, userId=${userId}`);
        } catch (e) {
            logger.error(e, 'Socket connection failed.');
            socket.disconnect(true);
        }
    });
};
