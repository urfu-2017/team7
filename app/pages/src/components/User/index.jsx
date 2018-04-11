import React from 'react';
import { Button } from 'semantic-ui-react';
import UserCard from '../UserCard';
import css from './layout.css';

class User extends React.Component {
    render() {
        return (
            <div className={css.layout}>
                <UserCard className={css.layout__user} />
                <form action="/logout" className={css.layout__logout}>
                    <Button secondary type="submit">
                        LOGOUT
                    </Button>
                </form>
            </div>
        );
    }
}

export default User;
