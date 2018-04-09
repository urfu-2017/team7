import React from 'react';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { Comment } from 'semantic-ui-react';
import { onMessagesList, onMessage, getUser, onUser } from '../../../../sockets/client';
import UrlMeta from '../UrlMeta';

@inject('chatsStore', 'messagesStore', 'usersStore')
@observer
class MessageList extends React.Component {
    componentDidMount() {
        onMessage(this.onMessage);

        onMessagesList((messages) => {
            messages.forEach(this.onMessage);
        });

        onUser((user) => {
            this.props.usersStore.usersById.set(user.userId, user);
        });
    }

    onMessage = (message) => {
        this.props.messagesStore.addMessage(message);
        const { usersById } = this.props.usersStore;
        if (!usersById.has(message.authorUserId)) {
            getUser({ userId: message.authorUserId });
        }
    };

    render() {
        const { chatsStore, messagesStore, usersStore } = this.props;
        if (!chatsStore.activeChat) {
            return '';
        }
        return (
            <Comment.Group>
                {messagesStore.getChatMessages(chatsStore.activeChat.chatId).map(message => (
                    <Comment key={message.messageId}>
                        <Comment.Avatar src="https://react.semantic-ui.com/assets/images/avatar/small/matt.jpg" />
                        <Comment.Content>
                            <Comment.Author as="a">
                                {usersStore.getUsername(message.authorUserId) || 'Чебурашка'}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(message.timestamp).format('hh:mm')}</div>
                            </Comment.Metadata>
                            <Comment.Text>
                                {message.content}
                            </Comment.Text>
                            <UrlMeta text={message.content} />
                        </Comment.Content>
                    </Comment>))}
            </Comment.Group>);
    }
}

export default MessageList;
