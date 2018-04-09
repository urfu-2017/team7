import React from 'react';
import { observer } from 'mobx-react';
import UserView from './User';

class User extends React.Component {
    render() {
        return <UserView />;
    }
}

export default observer(User);
