import { observable } from 'mobx';
import { getUrlMeta, onUrlMeta } from '../../../sockets/client';


class UrlMetaStore {
    @observable metaByUrl = observable.map();

    // eslint-disable-next-line class-methods-use-this
    fetchUrlMeta(url) {
        getUrlMeta(url);
    }

    constructor() {
        onUrlMeta(meta => this.metaByUrl.set(meta.url, meta));
    }
}

export default new UrlMetaStore();
