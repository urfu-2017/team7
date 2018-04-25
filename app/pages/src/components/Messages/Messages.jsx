import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { Comment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getUser, onMessageSent } from '../../../../sockets/client';
import Markdown from '../Markdown';
import UrlMeta from '../UrlMeta';
import Weather from '../Weather';
import Loader from '../Loader';

@inject('usersStore', 'currentUserStore', 'chatsStore')
@observer
class Messages extends React.Component {
    componentDidMount() {
        this.scroll();
        const { usersStore } = this.props;

        const users = [];
        this.props.messages.forEach(({ authorUserId }) => {
            if (!usersStore.getUsername(authorUserId) && !users.includes(authorUserId)) {
                users.push(authorUserId);
                getUser({ userId: authorUserId });
            }
        });

        onMessageSent(() => this.scroll());
    }

    componentWillUpdate(props) {
        if (props.chatId !== this.props.chatId) {
            const messages = ReactDOM.findDOMNode(this).parentElement;
            this.props.chatsStore.setScrollHeight(messages.scrollTop, this.props.chatId);
        }
    }

    componentDidUpdate(props) {
        if (props.chatId !== this.props.chatId) {
            this.scroll(this.props.chatsStore.getScrollHeight(this.props.chatId));
        }
    }

    scroll(value) {
        const messages = ReactDOM.findDOMNode(this).parentElement;
        messages.scrollTop = ![undefined, null].includes(value) ? value : messages.scrollHeight;
    }

    render() {
        const { usersStore } = this.props;

        return (
            <Comment.Group>
                {this.props.messages.map(message => (
                    <Comment key={message.messageId}>

                        <Comment.Avatar src={usersStore.getAvatar(message.authorUserId)} />
                        <Comment.Content>
                            <Comment.Author as={Link} to={`/user_${message.authorUserId}`}>
                                {usersStore.getUsername(message.authorUserId)}
                            </Comment.Author>
                            <Comment.Metadata style={{ minHeight: '1.5em' }}>
                                <div>
                                    {moment(message.timestamp).format('HH:mm')}
                                    <Loader status={message.status} />
                                </div>
                            </Comment.Metadata>
                            <Comment.Text style={{ minHeight: '1em' }}>
                                <Markdown source={message.content} needFormat />
                            </Comment.Text>
                            <UrlMeta text={message.content} />
                            <Weather text={message.content} />
                        </Comment.Content>
                    </Comment>
                ))}
            </Comment.Group>
        );
    }
}

export default Messages;
