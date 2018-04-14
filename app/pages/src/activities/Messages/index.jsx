import React from 'react';
import { Segment } from 'semantic-ui-react';
import Messages from '../../components/Messages/index';
import MessageInput from '../../components/MessageInput/index';
import css from './layout.css';
import MessagesMenu from '../../components/MessagesMenu/index';

const MessagesActivity = () => (
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

export default MessagesActivity;
