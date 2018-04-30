import Server from 'socket.io';
import { client } from './event-names';
import * as userInfoProvider from './user-info-provider';
import getHandlers from './handlers';

import getLogger from '../utils/logger';

export const logger = getLogger('socket-server');

const registerMessageHandlers = (socketServer, socket, currentUserId) => {
    const handlers = getHandlers(socketServer, socket, currentUserId);

    const on = handlers.asyncSocketHandler();

    on(client.GET_CHATS, handlers.sendUserChats);

    on(client.GET_CHAT_INFO, handlers.sendChatInfo);

    on(client.GET_USER, handlers.sendUser);

    on(client.SEARCH_USER, handlers.searchUser);

    on(client.NEW_MESSAGE, handlers.newMessage);

    on(client.GET_URL_META, handlers.getUrlMeta);

    on(client.CREATE_CHAT, handlers.createChat);

    on(client.GET_WEATHER, handlers.getWeather);

    on(client.CHANGE_AVATAR_URL, handlers.changeAvatarUrl);

    on(client.GET_PRIVATE_CHAT, handlers.getPrivateChat);

    on(client.INVITE_WORD, handlers.getChatByInviteWord);

    return handlers;
};

const startProactiveLoading = (methods) => {
    methods.forEach(method =>
        method().catch((err) => {
            logger.warn(`Proactive method '${method.name}' failed.`, err);
        }));
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

            startProactiveLoading([
                handlers.sendCurrentUser,
                handlers.sendUserChats]);


            logger.trace(`Socket connected. socket.id=${socket.id}, userId=${userId}`);
        } catch (e) {
            logger.error(e, 'Socket connection failed.');
            socket.disconnect(true);
        }
    });
};
