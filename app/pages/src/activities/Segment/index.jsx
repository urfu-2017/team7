import React from 'react';
import { Segment } from 'semantic-ui-react';
import css from './layout.css';

const ChatCreationActivity = ({ children }) => (
    <Segment className={css.layout}>
        {children}
    </Segment>
);

export default ChatCreationActivity;
