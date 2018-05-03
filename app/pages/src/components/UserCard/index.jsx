import React from 'react';
import { Card, Image, Icon } from 'semantic-ui-react';
import { observer } from 'mobx-react';
import Invite from '../Invite';
import AvatarChanger from '../AvatarChanger';
import AlarmLink from '../Alarms/AlarmLink';


@observer
export default class UserCard extends React.Component {
    render() {
        const { user, className, isSelf } = this.props;
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
                {isSelf &&
                    <React.Fragment>
                        <Card.Content extra>
                            <AvatarChanger />
                        </Card.Content>
                        <Card.Content extra>
                            <AlarmLink />
                        </Card.Content>
                        <Card.Content extra>
                            <a href="/logout"><Icon name="rocket" />Выйти</a>
                        </Card.Content>
                    </React.Fragment>
                }
            </Card>
        );
    }
}
