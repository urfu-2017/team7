import React from 'react';
import { Segment } from 'semantic-ui-react';
import Messages from '../Messages';
import Chats from '../Chats';
import MessageInput from '../MessageInput';
import css from './layout.css';
import MessagesMenu from '../MessagesMenu';

const ChatScreen = () => (
    <div className={css.layout}>
        <Segment className={css.layout__chats}>
            <Chats />
        </Segment>
        <div className={css.layout__messages_menu}>
            <MessagesMenu />
        </div>
        <Segment className={css.layout__messages}>
            <Messages />
        </Segment>
        <div className={css.layout__input}>
            <MessageInput />
        </div>
    </div>
);

export default ChatScreen;
