import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Menu, Dropdown, Header, Modal, List } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';
import css from './menu.css';
import ConfirmationModal from '../ConfirmationModal';
import Invite from '../Invite';
import UserListItem from '../UserListItem';

@withRouter
@inject('chatsStore', 'usersStore', 'currentUserStore')
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

        if (!activeChat) {
            return '';
        }

        const { usersStore } = this.props;
        const users = activeChat.userIds.map(userId => usersStore.usersById.get(userId));

        return (
            <Menu className={css.menu}>
                {activeChatName &&
                    <Menu.Item header className={css.menu__chatname} content={activeChatName} />
                }
                <Menu.Item style={{ padding: 0 }} position="right">
                    {activeChatName &&
                        <Dropdown simple direction="left" item icon={<Icon size="large" color="grey" name="setting" style={{ margin: 0 }} />}>
                            <Dropdown.Menu>
                                <Modal
                                    trigger={
                                        <Dropdown.Item>
                                            <Header size="tiny">Участники</Header>
                                        </Dropdown.Item>
                                    }
                                    size="mini"
                                    closeIcon
                                >
                                    <Modal.Header>
                                        <Icon name="users" />
                                        Участники ({users.length})
                                        <Icon name="user plus" link style={{ float: 'right', opacity: '.5' }} />
                                    </Modal.Header>
                                    <Modal.Content>
                                        <List divided size="huge" verticalAlign="middle" className={css.members}>
                                            {users.map(user => (user &&
                                                <UserListItem key={user.userId} user={user} />
                                            ))}
                                        </List>
                                    </Modal.Content>
                                </Modal>
                                <Invite
                                    isForUser={activeChat.isPrivate}
                                    inviteWord={activeChat.isPrivate ?
                                        activeChatName : activeChat.inviteWord}
                                    title={activeChatName}
                                >
                                    <Dropdown.Item text="Пригласительная ссылка" />
                                </Invite>
                                <Dropdown.Divider />
                                <ConfirmationModal
                                    trigger={
                                        <Dropdown.Item>
                                            <Header color="red" size="tiny">Покинуть чат</Header>
                                        </Dropdown.Item>
                                    }
                                    size="mini"
                                    header="Покинуть чат"
                                    question="Вы действительно уверены, что хотите покинуть данный чат?"
                                    onAgree={this.leaveChat}
                                    onAgreeText="Покинуть"
                                    onDenyText="Отмена"
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    }
                </Menu.Item>
            </Menu>
        );
    }
}
