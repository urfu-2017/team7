import { observable, computed, action } from 'mobx';
import mainStore from './main';

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

    getLastMessageTextFor(chatId) {
        if (!this.messagesByChatId.has(chatId)) {
            return '';
        }
        const messages = this.messagesByChatId.get(chatId);
        if (messages.length === 0) {
            return '';
        }
        return messages[messages.length - 1].content;
    }

    @computed get activeMessages() {
        return this.messagesByChatId.get(mainStore.activeChat.chatId) || [];
    }
}

export default new MessagesStore();
