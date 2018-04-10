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
        if (match !== null) {
            [this.url] = match;
            urlMetaStore.getUrlMeta(this.url);
        }
    }

    render() {
        if (!this.url) {
            return '';
        }
        const { urlMetaStore } = this.props;
        const meta = urlMetaStore.metaByUrl.get(this.url);
        if (!meta) {
            return <a href={this.url}>{this.url}</a>;
        }

        const imageUrl = meta['og:image'] || meta.image;
        return (
            <Item.Group className={css.meta}>
                <Item>
                    {imageUrl ? <Item.Image src={imageUrl} size="small" /> : ''}
                    <Item.Content>
                        <Item.Header as="a" href={meta.url} content={meta['og:title'] || meta.title} />
                        <Item.Meta>
                            <a href={meta.source}>{meta.source}</a>
                        </Item.Meta>
                        <Item.Description content={meta['og:description'] || meta.description} />
                    </Item.Content>
                </Item>
            </Item.Group>
        );
    }
}

export default UrlMeta;
