import _ from 'lodash';
import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { List, Image, Menu, Input, Button } from 'semantic-ui-react';
import Chat from '../Chat';
import Markdown from '../Markdown';

@inject('chatsStore', 'messagesStore', 'currentUserStore')
@observer
class ChatList extends React.Component {
    state = { filter: '' };

    get filterRegex() {
        return new RegExp(_.escapeRegExp(this.state.filter), 'i');
    }

    updateFilter = (e, { value }) => {
        this.setState({ filter: value.toLowerCase() });
    };

    render() {
        const { chatsStore, messagesStore, currentUserStore } = this.props;
        const chats = _.chain(chatsStore.allChats)
            .filter(chat => this.filterRegex.test(chat.name))
            .orderBy(
                [
                    chat => messagesStore.hasMessages(chat.chatId),
                    chat => messagesStore.getLastMessageTimestamp(chat.chatId)
                ],
                ['desc', 'desc']
            );

        return (
            <Menu as={List} size="large" style={{ boxShadow: 'none', border: 'none' }} vertical>
                {/* note: Перебиваем padding:0 для первого элемента списка. */}
                <List.Item style={{ paddingTop: '0.928571em' }}>
                    <Image
                        as={Link}
                        to="/me"
                        src={currentUserStore.avatarUrl || '/static/logo.png'}
                        size="medium"
                        rounded
                    />
                </List.Item>
                <List.Item>
                    <Input placeholder="Поиск..." fluid style={{ height: '36px' }} onChange={this.updateFilter}>
                        <Link to="/new-chat"><Button icon="plus" /></Link>
                        <input />
                    </Input>
                </List.Item>
                {chats
                    .map(chat => (
                        <Chat
                            chat={chat}
                            key={chat.chatId}
                            isActive={chat === chatsStore.activeChat}
                            lastMessage={{
                                text: <Markdown
                                    source={messagesStore.getLastMessageText(chat.chatId)}
                                />,
                                timestamp: messagesStore.getLastMessageTimestamp(chat.chatId)
                            }}
                            onClick={() => chatsStore.selectChat(chat)}
                        />
                    ))
                    .value()
                }
                <List.Item />
            </Menu>
        );
    }
}

export default ChatList;
