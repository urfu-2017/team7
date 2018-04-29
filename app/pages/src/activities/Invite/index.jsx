import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';


@withRouter
@inject('chatsStore')
@observer
export default class InviteActivity extends React.Component {
    render() {
        const { match: { params: { inviteWord } }, chatsStore } = this.props;
        const chat = chatsStore.getChatByInviteWord(inviteWord);

        return (chat && <Redirect to={`/chat/${chat.chatId}`} />);
    }
}
