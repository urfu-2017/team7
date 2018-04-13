import { observable } from 'mobx';
import { getUrlMeta, onUrlMeta } from '../../../sockets/client';


class UrlMetaStore {
    @observable metaByUrl = observable.map();

    // eslint-disable-next-line class-methods-use-this
    fetchUrlMeta(url) {
        getUrlMeta(url);
    }

    constructor() {
        onUrlMeta(({ url, meta }) => {
            this.metaByUrl.set(url, meta);
        });
    }
}

export default new UrlMetaStore();
