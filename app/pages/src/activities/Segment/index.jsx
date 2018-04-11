import React from 'react';
import { Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import css from './layout.css';

const ChatCreationActivity = props => (
    <Segment className={css.layout}>
        <Link to="/">&lt;&nbsp;Назад</Link>
        {props.children}
    </Segment>
);

export default ChatCreationActivity;
