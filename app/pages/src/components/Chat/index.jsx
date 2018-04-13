import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { List, Image, Menu, Label } from 'semantic-ui-react';

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
        { lastMessage.timestamp ?
            <Label color="teal" style={{ marginTop: '8px' }}>
                { moment(lastMessage.timestamp).format('HH:mm') }
            </Label>
            : ''
        }
        <Image avatar src={chat.avatarUrl} />
        <List.Content>
            <List.Header
                as="span"
                className={css.item__line}
                content={`${chat.name}\ufeff`}
            />
            <List.Description
                content={lastMessage.text}
                className={css.item__line}
            />
        </List.Content>
    </Menu.Item>
);
