import { observable, action } from 'mobx';
import { getUrlMeta } from '../../../sockets/client';


class UrlMetaStore {
    @observable meta = observable.map();

    @action
    /* eslint-disable-next-line class-methods-use-this */
    fetchUrlMeta(url) {
        getUrlMeta(url);
    }
}

export default new UrlMetaStore();
