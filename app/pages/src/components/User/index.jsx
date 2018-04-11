import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import UserCard from '../UserCard';
import css from './styles.css';

class User extends React.Component {
    render() {
        return (
            <Grid className={css.profileBox}>
                <Grid.Row centered columns={3}>
                    <Grid.Column width={3} />
                    <Grid.Column width={2}>
                        <UserCard />
                    </Grid.Column>
                    <Grid.Column width={3} />
                </Grid.Row>
                <Grid.Row centered columns={2}>
                    <Grid.Column width={3} />
                    <Grid.Column width={1}>
                        <form action="/logout">
                            <Button secondary type="submit">
                                LOGOUT
                            </Button>
                        </form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

export default User;
