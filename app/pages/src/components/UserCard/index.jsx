import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import Invite from '../Invite';


@observer
class UserCard extends React.Component {
    render() {
        const { user, className } = this.props;
        const inviteUsername = `@${user.username}`;

        return (
            <Card className={className}>
                <Image src={user.avatarUrl} centered size="large" />
                <Card.Content>
                    <Card.Header textAlign="center">
                        <Invite isForUser inviteWord={inviteUsername} title={inviteUsername}>
                            <a><Icon name="external" />{user.username}</a>
                        </Invite>
                    </Card.Header>
                </Card.Content>
                <Card.Content extra>
                    <a href={`/#${inviteUsername}`}><Icon name="pencil" />Начать диалог</a>
                </Card.Content>
            </Card>
        );
    }
}

export default UserCard;
