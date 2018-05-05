import Promise from 'bluebird';
import _ from 'lodash';
import { getOwlUrl } from '../utils/owl-provider';
import { chatsRepo } from '../db';
import * as eventNames from './event-names';
import { getUsersSockets } from './utils';


const updateDb = async (chat, userIds) => Promise.map(
    userIds,
    userId => chatsRepo.joinChat(userId, chat.chatId),
    { concurrency: 5 }
);


export const createChat = async (socketServer, { name, currentUserId, userIds }) => {
    const chat = await chatsRepo.createChat(name, getOwlUrl());
    const newIds = _.uniq([...userIds, currentUserId]);
    const newChat = { ...chat, userIds: newIds };
    const sockets = await getUsersSockets(socketServer, newIds);
    sockets.forEach((socket) => {
        socket.emit(eventNames.server.CHAT, newChat);
        socket.join(chat.chatId);
    });
    await updateDb(chat, newIds);
};

export const createPrivateChat = async (socketServer, socket, { currentUserId, userId }) => {
    const chatId = await chatsRepo.getOrCreatePrivateChatId(currentUserId, userId);
    socket.emit(eventNames.server.CHAT, await chatsRepo.getChatForUser(currentUserId, chatId));
    socket.join(chatId);
    const [hisSocket] = await getUsersSockets(socketServer, [userId]);
    if (hisSocket) {
        hisSocket.emit(eventNames.server.CHAT, await chatsRepo.getChatForUser(userId, chatId));
        hisSocket.join(chatId);
    }
};
