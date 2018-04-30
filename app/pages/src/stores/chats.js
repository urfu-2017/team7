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

        return chat || null;
    }

    getPrivateChat(userId) {
        const privateChats = this.allChats.filter(x => x.isPrivate);
        const selfChat = privateChats.find(x => x.userIds[0] === userId && x.userIds.length === 1);
        const chat = privateChats.find(x => x.userIds.includes(userId));
        if (!selfChat && !chat) {
            getPrivateChat(userId);
        }

        return selfChat || chat || null;
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
        if (chatId && this.activeChatId !== chatId) {
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
