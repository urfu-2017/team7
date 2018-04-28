import React from 'react';
import { Segment } from 'semantic-ui-react';
import { inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import Messages from '../../components/Messages';
import MessageInput from '../../components/MessageInput';
import css from './layout.css';
import MessagesMenu from '../../components/MessagesMenu';

@withRouter
@inject('chatsStore')
class MessagesActivity extends React.Component {
    componentWillMount() {
        this.updateActiveChatFromProps(this.props);
    }

    shouldComponentUpdate(nextProps) {
        return this.props.match.params.chatId !== nextProps.match.params.chatId;
    }

    componentWillUpdate(nextProps) {
        this.updateActiveChatFromProps(nextProps);
    }

    /* eslint-disable-next-line class-methods-use-this */
    updateActiveChatFromProps(props) {
        const { chatsStore, match: { params: { chatId } } } = props;
        chatsStore.selectChat(chatId);
    }

    render() {
        return (
            <div className={css.layout}>
                <div className={css.layout__menu}>
                    <MessagesMenu />
                </div>
                <Segment className={css.layout__items}>
                    <Messages />
                </Segment>
                <div className={css.layout__input}>
                    <MessageInput />
                </div>
            </div>
        );
    }
}

export default MessagesActivity;
