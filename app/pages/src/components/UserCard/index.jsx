import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { observer } from 'mobx-react';


@observer
class UserCard extends React.Component {
    render() {
        const { user, className } = this.props;

        return (
            <Card className={className}>
                <Image src={user.avatarUrl} centered size="large" />
                <Card.Content>
                    <Card.Header textAlign="center">
                        {user.username}
                    </Card.Header>
                </Card.Content>
            </Card>
        );
    }
}

export default UserCard;
