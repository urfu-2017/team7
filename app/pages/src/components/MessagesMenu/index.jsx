import React from 'react';
import { withRouter } from 'react-router-dom'
import { Icon, Menu, Dropdown, Header, Modal, Button } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import css from './menu.css';
import Invite from '../Invite';
import ConfirmationModal from '../ConfirmationModal';

@withRouter
@inject('chatsStore', 'currentUserStore')
@observer
export default class MessagesMenu extends React.Component {
    constructor() {
        super();
        this.leaveChat = this.leaveChat.bind(this);
    }

    leaveChat() {
        const { history } = this.props;
        const { leaveChat, activeChatId } = this.props.chatsStore;
        const { userId } = this.props.currentUserStore;

        leaveChat(userId, activeChatId);
        history.push('/');
    }

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
                                    <ConfirmationModal
                                        trigger={<Header color="red" size="tiny">Покинуть чат</Header>}
                                        size="mini"
                                        header="Покинуть чат"
                                        question="Вы действительно уверены, что хотите покинуть данный чат?"
                                        onAgree={this.leaveChat}
                                    />
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Menu.Item>
            </Menu>
        );
    }
}
