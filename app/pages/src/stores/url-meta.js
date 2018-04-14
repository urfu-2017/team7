import { observable } from 'mobx';
import { getUrlMeta, onUrlMeta } from '../../../sockets/client';


class UrlMetaStore {
    @observable metaByUrl = observable.map();

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
