import React from 'react';
import css from './markdown.css';

export default class MarkdownInner extends React.Component {
    static itemToHtml(item, needFormat) {
        let child = item.content;
        if (typeof child === 'object') {
            child = <MarkdownInner source={child} needFormat={needFormat} />;
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
        default:
            return child;
        }
    }

    render() {
        return (
            this.props.source.map(item => MarkdownInner.itemToHtml(item, this.props.needFormat))
        );
    }
}
