import { observable, action } from 'mobx';
import { onMessage, onMessagesList } from '../../../sockets/client';

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

    @action setAllMessages(chatId, messages) {
        this.messagesByChatId.set(chatId, messages);
    }

    hasMessages(chatId) {
        const messages = this.messagesByChatId.get(chatId);

        return messages && messages.length;
    }

    getLastMessageTimestamp(chatId) {
        if (!this.messagesByChatId.has(chatId)) {
            return null;
        }

        const messages = this.messagesByChatId.get(chatId);

        return messages.length ? messages[messages.length - 1].timestamp : null;
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

    getChatMessagesOrNull(chatId) {
        return this.messagesByChatId.get(chatId);
    }

    constructor() {
        onMessagesList(({ messages, chatId }) => {
            this.setAllMessages(chatId, messages);
        });

        onMessage((message) => {
            this.addMessage(message);
        });
    }
}

const messagesStore = new MessagesStore();
export default messagesStore;
export { MessagesStore };
