import { observable } from 'mobx';
import { onCurrentUser } from '../../../sockets/client';

class CurrentUserStore {
    @observable user;

    constructor() {
        console.log('ctor called');
        onCurrentUser((user) => {
            console.log('got user', user);
            this.user = user;
        });
    }
}

export default new CurrentUserStore();
