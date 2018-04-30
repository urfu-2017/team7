import React from 'react';
import css from './markdown.css';


const MardownNode = ({ item, needFormat }) => {
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
    case 'link':
        return <a href={/^https?:/.test(child) ? child : `//${child}`} target="_blank">{child}</a>;
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
                    (<MardownNode
                        key={item.id}
                        item={item}
                        needFormat={needFormat}
                    />))}
            </React.Fragment>
        );
    }
}
