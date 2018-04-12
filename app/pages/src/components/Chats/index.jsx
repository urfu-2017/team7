import React from 'react';
import { observer, inject } from 'mobx-react';
import { Link } from 'react-router-dom';
import { List, Image, Menu, Label, Input, Button } from 'semantic-ui-react';
import css from './item.css';

@inject('chatsStore', 'messagesStore', 'currentUserStore')
@observer
class ChatList extends React.Component {
    render() {
        const { chatsStore, messagesStore, currentUserStore } = this.props;
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
                {chatsStore.allChats.map(chat => (
                    <Menu.Item
                        as={Link}
                        to="/"
                        key={chat.chatId}
                        active={chat === chatsStore.activeChat}
                        className={css.item}
                        onClick={() => chatsStore.selectChat(chat)}
                    >
                        <Label color="teal" style={{ marginTop: '8px' }}>1</Label>
                        <Image avatar src={chat.avatarUrl} />
                        <List.Content>
                            <List.Header
                                as="span"
                                className={css.item__line}
                                content={`${chat.name}\ufeff`}
                            />
                            <List.Description
                                content={messagesStore.getLastMessageText(chat.chatId)}
                                className={css.item__line}
                            />
                        </List.Content>
                    </Menu.Item>))}
                <List.Item />
            </Menu>
        );
    }
}

export default ChatList;
