import { observable, computed } from 'mobx';
import { onUser, searchUser, getOrCreatePrivateChat } from '../../../sockets/client';
import chatsStore from './chats';


class UsersStore {
    @observable usersById = observable.map();

    @computed get allUsers() {
        return [...this.usersById.toJS().values()];
    }

    sentQueries = [];

    getUser(userId) {
        return this.usersById.get(userId);
    }

    getUserByName(username) {
        const user = this.allUsers.find(x => x.username === username);

        return user || null;
    }

    searchUser(query) {
        if (!this.sentQueries.find(x => query.includes(x))) {
            this.sentQueries.push(query);
            searchUser({ query });
        }
    }

    getUsername(userId) {
        if (this.usersById.has(userId)) {
            return this.getUser(userId).username;
        }

        return 'Чебурашка';
    }

    getAvatar(userId) {
        if (this.usersById.has(userId)) {
            return this.getUser(userId).avatarUrl;
        }

        return `/avatar/${userId}`;
    }

    constructor() {
        onUser((user) => {
            const existingUser = this.usersById.get(user.userId) || {};
            const hasChangedAvatar = existingUser.avatarUrl !== user.avatarUrl;
            this.usersById.set(user.userId, user);

            if (hasChangedAvatar && chatsStore.getPrivateChat(user.userId)) {
                getOrCreatePrivateChat(user.userId);
            }
        });
    }
}

const userStore = new UsersStore();
export default userStore;
export { UsersStore };
