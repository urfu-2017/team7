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
        if (!meta || meta.error) {
            return null;
        }

        return (
            <Item.Group className={css.meta}>
                <Item>
                    <Item.Image
                        size="small"
                        style={{
                            width: '100px',
                            height: '100px',
                            background: `#ddd url(${meta.image}) no-repeat`,
                            backgroundSize: 'cover'
                        }}
                        title={meta.title}
                    />
                    <Item.Content>
                        <Item.Header className={css.meta__header} as="a" href={meta.url} content={meta.title} />
                        <Item.Meta>
                            <a href={meta.url}>{meta.url}</a>
                        </Item.Meta>
                        <Item.Description className={css.meta__description} as="p" content={meta.description} />
                    </Item.Content>
                </Item>
            </Item.Group>
        );
    }
}

export default UrlMeta;
