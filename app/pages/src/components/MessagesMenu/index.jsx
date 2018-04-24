import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import css from './menu.css';

@inject('chatsStore')
@observer
class MessagesMenu extends React.Component {
    render() {
        const { activeChatName } = this.props.chatsStore;

        return (
            <Menu className={css.menu}>
                {activeChatName
                    ? <Menu.Item header className={css.menu__chatname} content={activeChatName} />
                    : ''}
                <Menu.Item position="right">
                    <Icon size="large" color="grey" name="setting" />
                </Menu.Item>
            </Menu>
        );
    }
}

export default MessagesMenu;
