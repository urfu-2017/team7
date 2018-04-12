import { observable, action, computed } from 'mobx';
import { getMessages, onChat, onChatsList } from '../../../sockets/client';

class ChatsStore {
    @observable activeChat = null;
    @observable allChats = [];

    @computed get activeChatName() {
        return this.activeChat
            ? this.activeChat.name
            : null;
    }

    @action setActiveChat(chat) {
        this.activeChat = chat;
        getMessages({ chatId: chat.chatId });
    }

    @action setAllChats(chats) {
        this.allChats.replace(chats);
        this.activeChat = null;
    }

    constructor() {
        onChat((chat) => {
            if (!this.allChats.find(x => x.chatId === chat.chatId)) {
                this.allChats.push(chat);
            }
        });

        onChatsList((chats) => {
            this.allChats.replace(chats);
            this.activeChat = this.allChats.find(x => this.activeChat.chatId === x.chatId);
        });
    }
}

const chatsStore = new ChatsStore();
export default chatsStore;
export { ChatsStore };
