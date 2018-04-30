import React from 'react';
import { Icon, Menu, Dropdown, Header } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import css from './menu.css';
import Invite from '../Invite';

@inject('chatsStore')
@observer
export default class MessagesMenu extends React.Component {
    render() {
        const { activeChatName, activeChat } = this.props.chatsStore;

        return (
            <Menu className={css.menu}>
                {activeChatName &&
                    <Menu.Item header className={css.menu__chatname} content={activeChatName} />
                }
                <Menu.Item style={{ padding: 0 }} position="right">
                    {activeChatName &&
                        <Dropdown simple direction="left" item icon={<Icon size="large" color="grey" name="setting" style={{ margin: 0 }} />}>
                            <Dropdown.Menu>
                                <Dropdown.Item text="Участники" />
                                <Invite
                                    isForUser={activeChat.isPrivate}
                                    inviteWord={activeChat.isPrivate ?
                                        activeChatName : activeChat.inviteWord}
                                    title={activeChatName}
                                >
                                    <Dropdown.Item text="Пригласительная ссылка" />
                                </Invite>
                                <Dropdown.Divider />
                                <Dropdown.Item>
                                    <Header color="red" size="tiny">Покинуть чат</Header>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Menu.Item>
            </Menu>
        );
    }
}
