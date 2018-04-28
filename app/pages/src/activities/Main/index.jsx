import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import Chats from '../../components/Chats/index';
import css from './layout.css';
import MessagesActivity from '../Messages';
import SegmentActivity from '../Segment';
import ChatCreation from '../../components/ChatCreation/index';
import User from '../../components/User';


const MainActivity = () => (
    <div className={css.layout}>
        <Segment className={css.layout__chats}>
            <Chats />
        </Segment>
        <div className={css.layout__main_activity}>
            <Switch>
                <Route exact path="/" component={MessagesActivity} />
                <Route exact path="/chat/:chatId" component={MessagesActivity} />
                <Route exact path="/new-chat">
                    <SegmentActivity>
                        <ChatCreation />
                    </SegmentActivity>
                </Route>
                <Route exact path="/me">
                    <SegmentActivity>
                        <User />
                    </SegmentActivity>
                </Route>
                <Route
                    exact
                    path="/user_:userId"
                    render={({ match }) => (
                        <SegmentActivity>
                            <User userId={match.params.userId} />
                        </SegmentActivity>
                    )}
                />
            </Switch>
        </div>
    </div>
);

export default MainActivity;
