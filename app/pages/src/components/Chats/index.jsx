import React from 'react';
import { observer, inject } from 'mobx-react';
import { List, Image, Menu, Label, Input } from 'semantic-ui-react';
import { getChats, getMessages, onChatsList } from '../../../../sockets/client';


@inject('chatsStore', 'messagesStore')
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
        return (
            <Menu as={List} size="large" style={{ margin: '0', boxShadow: 'none', border: 'none' }} vertical>
                <Menu.Item style={{ padding: 0 }} >
                    <Image src="https://help.github.com/assets/images/help/profile/identicon.png" size="medium" rounded />
                </Menu.Item>
                <Menu.Item>
                    <Input icon="search" placeholder="Поиск..." />
                </Menu.Item>
                {chatsStore.allChats.map(chat => (
                    <Menu.Item
                        key={chat.chatId}
                        active={chat === chatsStore.activeChat}
                        style={{ height: '62px' }}
                        onClick={() => {
                            chatsStore.setActiveChat(chat);
                            getMessages({ chatId: chat.chatId });
                        }}
                    >
                        <Label color="teal" style={{ marginTop: '8px' }}>1</Label>
                        <Image avatar src={chat.avatarUrl} />
                        <List.Content>
                            <List.Header as="span">{chat.name}</List.Header>
                            <List.Description>
                                {messagesStore.getLastMessageText(chat.chatId)}
                            </List.Description>
                        </List.Content>
                    </Menu.Item>))}
                <Menu.Item style={{ padding: 0 }} />
            </Menu>
        );
    }
}

export default ChatList;
