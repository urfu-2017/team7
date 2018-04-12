import { observable } from 'mobx';

class UsersStore {
    @observable usersById = observable.map();

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
}

const userStore = new UsersStore();
export default userStore;
export { UsersStore };
