import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { List, Image, Menu, Label, Input, Button } from 'semantic-ui-react';
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
                <List.Item>
                    <Image
                        src="http://identicon.net/img/identicon.png"
                        size="medium"
                        rounded
                    />
                </List.Item>
                <List.Item>
                    <Input icon="search" placeholder="Поиск..." style={{ width: '175px' }}>
                        <Link to="/new-chat"><Button icon="plus" /></Link>
                        <input />
                    </Input>
                </List.Item>
                {chatsStore.allChats.map(chat => (
                    <Menu.Item
                        as={Link}
                        to="/"
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
                            <List.Header as="span" content={chat.name} />
                            <List.Description
                                content={messagesStore.getLastMessageText(chat.chatId)}
                                style={{
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    width: '140px'
                                }}
                            />
                        </List.Content>
                    </Menu.Item>))}
                <List.Item />
            </Menu>
        );
    }
}

export default ChatList;
