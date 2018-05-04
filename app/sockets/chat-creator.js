import Promise from 'bluebird';
import { getOwlUrl } from '../utils/owl-provider';
import { chatsRepo, usersRepo } from '../db';
import * as userInfoProvider from './user-info-provider';
import * as eventNames from './event-names';
import { getAllConnectedSockets } from './utils';

const updateChat = async (chat, userIds) =>
    Promise.map(
        userIds,
        userId => chatsRepo.joinChat(userId, chat.chatId),
        { concurrency: 5 }
    );

const toOtherUserInfo = async otherSocket => ({
    otherUserId: await userInfoProvider.getUserId(otherSocket.handshake),
    otherSocket
});

const connectUsers = async (sockets, chat, userIds) =>
    Promise.map(sockets, toOtherUserInfo)
        .filter(({ otherUserId }) => userIds.includes(otherUserId))
        .each(({ otherSocket }) => {
            otherSocket.join(chat.chatId);
            otherSocket.emit(eventNames.server.CHAT, chat);
        });

// eslint-disable-next-line import/prefer-default-export
export const createChat = async (socketServer, { name, currentUserId, userIds }) => {
    const sockets = await getAllConnectedSockets(socketServer);
    const chat = await chatsRepo.createChat(name, getOwlUrl());
    const newIds = [...userIds, currentUserId];

    await updateChat(chat, newIds);
    await connectUsers(sockets, { ...chat, userIds: newIds }, newIds);

    await Promise.all(newIds.map(async (userId) => {
        const user = await usersRepo.getUser(userId);
        socketServer.to(chat.chatId).emit(eventNames.server.USER, user);
    }));
};
