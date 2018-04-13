import React from 'react';
import MarkdownParser from './markdown';
import MarkdownInner from './MarkdownInner';

export default class Markdown extends React.Component {
    render() {
        return (
            <MarkdownInner
                source={MarkdownParser.parseToTree(this.props.source)}
                needFormat={this.props.needFormat}
            />
        );
    }
}
