import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { Comment } from 'semantic-ui-react';
import Markdown from '../Markdown';
import { getUser } from '../../../../sockets/client';
import UrlMeta from '../UrlMeta';

@inject('usersStore')
@observer
class Messages extends React.Component {
    componentDidMount() {
        const messages = ReactDOM.findDOMNode(this).parentElement;
        messages.scrollTop = messages.scrollHeight;

        const users = [];
        this.props.messages.forEach(({ authorUserId }) => {
            if (!this.props.usersStore.getUsername(authorUserId) && !users.includes(authorUserId)) {
                users.push(authorUserId);
                getUser({ userId: authorUserId });
            }
        });
    }

    render() {
        const { usersStore } = this.props;
        return (
            <Comment.Group>
                {this.props.messages.map(message => (
                    <Comment key={message.messageId}>
                        <Comment.Avatar src={usersStore.getAvatar(message.authorUserId)} />
                        <Comment.Content>
                            <Comment.Author as="a">
                                {usersStore.getUsername(message.authorUserId)}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(message.timestamp).format('HH:mm')}</div>
                            </Comment.Metadata>
                            <Comment.Text style={{ minHeight: '1em' }}>
                                <Markdown source={message.content} needFormat />
                            </Comment.Text>
                            <UrlMeta text={message.content} />
                        </Comment.Content>
                    </Comment>
                ))}
            </Comment.Group>
        );
    }
}

export default Messages;
