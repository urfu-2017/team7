import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import User from './components/User';
import ChatScreen from './components/ChatScreen';

const Router = () => (
    <HashRouter>
        <React.Fragment>
            <Route path="/user" component={User} />
            <Route path="/" component={ChatScreen} />
        </React.Fragment>
    </HashRouter>
);

export default Router;
