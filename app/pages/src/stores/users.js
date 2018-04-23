import { observable, computed } from 'mobx';
import { onUser, searchUser } from '../../../sockets/client';

class UsersStore {
    @observable usersById = observable.map();

    @computed get allUsers() {
        return [...this.usersById.toJS().values()];
    }

    sentQueries = [];

    getUser(userId) {
        return this.usersById.get(userId);
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
        });
    }
}

const userStore = new UsersStore();
export default userStore;
export { UsersStore };
