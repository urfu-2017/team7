const dbClient = require('./hruDB-client');

class MessagesRepository {
    static createMessage(message) {
        return dbClient.putInStorage(`Messages_${message.recipientChat}`, message);
    }

    static getMessagesFromChat(chatId) {
        return dbClient.getAllFromStorage(`Messages_${chatId}`);
    }
}

module.exports = MessagesRepository;