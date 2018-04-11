import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import Chats from '../../components/Chats/index';
import css from './layout.css';
import MessagesActivity from '../Messages';
import ChatCreationActivity from '../ChatCreation/index';


const MainActivity = () => (
    <div className={css.layout}>
        <Segment className={css.layout__chats}>
            <Chats />
        </Segment>
        <div className={css.layout__main_activity}>
            <Switch>
                <Route exact path="/" component={MessagesActivity} />
                <Route exact path="/new-chat" component={ChatCreationActivity} />
            </Switch>
        </div>
    </div>
);

export default MainActivity;
