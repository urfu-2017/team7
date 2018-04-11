import { observable } from 'mobx';
import { onCurrentUser } from '../../../sockets/client';

class CurrentUserStore {
    @observable user;

    constructor() {
        onCurrentUser((user) => {
            this.user = user;
        });
    }
}

export default new CurrentUserStore();
