import { observable } from 'mobx';
import { onUrlMeta } from '../../../sockets/client';


class UrlMetaStore {
    @observable metaByUrl = observable.map();


    constructor() {
        onUrlMeta(meta => this.metaByUrl.set(meta.url, meta));
    }
}

export default new UrlMetaStore();
