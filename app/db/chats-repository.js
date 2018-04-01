export default class ChatsRepository {
    constructor(hrudbClient, usersRepository) {
        this.hrudbClient = hrudbClient;
        this.usersRepository = usersRepository;
    }

    async getAllChatsForUser(userId) {
        const user = await this.usersRepository.getUser(userId);
        const chats = await Promise.all(user.chats.map(chatId => this.hrudbClient.get(`Chats_${chatId}`)));

        return chats;
    }

    createChat(chat) {
        return this.hrudbClient.put(`Chats_${chat.id}`, chat);
    }
}
