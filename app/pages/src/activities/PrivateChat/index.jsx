import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';


@withRouter
@inject('usersStore')
@inject('chatsStore')
@observer
export default class PrivateChatActivity extends React.Component {
    render() {
        const { match: { params: { username } }, usersStore, chatsStore } = this.props;
        const user = usersStore.getUserByName(username);
        if (!user) {
            return '';
        }
        const privateChat = chatsStore.getPrivateChat(user.userId);
        if (!privateChat) {
            return '';
        }

        return (<Redirect to={`/chat/${privateChat.chatId}`} />);
    }
}
