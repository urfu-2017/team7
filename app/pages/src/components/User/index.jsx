import React from 'react';
import { observer } from 'mobx-react';
import testStore from '../../stores/test';
import UserView from './User';

class User extends React.Component {
    render() {
        return <UserView show={testStore.show} onClick={() => testStore.change()} />;
    }
}

export default observer(User);
