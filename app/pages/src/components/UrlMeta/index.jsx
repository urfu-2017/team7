import React from 'react';
import { Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import urlRegex from './url-regex';
import css from './meta.css';

@inject('urlMetaStore')
@observer
class UrlMeta extends React.Component {
    componentWillMount() {
        const { text, urlMetaStore } = this.props;
        const match = text.match(urlRegex);
        if (match) {
            [this.url] = match;
            if (!urlMetaStore.metaByUrl.get(this.url)) {
                urlMetaStore.fetchUrlMeta(this.url);
            }
        }
    }

    render() {
        if (!this.url) {
            return '';
        }
        const { urlMetaStore } = this.props;
        const meta = urlMetaStore.metaByUrl.get(this.url);
        if (!meta) {
            return <a href={this.url} className={css.meta__link}>{this.url}</a>;
        }
        const sourceUrl = meta.url.startsWith('https://')
            ? `https://${meta.source}`
            : `http://${meta.source}`;

        const imageUrl = meta['og:image'] || meta.image;
        return (
            <Item.Group className={css.meta}>
                <Item>
                    {imageUrl ? <Item.Image src={imageUrl} size="small" /> : ''}
                    <Item.Content>
                        <Item.Header as="a" href={meta.url} content={meta['og:title'] || meta.title} />
                        <Item.Meta>
                            <a href={sourceUrl}>{meta.source}</a>
                        </Item.Meta>
                        <Item.Description content={meta['og:description'] || meta.description} />
                    </Item.Content>
                </Item>
            </Item.Group>
        );
    }
}

export default UrlMeta;
