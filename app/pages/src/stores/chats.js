import { observable, action, computed } from 'mobx';
import { getMessages, onChat, onChatsList } from '../../../sockets/client';

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

    @action setAllChats(chats) {
        this.chatsById = observable.map(chats.map(chat => [chat.chatId, chat]));
        this.activeChat = null;
    }

    @action setScrollHeight(height, chatId) {
        const chat = this.chatsById.get(chatId);
        if (chat) {
            chat.scrollHeight = height;
        }
    }

    @action getScrollHeight(chatId) {
        const chat = this.chatsById.get(chatId);
        return chat ? chat.scrollHeight : null;
    }

    constructor() {
        onChat((chat) => {
            this.chatsById.set(chat.chatId, chat);
        });

        onChatsList((chats) => {
            this.chatsById = observable.map(chats.map(chat => [chat.chatId, chat]));
            if (this.activeChat) {
                this.activeChat = this.chatsById.get(this.activeChat.chatId);
            }
        });
    }
}

const chatsStore = new ChatsStore();
export default chatsStore;
export { ChatsStore };
