module.exports.MessagesRepository = class MessagesRepository {
    static createMessage(message) {
        return dbClient.putInStorage(`Messages_${message.recepientChat}`, message);
    }

    static getMessagesFromChat(chatId) {
        return dbClient.getAllFromStorage(`Messages_${chatId}`);
    }
}