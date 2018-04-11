import React from 'react';
import { Button, Dimmer, Loader } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react/index';
import UserCard from '../UserCard';
import css from './layout.css';

const ProfileLoader = () => (
    <Dimmer active inverted>
        <Loader size="large">Загружаем профиль</Loader>
    </Dimmer>);

@inject('currentUserStore')
@observer
class User extends React.Component {
    render() {
        if (!this.props.currentUserStore.user) {
            return <ProfileLoader />;
        }

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
