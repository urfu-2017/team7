import React from 'react';
import { when } from 'mobx';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';
import { getOrCreatePrivateChat } from '../../../../sockets/client';


@withRouter
@inject('usersStore', 'chatsStore')
@observer
export default class PrivateChatActivity extends React.Component {
    state = { chat: null };

    componentWillMount() {
        const { match: { params: { username } }, usersStore, chatsStore } = this.props;
        if (!usersStore.getUserByName(username)) {
            usersStore.searchUser(username);
        }

        when(
            () => usersStore.getUserByName(username),
            () => {
                const user = usersStore.getUserByName(username);
                if (!chatsStore.getPrivateChat(user.userId)) {
                    getOrCreatePrivateChat(user.userId);
                }

                when(
                    () => chatsStore.getPrivateChat(user.userId),
                    () => this.setState({ chat: chatsStore.getPrivateChat(user.userId) })
                );
            }
        );
    }

    render() {
        const { chat } = this.state;

        return (chat && <Redirect to={`/chat/${chat.chatId}`} />);
    }
}
