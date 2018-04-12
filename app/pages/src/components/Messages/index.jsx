import React from 'react';
import { observer, inject } from 'mobx-react';

import Messages from './Messages';
import DimmerLoader from '../DimmerLoader';

@inject('chatsStore', 'messagesStore', 'usersStore')
@observer
class MessageList extends React.Component {
    render() {
        const { chatsStore, messagesStore } = this.props;
        if (!chatsStore.activeChat) {
            return null;
        }
        const chatMessages = messagesStore.getChatMessagesOrNull(chatsStore.activeChat.chatId);

        return !chatMessages
            ? <DimmerLoader text="Загружаем сообщения" />
            : <Messages messages={chatMessages} />;
    }
}

export default MessageList;
