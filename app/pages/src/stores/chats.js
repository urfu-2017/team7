import { observable, action, computed } from 'mobx';
import currentUserStore from './current-user';
import { getMessages, onChat, getChatByInviteWord, getPrivateChat, leaveChat, onUserLeavedChat } from '../../../sockets/client';

class ChatsStore {
    @observable activeChatId = null;
    @observable chatsById = observable.map();

    @computed get activeChat() {
        return this.chatsById.get(this.activeChatId) || null;
    }

    @computed get me() {
        return currentUserStore.user;
    }

    getChatByInviteWord(inviteWord) {
        const chat = this.allChats.find(x => !x.isPrivate && x.inviteWord === inviteWord);
        if (!chat) {
            getChatByInviteWord(inviteWord);
        }

        return chat || null;
    }

    getPrivateChat(userId) {
        const isSelfChat = currentUserStore.userId === userId;
        const chat = isSelfChat ?
            this.allChats.find(x => x.isPrivate && x.userIds.length === 1) :
            this.allChats.find(x => x.isPrivate && x.userIds.includes(userId));
        if (!chat) {
            getPrivateChat(userId);
        }

        return chat || null;
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

    @action leaveChat(userId, chatId) {
        leaveChat({ userId, chatId });
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

        onUserLeavedChat(({ userId, chatId }) => {
            console.log(userId, chatId, this.me.userId);
            if (userId === this.me.userId) {
                this.chatsById.delete(chatId);
            }
        });
    }

    @computed get allChats() {
        return [...this.chatsById.toJS().values()];
    }
}

const chatsStore = new ChatsStore();
export default chatsStore;
export { ChatsStore };
