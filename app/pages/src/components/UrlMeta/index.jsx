import React from 'react';
import { Item } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react';
import { getMatch } from '../../common/url-regex';
import css from './meta.css';

@inject('urlMetaStore')
@observer
export default class UrlMeta extends React.Component {
    componentWillMount() {
        const { text, urlMetaStore } = this.props;
        const match = getMatch(text);
        if (match && !match.isSameDomain && !text.startsWith('/s3/uploads')) {
            this.url = match.fullmatch;
            if (!urlMetaStore.metaByUrl.has(this.url)) {
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
                        <Item.Meta className={css.meta__header} >
                            <a href={meta.url}>{meta.url}</a>
                        </Item.Meta>
                        <Item.Description className={css.meta__description} as="p" content={meta.description} />
                    </Item.Content>
                </Item>
            </Item.Group>
        );
    }
}
