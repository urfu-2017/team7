import Promise from 'bluebird';
import * as userInfoProvider from './user-info-provider';


export const getAllConnectedSockets = socketServer => new Promise((resolve, reject) =>
    socketServer.sockets.clients((error, clients) => (error
        ? reject(error)
        : resolve(clients.map(id => socketServer.sockets.connected[id])))));

const toOtherUserInfo = async otherSocket => ({
    otherUserId: await userInfoProvider.getUserId(otherSocket.handshake),
    otherSocket
});

export const getUsersSockets = async (socketServer, userIds) => {
    const allSockets = await getAllConnectedSockets(socketServer);
    const usersSockets = await Promise.map(allSockets, toOtherUserInfo);

    return usersSockets
        .filter(({ otherUserId }) => userIds.includes(otherUserId))
        .map(({ otherSocket }) => otherSocket);
};
