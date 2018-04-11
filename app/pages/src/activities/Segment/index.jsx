import React from 'react';
import { Segment } from 'semantic-ui-react';
import css from './layout.css';
import BackButton from '../../components/BackButton/index';

const ChatCreationActivity = ({ children }) => (
    <Segment className={css.layout}>
        <BackButton />
        {children}
    </Segment>
);

export default ChatCreationActivity;
