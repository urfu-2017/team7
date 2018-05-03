import Promise from 'bluebird';
import { getOwlUrl } from '../utils/owl-provider';
import { chatsRepo } from '../db';
import * as userInfoProvider from './user-info-provider';
import * as eventNames from './event-names';
import { getAllConnectedSockets } from './utils';

const updateDb = async (chat, userIds) => Promise.map(
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
    const newIds = userIds.concat([currentUserId]);

    await Promise.all(
        updateDb(chat, newIds),
        connectUsers(sockets, chat, newIds)
    );
};
