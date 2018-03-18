const dbClient = require('./hruDB-client');
const usersRepository = require('./users-repository');

class ChatsRepository {
    static getAllChatsForUser(userId) {
        return usersRepository.getUser(userId)
            .then(user => Promise.all(
                user.chats.map(chatId => dbClient.getLast(`Chats_${chatId}`))
            ));
    }

    static createChat(chat) {
        return dbClient.putInStorage(`Chats_${chat.id}`, chat);
    }
}

module.exports = ChatsRepository;