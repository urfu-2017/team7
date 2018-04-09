import React from 'react';
import moment from 'moment';
import { observer, inject } from 'mobx-react';
import { Comment, Header, Segment, Transition } from 'semantic-ui-react';
import { onMessagesList, onMessage, getUser, onUser } from '../../../../sockets/client';


@inject('chats')
@inject('users')
@inject('messages')
@observer
class MessageList extends React.Component {
    componentDidMount() {
        onMessage(this.onMessage);

        onMessagesList((messages) => {
            messages.forEach(this.onMessage);
        });

        onUser((user) => {
            this.props.users.usersById.set(user.userId, user);
        });
    }

    onMessage = (message) => {
        this.props.messages.addMessage(message);
        const { usersById } = this.props.users;
        if (!usersById.has(message.authorUserId)) {
            getUser({ userId: message.authorUserId });
        }
    };

    render() {
        const { chats, messages, users } = this.props;
        if (!chats.activeChat) {
            return <Segment textAlign="center" size="big">Выберите чат</Segment>;
        }
        return (
            <Comment.Group>
                <Header as="h3">{chats.activeChat.name}</Header>
                {messages.getChatMessages(chats.activeChat.chatId).map(message => (
                    <Transition.Group
                        key={message.chatId}
                        duration={200}
                        as={Comment}
                    >
                        <Comment.Avatar src="https://react.semantic-ui.com/assets/images/avatar/small/matt.jpg" />
                        <Comment.Content>
                            <Comment.Author as="a">
                                {users.getUsername(message.authorUserId) || 'Чебурашка'}
                            </Comment.Author>
                            <Comment.Metadata>
                                <div>{moment(message.timestamp).format('hh:mm')}</div>
                            </Comment.Metadata>
                            <Comment.Text>{message.content}</Comment.Text>
                        </Comment.Content>
                    </Transition.Group>))}
            </Comment.Group>);
    }
}

export default MessageList;
