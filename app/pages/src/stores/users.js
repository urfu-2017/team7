import { observable, computed } from 'mobx';
import { onUser, searchUser, getPrivateChat } from '../../../sockets/client';
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
        if (!user) {
            this.searchUser(username);
        }

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
            this.usersById.set(user.userId, user);
            if (chatsStore.getPrivateChat(user.userId)) {
                getPrivateChat(user.userId);
            }
        });
    }
}

const userStore = new UsersStore();
export default userStore;
export { UsersStore };
