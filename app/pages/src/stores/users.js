import { observable, computed } from 'mobx';
import { getUser, onUser, searchUser } from '../../../sockets/client';

class UsersStore {
    @observable usersById = observable.map();

    @computed get allUsers() {
        return [...this.usersById.toJS().values()];
    }

    sentQueries = [];

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
            return this.usersById.get(userId).username;
        }
        return 'Чебурашка';
    }

    getAvatar(userId) {
        if (this.usersById.has(userId)) {
            return this.usersById.get(userId).avatarUrl;
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
