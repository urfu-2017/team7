import React from 'react';
import { observer, inject } from 'mobx-react';
import { Dimmer, Loader } from 'semantic-ui-react';
import { onMessage, getUser, onUser } from '../../../../sockets/client';
import Messages from './Messages';

const MessageLoader = () => (
    <Dimmer active inverted>
        <Loader size="large">Загружаем сообщения</Loader>
    </Dimmer>
);

@inject('chatsStore', 'messagesStore', 'usersStore')
@observer
class MessageList extends React.Component {
    componentDidMount() {
        onMessage(this.onMessage);

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
        const { chatsStore, messagesStore } = this.props;
        if (!chatsStore.activeChat) {
            return null;
        }
        const chatMessages = messagesStore.getChatMessagesOrNull(chatsStore.activeChat.chatId);

        return !chatMessages
            ? <MessageLoader />
            : <Messages messages={chatMessages} />;
    }
}

export default MessageList;
