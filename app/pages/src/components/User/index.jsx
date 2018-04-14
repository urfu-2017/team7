import React from 'react';
import { Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react/index';
import UserCard from '../UserCard';
import css from './layout.css';
import DimmerLoader from '../DimmerLoader';
import BackButton from '../BackButton';

const LogoutButton = () => (
    <form action="/logout" className={css.layout__logout}>
        <Button color="red" type="submit" content="LOGOUT" />
    </form>);

@inject('currentUserStore', 'usersStore')
@observer
class User extends React.Component {
    render() {
        const { usersStore, currentUserStore, userId } = this.props;
        const isSelf = !userId;
        const user = isSelf
            ? currentUserStore.user
            : usersStore.getUser(userId);


        if (!user) {
            return <DimmerLoader text="Загружаем профиль" />;
        }

        return (
            <div className={css.layout}>
                <BackButton className={css.layout__back} />
                <UserCard user={user} className={css.layout__user} />
                {isSelf ? <LogoutButton /> : null}
            </div>
        );
    }
}

export default User;
