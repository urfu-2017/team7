export default class MessagesRepository {
    constructor(hrudbClient) {
        this.hrudbClient = hrudbClient;
    }

    createMessage(message) {
        return this.hrudbClient.put(`Messages_${message.recipientChat}`, message);
    }

    getMessagesFromChat(chatId) {
        return this.hrudbClient.getAll(`Messages_${chatId}`);
    }
}
