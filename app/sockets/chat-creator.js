import Promise from 'bluebird';
import { getOwlUrl } from '../utils/owl-provider';
import { chatsRepo, usersRepo } from '../db';
import * as eventNames from './event-names';
import { getUsersSockets } from './utils';


const updateChat = async (chat, userIds) =>
    Promise.map(
        userIds,
        userId => chatsRepo.joinChat(userId, chat.chatId),
        { concurrency: 5 }
    );


export const createChat = async (socketServer, { name, currentUserId, userIds }) => {
    const chat = await chatsRepo.createChat(name, getOwlUrl());
    const newIds = userIds.concat([currentUserId]);
    await updateChat(chat, newIds);
    const sockets = await getUsersSockets(socketServer, newIds);
    sockets.forEach((socket) => {
        socket.join(chat.chatId);
        socket.emit(eventNames.server.CHAT, { ...chat, userIds: newIds });
    });

    await Promise.all(newIds.map(async (userId) => {
        const user = await usersRepo.getUser(userId);
        socketServer.to(chat.chatId).emit(eventNames.server.USER, user);
    }));
};

export const createPrivateChat = async (socketServer, { currentUserId, userId }) => {
    const chatId = await chatsRepo.getOrCreatePrivateChatId(currentUserId, userId);
    const [mySocket] = await getUsersSockets(socketServer, [currentUserId]);
    mySocket.join(chatId);
    mySocket.emit(eventNames.server.CHAT, await chatsRepo.getChatForUser(currentUserId, chatId));
    const [hisSocket] = await getUsersSockets(socketServer, [userId]);
    hisSocket.join(chatId);
    hisSocket.emit(eventNames.server.CHAT, await chatsRepo.getChatForUser(userId, chatId));
};
