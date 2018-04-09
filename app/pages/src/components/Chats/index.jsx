import React from 'react';
import { observer, inject } from 'mobx-react';
import { List, Image } from 'semantic-ui-react';
import { getChats, getMessages, onChatsList } from '../../../../sockets/client';


@inject('chatsStore')
@inject('messagesStore')
@observer
class ChatList extends React.Component {
    componentDidMount() {
        let chatsNeverReceived = true;
        onChatsList((chats) => {
            chatsNeverReceived = false;
            this.props.chatsStore.setAllChats(chats);
        });

        (function askForChats() {
            getChats();
            if (chatsNeverReceived) {
                setTimeout(askForChats, 1000);
            }
        }());
    }

    render() {
        const { chatsStore, messagesStore } = this.props;
        if (chatsStore.allChats.length === 0) {
            return <div>Идёт загрузка списка чатов...</div>;
        }
        return (
            <List>
                {chatsStore.allChats.map(chat => (
                    <List.Item
                        key={chat.chatId}
                        onClick={() => {
                            chatsStore.setActiveChat(chat);
                            getMessages({ chatId: chat.chatId });
                        }}
                    >
                        <Image avatar src={chat.avatarUrl} />
                        <List.Content>
                            <List.Header as="a">{chat.name}</List.Header>
                            <List.Description>
                                {messagesStore.getLastMessageText(chat.chatId)}
                            </List.Description>
                        </List.Content>
                    </List.Item>))}

            </List>);
    }
}

export default ChatList;
