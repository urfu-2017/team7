import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { onUrlMeta } from '../../../../sockets/client';

@inject('urlMetaStore')
@observer
class UrlMeta extends Component {
    componentDidMount() {
        const { url, urlMetaStore } = this.props;

        onUrlMeta(meta => urlMetaStore.metaByUrl.set(url, meta));

        urlMetaStore.fetchUrlMeta(url);
    }

    render() {
        const { url, urlMetaStore } = this.props;
        const meta = urlMetaStore.metaByUrl.get(url);
        if (!meta) {
            return <div>{ url }</div>;
        }

        const imageUrl = meta['og:image'] || meta.image;
        return (
            <div>
                <p>{ meta['og:title'] || meta.title }</p>
                { imageUrl ? <img src={imageUrl} alt="img" /> : ''}
                <p>{ meta['og:description'] || meta.description }</p>
            </div>
        );
    }
}

export default UrlMeta;
