import { observable, computed, action } from 'mobx';
import { onCurrentUser, changeAvatarUrl } from '../../../sockets/client';

class CurrentUserStore {
    @observable user;

    @computed
    get avatarUrl() {
        return this.user
            ? this.user.avatarUrl
            : null;
    }

    @action
    changeAvatarUrl(url) {
        changeAvatarUrl(url);
    }

    constructor() {
        onCurrentUser((user) => {
            this.user = user;
        });
    }
}

export default new CurrentUserStore();
