import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';

import Messages from './Messages';
import DimmerLoader from '../DimmerLoader';

@withRouter
@inject('chatsStore', 'messagesStore', 'usersStore')
@observer
class MessageList extends React.Component {
    render() {
        const { chatsStore, messagesStore } = this.props;

        if (!chatsStore.activeChat) {
            return null;
        }
        const chatMessages = messagesStore.getChatMessagesOrNull(chatsStore.activeChat.chatId);

        return chatMessages
            ? <Messages messages={chatMessages} chatId={chatsStore.activeChat.chatId} />
            : <DimmerLoader text="Загружаем сообщения" />;
    }
}

export default MessageList;
