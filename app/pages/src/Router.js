import React from 'react';
import { HashRouter, Route } from "react-router-dom";
import { observer } from 'mobx-react';

import User from './components/User';
import Chats from './components/Chats';

const Router = props => (
    <HashRouter>
        <React.Fragment>
            <Route path="/user" component={User} />
            <Route path="/chats" component={Chats} />
        </React.Fragment>
    </HashRouter>
);

export default Router;
