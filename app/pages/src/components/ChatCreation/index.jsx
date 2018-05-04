import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { List, Input, Button } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react/index';
import { createChat } from '../../../../sockets/client';
import DimmerLoader from '../DimmerLoader';
import BackButton from '../BackButton';
import UserListItem from '../UserListItem';
import { MAX_CHAT_NAME_LENGTH } from '../../../../utils/constants';

import css from './layout.css';

@withRouter
@inject('usersStore', 'currentUserStore')
@observer
class ChatCreation extends React.Component {
    componentWillMount() {
        this.resetComponent();
    }

    get queryRegex() {
        return new RegExp(_.escapeRegExp(this.state.query), 'i');
    }

    get isValid() {
        return this.state.name.trim();
    }

    resetComponent() {
        this.setState({ selectedUserIds: [], query: '', name: '' });
    }

    createChat = () => {
        if (!this.isValid) {
            return;
        }
        const { name, selectedUserIds } = this.state;
        createChat({ name, userIds: selectedUserIds });
        this.resetComponent();
        this.props.history.goBack();
    };

    updateSelectedUserIds = ({ userId }) => {
        this.setState((prevState) => {
            const selectedUserIds = prevState.selectedUserIds.includes(userId)
                ? _.without(prevState.selectedUserIds, userId)
                : _.uniq([...prevState.selectedUserIds, userId]);

            return { selectedUserIds };
        });
    };

    updateName = (e, { value }) => {
        this.setState({ name: value });
    };

    updateQuery = (e, { value }) => {
        this.props.usersStore.searchUser(value);
        this.setState({ query: value });
    };

    render() {
        const currentUser = this.props.currentUserStore.user;
        if (!currentUser) {
            return <DimmerLoader text="Загрузка" />;
        }
        const currentUserId = currentUser.userId;

        const users = _.chain(this.props.usersStore.allUsers)
            .filter(user => this.queryRegex.test(user.username))
            .reject(user => user.userId === currentUserId)
            .orderBy(
                [
                    user => this.state.selectedUserIds.includes(user.userId),
                    user => user.username
                ],
                ['desc', 'asc']
            )
            .value();

        return (
            <div className={css.layout}>
                <BackButton className={css.layout__back} />
                <Input
                    fluid
                    maxLength={MAX_CHAT_NAME_LENGTH}
                    className={css.layout__name}
                    placeholder="Введите название группы"
                    onChange={this.updateName}
                    value={this.state.value}
                />

                <Button
                    className={css.layout__create}
                    content="Создать"
                    onClick={this.createChat}
                    disabled={!this.isValid}
                />
                <Input
                    className={css.layout__search}
                    icon="search"
                    placeholder="Поиск людей..."
                    onChange={_.debounce(this.updateQuery, 300)}
                />
                <List
                    divided
                    selection
                    className={css.layout__items}
                    size="huge"
                    verticalAlign="middle"
                >
                    {users.map(user => (
                        <UserListItem
                            key={user.userId}
                            user={user}
                            active={this.state.selectedUserIds.includes(user.userId)}
                            onClick={() => this.updateSelectedUserIds(user)}
                        />
                    ))}
                </List>
            </div>
        );
    }
}

export default ChatCreation;
