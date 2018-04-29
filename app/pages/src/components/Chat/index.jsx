import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { List, Image, Menu } from 'semantic-ui-react';

import css from './layout.css';

export default ({
    onClick,
    isActive,
    chat,
    lastMessage
}) => (
    <Menu.Item
        to={`/chat/${chat.chatId}`}
        as={Link}
        active={isActive}
        className={css.layout}
        onClick={onClick}
    >
        {lastMessage.timestamp
            ? <span className={css.layout__time}>{moment(lastMessage.timestamp).format('HH:mm')}</span>
            : null
        }
        <Image avatar src={chat.avatarUrl} />
        <List.Content>
            <List.Header
                as="span"
                className={css.layout__line}
                content={`${chat.name}\ufeff`}
            />
            <List.Description
                content={lastMessage.text}
                className={css.layout__line}
            />
        </List.Content>
    </Menu.Item>
);
