import { observable, action } from 'mobx';
import { onMessage, onMessagesList, onMessageSent, onMessageReceived, onMessageRevoked } from '../../../sockets/client';

class MessagesStore {
    static messageStatuses = {
        SENT: 'SENT',
        RECEIVED: 'RECEIVED',
        REVOKED: 'REVOKED'
    }

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

    @action updateMessage(message) {
        const { chatId } = message;
        if (!this.messagesByChatId.has(chatId)) {
            return;
        }
        const messages = this.messagesByChatId.get(chatId);
        const messageIndex = messages.findIndex(m => m.messageId === message.messageId);
        if (messageIndex !== -1) {
            messages[messageIndex] = message;
        } else {
            messages.push(message);
        }
    }

    @action setAllMessages(chatId, messages) {
        this.messagesByChatId.set(chatId, messages);
    }

    hasMessages(chatId) {
        const messages = this.messagesByChatId.get(chatId);

        return messages && messages.length > 0;
    }

    getLastMessage(chatId) {
        const messages = this.messagesByChatId.get(chatId);

        return messages ? messages[messages.length - 1] : null;
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

    setMessageStatus(message, status) {
        this.updateMessage({ ...message, status });
    }

    constructor() {
        onMessagesList(({ messages, chatId }) => {
            this.setAllMessages(chatId, messages);
        });

        onMessage((message) => {
            this.addMessage(message);
        });

        onMessageSent((message) => {
            this.setMessageStatus(message, MessagesStore.messageStatuses.SENT);
        });

        onMessageReceived((message) => {
            this.setMessageStatus(message, MessagesStore.messageStatuses.RECEIVED);
        });

        onMessageRevoked((message) => {
            this.setMessageStatus(message, MessagesStore.messageStatuses.REVOKED);
        });
    }
}

const messagesStore = new MessagesStore();
export default messagesStore;
export { MessagesStore };
