import React from 'react';
import { observer } from 'mobx-react';
import { List, Image } from 'semantic-ui-react';
import mainStore from '../../stores/main';
import messagesStore from '../../stores/messages';
import { getChats, getMessages, onChatsList } from '../../../../sockets/client';


@observer
class ChatList extends React.Component {
    componentDidMount() {
        let chatsNeverReceived = true;
        onChatsList((chats) => {
            chatsNeverReceived = false;
            this.setState({ chats });
        });

        (function askForChats() {
            getChats();
            if (chatsNeverReceived) {
                setTimeout(askForChats, 200);
            }
        }());
    }

    render() {
        if (!this.state) {
            return <div>Идёт загрузка списка чатов...</div>;
        }
        return (
            <List>
                {this.state.chats.map(chat => (
                    <List.Item
                        key={chat.chatId}
                        onClick={() => {
                            mainStore.activeChat = chat;
                            getMessages({ chatId: chat.chatId });
                        }}
                    >
                        <Image avatar src={chat.avatarUrl} />
                        <List.Content>
                            <List.Header as="a">{chat.name}</List.Header>
                            <List.Description>
                                {messagesStore.getLastMessageTextFor(chat.chatId)}
                            </List.Description>
                        </List.Content>
                    </List.Item>))}

            </List>);
    }
}

export default ChatList;
