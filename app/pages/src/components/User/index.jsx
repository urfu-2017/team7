import React from 'react';
import { Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react/index';
import UserCard from '../UserCard';
import css from './layout.css';
import DimmerLoader from '../DimmerLoader';
import BackButton from '../BackButton';

@inject('currentUserStore')
@observer
class User extends React.Component {
    render() {
        if (!this.props.currentUserStore.user) {
            return <DimmerLoader text="Загружаем профиль" />;
        }

        return (
            <div className={css.layout}>
                <BackButton className={css.layout__back} />
                <UserCard className={css.layout__user} />
                <form action="/logout" className={css.layout__logout}>
                    <Button color="red" type="submit">
                        LOGOUT
                    </Button>
                </form>
            </div>
        );
    }
}

export default User;
