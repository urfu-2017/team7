import React from 'react';
import { Grid, Button } from 'semantic-ui-react';
import UserCard from '../UserCard';
import css from './styles.css';

class User extends React.Component {
    render() {

        return(
            <Grid className={css.profileBox}>
                <Grid.Row centered columns={7}>
                    <Grid.Column />
                    <Grid.Column />
                    <Grid.Column />
                    <Grid.Column>
                        <UserCard />
                    </Grid.Column>
                    <Grid.Column />
                    <Grid.Column />
                    <Grid.Column />
                </Grid.Row>
                <Grid.Row centered columns={5}>
                    <Grid.Column />
                    <Grid.Column />
                    <Grid.Column />
                    <Grid.Column>
                        <form action="/logout">
                            <Button secondary type="submit">
                                LOGOUT
                            </Button>
                        </form>
                    </Grid.Column>

                    <Grid.Column />
                </Grid.Row>
            </Grid>
        );
    }
}

export default User;
