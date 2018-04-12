import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';


@inject('usersStore', 'currentUserStore')
@observer
class UserCard extends React.Component {
    render() {
        const { currentUserStore, className } = this.props;

        return (
            <Card className={className}>
                <Image src={currentUserStore.user.avatarUrl} centered size="large" /> {/* src={pathToAvatar} */}
                <Card.Content>
                    <Card.Header textAlign="center">
                        {currentUserStore.user.username}
                    </Card.Header>
                </Card.Content>
            </Card>
        );
    }
}

export default UserCard;
