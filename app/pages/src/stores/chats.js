import { observable, action, computed } from 'mobx';
import { getMessages, onChat, getChatByInviteWord, getPrivateChat } from '../../../sockets/client';

class ChatsStore {
    @observable activeChatId = null;
    @observable chatsById = observable.map();

    @computed get activeChat() {
        return this.chatsById.get(this.activeChatId) || null;
    }

    getChatByInviteWord(inviteWord) {
        const chat = this.allChats.find(x => !x.isPrivate && x.inviteWord === inviteWord);
        if (!chat) {
            getChatByInviteWord(inviteWord);
        }

        return chat;
    }

    getPrivateChat(userId) {
        const chat = this.allChats.find(x => x.isPrivate && x.userIds.includes(userId));
        if (!chat) {
            getPrivateChat(userId);
        }

        return chat;
    }

    @computed get activeChatName() {
        return this.activeChat
            ? this.activeChat.name
            : null;
    }

    @computed get activeChatInviteLink() {
        return this.activeChat
            ? this.activeChat.inviteWord
            : null;
    }

    @action selectChat(chatId) {
        if (this.activeChatId !== chatId) {
            this.activeChatId = chatId;
            getMessages({ chatId });
        }
    }

    @action setAllChats(chats) {
        this.chatsById = observable.map(chats.map(chat => [chat.chatId, chat]));
        this.activeChatId = null;
    }

    @action setScrollHeight(height, chatId) {
        const chat = this.chatsById.get(chatId);
        if (chat) {
            chat.scrollHeight = height;
        }
    }

    getScrollHeight(chatId) {
        const chat = this.chatsById.get(chatId);

        return chat ? chat.scrollHeight : null;
    }

    constructor() {
        onChat((chat) => {
            this.chatsById.set(chat.chatId, chat);
        });
    }

    @computed get allChats() {
        return [...this.chatsById.toJS().values()];
    }
}

const chatsStore = new ChatsStore();
export default chatsStore;
export { ChatsStore };
