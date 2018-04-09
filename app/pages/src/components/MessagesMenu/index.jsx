import React from 'react';
import { Icon, Menu } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';


@inject('chatsStore')
@observer
class MessagesMenu extends React.Component {
    render() {
        const { activeChat } = this.props.chatsStore;
        return (
            <Menu>
                {activeChat
                    ? <Menu.Item header content={activeChat.name} />
                    : ''}
                <Menu.Item position="right">
                    <Icon size="large" name="setting" />
                </Menu.Item>
            </Menu>
        );
    }
}

export default MessagesMenu;
