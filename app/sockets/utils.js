import Promise from 'bluebird';

// eslint-disable-next-line import/prefer-default-export
export const getAllConnectedSockets = socketServer => new Promise((resolve, reject) =>
    socketServer.sockets.clients((error, clients) => (error
        ? reject(error)
        : resolve(clients.map(id => socketServer.sockets.connected[id])))));
