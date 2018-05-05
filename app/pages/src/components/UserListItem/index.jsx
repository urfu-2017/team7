import React from 'react';
import { List, Image, Icon } from 'semantic-ui-react';

import css from './layout.css';

const UserListItem = ({ active, onClick, user }) => (
    <List.Item
        active={active}
        onClick={onClick}
        style={{ display: 'flex', alignItems: 'center' }}
    >
        <Image
            avatar
            style={{ borderRadius: '.25rem', flex: '0 0 auto' }}
            src={user.avatarUrl || `/avatar/${user.userId}`}
        />
        <List.Content style={{ flex: '1 1 auto' }} verticalAlign="middle">
            <List.Header>
                {user.username}
                <a className={css.layout__iconlink} href={`/#user/${user.userId}`}><Icon name="user" /></a>
                <a className={css.layout__iconlink} href={`/#@${user.username}`}><Icon name="comment" /></a>
            </List.Header>
        </List.Content>
    </List.Item>
);

export default UserListItem;
