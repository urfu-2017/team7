import _ from 'lodash';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { List, Image, Menu, Input, Button } from 'semantic-ui-react';
import Chat from '../Chat';

@inject('chatsStore', 'messagesStore', 'currentUserStore')
@observer
class ChatList extends React.Component {
    render() {
        const { chatsStore, messagesStore, currentUserStore } = this.props;
        const chats = [...chatsStore.chatsById.toJS().values()];
        return (
            <Menu as={List} size="large" style={{ boxShadow: 'none', border: 'none' }} vertical>
                {/* note: Перебиваем padding:0 для первого элемента списка. */}
                <List.Item style={{ paddingTop: '0.928571em' }}>
                    <Image
                        as={Link}
                        to="/user"
                        src={currentUserStore.avatarUrl || '/static/logo.png'}
                        size="medium"
                        rounded
                    />
                </List.Item>
                <List.Item>
                    <Input placeholder="Поиск..." fluid style={{ height: '36px' }}>
                        <Link to="/new-chat"><Button icon="plus" /></Link>
                        <input />
                    </Input>
                </List.Item>
                {_.chain(chats)
                    .filter(chat => chat.lastMessageTimestamp)
                    .orderBy(['lastMessageTimestamp'], ['desc'])
                    .concat(_.filter(chats, chat => !chat.lastMessageTimestamp))
                    .map(chat => (
                        <Chat
                            chat={chat}
                            isActive={chat === chatsStore.activeChat}
                            lastMessage={messagesStore.getLastMessageText(chat.chatId)}
                            onClick={() => chatsStore.selectChat(chat)}
                        />
                    ))
                    .value()}
                <List.Item />
            </Menu>
        );
    }
}

export default ChatList;
