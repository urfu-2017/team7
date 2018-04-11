import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import { observer, inject } from 'mobx-react';

@inject('usersStore')
@observer
class UserCard extends React.Component {
    render() {
        // const { usersStore } = this.props;
        // const pathToAvatar = '/avatar/' + usersStore.me.id;

        return (
            <Card>
                <Image src="http://identicon.net/img/identicon.png" /> {/* src={pathToAvatar} */}
                <Card.Content>
                    <Card.Header textAlign="center">
                        ProfileName {/* usersStore.me.name */}
                    </Card.Header>
                </Card.Content>
            </Card>
        );
    }
}

export default UserCard;
