import { observable, action } from 'mobx';

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
}

const chatsStore = new ChatsStore();
export default chatsStore;
export { ChatsStore };
