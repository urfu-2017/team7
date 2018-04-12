import { observable, action } from 'mobx';
import { onChat, onChatsList } from '../../../sockets/client';

class ChatsStore {
    @observable activeChat = null;
    @observable allChats = [];

    @action setActiveChat(chat) {
        this.activeChat = chat;
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
