import React from 'react';
import uuidv4 from 'uuid/v4';
import css from './markdown.css';
import { getMatch } from '../../common/url-regex';


const formatLink = (fullmatch) => {
    const { isSameDomain, schema, path } = getMatch(fullmatch);
    if (isSameDomain) {
        return <a href={path}>{path}</a>;
    }

    return <a href={schema ? fullmatch : `//${fullmatch}`} target="_blank">{fullmatch}</a>;
};

const MarkdownNode = ({ item, needFormat }) => {
    let child = item.content;
    if (typeof child === 'object') {
        child = <MarkdownInner key={uuidv4()} source={child} needFormat={needFormat} />;
    }

    if (!needFormat) {
        return child;
    }

    switch (item.type) {
    case '**':
        return <strong>{child}</strong>;
    case '__':
        return <i>{child}</i>;
    case '``':
        return <code><pre className={css.pre}>{child}</pre></code>;
    case 'link':
        return formatLink(child);
    default:
        return child;
    }
};
export default class MarkdownInner extends React.Component {
    render() {
        const { source, needFormat } = this.props;

        return (
            <React.Fragment>
                {source.map(item =>
                    (<MarkdownNode
                        key={uuidv4()}
                        item={item}
                        needFormat={needFormat}
                    />))}
            </React.Fragment>
        );
    }
}
