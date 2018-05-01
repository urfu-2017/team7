import React from 'react';
import { inject, observer } from 'mobx-react/index';
import UserCard from '../UserCard';
import css from './layout.css';
import DimmerLoader from '../DimmerLoader';
import BackButton from '../BackButton';


@inject('currentUserStore', 'usersStore')
@observer
export default class User extends React.Component {
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
                <UserCard user={user} isSelf={isSelf} className={css.layout__user} />
            </div>
        );
    }
}
