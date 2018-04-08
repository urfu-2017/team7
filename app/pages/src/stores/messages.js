import { observable, action } from 'mobx';

class MessagesStore {
    @observable messagesByChatId = observable.map();

    @action addMessage(message) {
        const { chatId } = message;
        if (!this.messagesByChatId.has(chatId)) {
            this.messagesByChatId.set(chatId, []);
        }
        const messages = this.messagesByChatId.get(chatId);
        if (!messages.some(x => x.messageId === message.messageId)) {
            messages.push(message);
        }
    }

    getLastMessageText(chatId) {
        if (!this.messagesByChatId.has(chatId)) {
            return '';
        }
        const messages = this.messagesByChatId.get(chatId);
        if (messages.length === 0) {
            return '';
        }
        return messages[messages.length - 1].content;
    }

    getChatMessages(chatId) {
        return this.messagesByChatId.get(chatId) || [];
    }
}

const messagesStore = new MessagesStore();
export default messagesStore;
export { MessagesStore };
