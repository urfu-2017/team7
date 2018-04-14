import { observable, action, computed } from 'mobx';
import { getMessages, onChat } from '../../../sockets/client';

class ChatsStore {
    @observable activeChat = null;
    @observable chatsById = observable.map();

    @computed get activeChatName() {
        return this.activeChat
            ? this.activeChat.name
            : null;
    }

    @action selectChat(chat) {
        this.activeChat = chat;
        getMessages({ chatId: chat.chatId });
    }

    constructor() {
        onChat((chat) => {
            this.chatsById.set(chat.chatId, chat);
        });
    }
}

const chatsStore = new ChatsStore();
export default chatsStore;
export { ChatsStore };
