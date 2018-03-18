const dbClient = require('./hruDBClient');

module.exports.ChatsRepository = class ChatsRepository {
    static getAllChatsForUser(userId) {
        let user = getUser(userId);

        return Promise.all(user.chats.map(chatId => dbClient.getAllFromStorage(`Chats_${chatId}`)));
    }

    static createChat(chat) {
        return dbClient.putInStorage(`Chats_${chat.id}`, chat);
    }
}