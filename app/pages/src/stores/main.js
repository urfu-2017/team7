import { observable } from 'mobx';

class MainStore {
    @observable activeChat = null;
}

export default new MainStore();
