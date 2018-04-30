import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';


@withRouter
@inject('usersStore', 'chatsStore')
@observer
export default class PrivateChatActivity extends React.Component {
    render() {
        const { match: { params: { username } }, usersStore, chatsStore } = this.props;
        const user = usersStore.getUserByName(username);
        if (!user) {
            return '';
        }
        const privateChat = chatsStore.getPrivateChat(user.userId);

        return (privateChat && <Redirect to={`/chat/${privateChat.chatId}`} />);
    }
}
