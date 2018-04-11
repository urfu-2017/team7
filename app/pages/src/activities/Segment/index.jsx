import React from 'react';
import { Segment, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import css from './layout.css';

const ChatCreationActivity = props => (
    <Segment className={css.layout}>
        <Link to="/">
            <Icon name="left arrow" />
            Назад
        </Link>
        {props.children}
    </Segment>
);

export default ChatCreationActivity;
