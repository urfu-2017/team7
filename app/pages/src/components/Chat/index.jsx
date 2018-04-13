import React from 'react';
import { Link } from 'react-router-dom';
import { List, Image, Menu } from 'semantic-ui-react';

import css from './item.css';

export default ({
    onClick,
    isActive,
    chat,
    lastMessage
}) => (
    <Menu.Item
        as={Link}
        to="/"
        key={chat.chatId}
        active={isActive}
        className={css.item}
        onClick={onClick}
    >
        {/* { chat.lastMessageTimestamp ?
            <Label color="teal" style={{ marginTop: '8px' }}>
                { moment(chat.lastMessageTimestamp).format('HH:mm') }
            </Label>
            : ''
        } */}
        <Image avatar src={chat.avatarUrl} />
        <List.Content>
            <List.Header
                as="span"
                className={css.item__line}
                content={`${chat.name}\ufeff`}
            />
            <List.Description
                content={lastMessage}
                className={css.item__line}
            />
        </List.Content>
    </Menu.Item>
);
