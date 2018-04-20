import { observable, computed } from 'mobx';
import { getUser, onUser, searchUser } from '../../../sockets/client';

class UsersStore {
    @observable usersById = observable.map();

    @computed get allUsers() {
        return [...this.usersById.toJS().values()];
    }

    sentQueries = [];

    getUser(userId) {
        return this.usersById.get(userId);
    }

    // eslint-disable-next-line class-methods-use-this
    searchUser(query) {
        if (!this.sentQueries.find(x => query.includes(x))) {
            this.sentQueries.push(query);
            searchUser({ query });
        }
    }

    fetchUser(userId) {
        if (!this.usersById.has(userId)) {
            getUser({ userId });
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
        });
    }
}

const userStore = new UsersStore();
export default userStore;
export { UsersStore };
