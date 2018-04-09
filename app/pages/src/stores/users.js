import { observable } from 'mobx';

class UsersStore {
    @observable usersById = observable.map();

    getUsername(userId) {
        if (this.usersById.has(userId)) {
            return this.usersById.get(userId).username;
        }
        return null;
    }
}

const userStore = new UsersStore();
export default userStore;
export { UsersStore };
