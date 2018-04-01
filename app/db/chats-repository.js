'use strict';

export class ChatsRepository {
    constructor(hrudbClient, usersRepository) {
        this.hrudbClient = hrudbClient;
        this.usersRepository = usersRepository;
    }

    async getAllChatsForUser(userId) {
        const user = await this.usersRepository.getUser(userId);

        return await Promise.all(user.chats.map(chatId => hrudbClient.get(`Chats_${chatId}`)));
    }

    createChat(chat) {
        return this.hrudbClient.put(`Chats_${chat.id}`, chat);
    }
}
