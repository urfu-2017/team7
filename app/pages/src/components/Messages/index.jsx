import React from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { Comment, Header, Segment, Transition } from 'semantic-ui-react';
import messagesStore from '../../stores/messages';
import usersStore from '../../stores/users';
import mainStore from '../../stores/main';
import { onMessagesList, onMessage, getUser, onUser } from '../../../../sockets/client';


@observer
class MessageList extends React.Component {
    componentDidMount() {
        onMessage(this.onMessage);

        onMessagesList((messages) => {
            messages.forEach(this.onMessage);
        });

        onUser((user) => {
            usersStore.usersById.set(user.userId, user);
        });
    }

    onMessage = (message) => {
        messagesStore.addMessage(message);
        if (!usersStore.usersById.has(message.authorUserId)) {
            getUser({ userId: message.authorUserId });
        }
    };

    render() {
        if (mainStore.activeChat === null) {
            return <Segment textAlign="center" size="big">Выберите чат</Segment>;
        }
        return (
            <Comment.Group>
                <Header as="h3">{mainStore.activeChat.name}</Header>
                {messagesStore.activeMessages.map(message => (
                    <Transition.Group
                        key={message.chatId}
                        duration={200}
                        as={Comment}
                    >
                        <Comment.Avatar src="https://react.semantic-ui.com/assets/images/avatar/small/matt.jpg" />
                        <Comment.Content>
                            <Comment.Author as="a">
                                {usersStore.getUsername(message.authorUserId) || 'Чебурашка'}
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
