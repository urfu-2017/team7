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
            urlMetaStore.fetchUrlMeta(this.url);
        }
    }

    render() {
        if (!this.url) {
            return '';
        }
        const { urlMetaStore } = this.props;
        const meta = urlMetaStore.metaByUrl.get(this.url);
        if (!meta) {
            return '';
        }
        const sourceUrl = this.url.startsWith('https://')
            ? `https://${meta.source}`
            : `http://${meta.source}`;

        return (
            <Item.Group className={css.meta}>
                <Item>
                    <Item.Image
                        size="small"
                        style={{
                            width: '100px',
                            height: '100px',
                            background: `#ddd url(${meta.image}) no-repeat`,
                            'background-size': 'cover'
                        }}
                    />
                    <Item.Content>
                        <Item.Header as="a" href={this.url} content={meta.title} />
                        <Item.Meta>
                            <a href={sourceUrl}>{meta.source}</a>
                        </Item.Meta>
                        <Item.Description content={meta.description} />
                    </Item.Content>
                </Item>
            </Item.Group>
        );
    }
}

export default UrlMeta;
