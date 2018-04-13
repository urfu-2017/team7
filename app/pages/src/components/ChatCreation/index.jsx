import React from 'react';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';
import { List, Input, Button, Image } from 'semantic-ui-react';
import { inject, observer } from 'mobx-react/index';
import { createChat } from '../../../../sockets/client';
import DimmerLoader from '../DimmerLoader';
import BackButton from '../BackButton';
import css from './layout.css';
import { MAX_CHAT_NAME_LENGTH } from '../../../../utils/constants';

@inject('usersStore', 'currentUserStore')
@observer
@withRouter
class ChatCreation extends React.Component {
    componentWillMount() {
        this.resetComponent();
    }

    get queryRegex() {
        return new RegExp(_.escapeRegExp(this.state.query), 'i');
    }

    get isValid() {
        return this.state.name && this.state.selectedUserIds.length > 0;
    }

    resetComponent() {
        this.setState({ selectedUserIds: [], query: '', name: '' });
    }

    createChat = () => {
        if (!this.isValid) {
            return;
        }
        const { name, selectedUserIds } = this.state;
        const userIds = [...selectedUserIds, this.props.currentUserStore.user.userId];
        createChat({ name, userIds });
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
        const { allUsers } = this.props.usersStore;
        const selectedUsers = _.chain(allUsers)
            .filter(x => this.state.selectedUserIds.includes(x.userId))
            .filter(x => x.userId !== currentUserId)
            .sortBy(['username'])
            .value();

        const usersFromSearch = _.chain(allUsers)
            .without(...selectedUsers)
            .filter(x => this.queryRegex.test(x.username))
            .filter(x => x.userId !== currentUserId)
            .sortBy(['username'])
            .value();

        const users = _.concat(selectedUsers, usersFromSearch);
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
                        <List.Item
                            key={user.userId}
                            active={this.state.selectedUserIds.includes(user.userId)}
                            onClick={() => this.updateSelectedUserIds(user)}
                        >
                            <Image
                                avatar
                                style={{ borderRadius: '.25rem' }}
                                src={user.avatarUrl || `/avatar/${user.userId}`}
                            />
                            <List.Content verticalAlign="middle">
                                <List.Header content={user.username} />
                            </List.Content>
                        </List.Item>))}
                </List>
            </div>
        );
    }
}

export default ChatCreation;
