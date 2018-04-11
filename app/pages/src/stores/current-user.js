import { observable, computed } from 'mobx';
import { onCurrentUser } from '../../../sockets/client';

class CurrentUserStore {
    @observable user;

    @computed
    get avatarUrl() {
        return this.user
            ? this.user.avatarUrl
            : 'http://identicon.net/img/identicon.png'
    }

    constructor() {
        onCurrentUser((user) => {
            this.user = user;
        });
    }
}

export default new CurrentUserStore();
