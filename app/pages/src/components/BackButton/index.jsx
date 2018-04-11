import React from 'react';
import { withRouter } from 'react-router-dom';
import { Icon, Button } from 'semantic-ui-react';

const BackButton = ({ history }) => (
    <Button compact onClick={history.goBack}>
        <Icon name="left arrow" />
        Назад
    </Button>
);

export default withRouter(BackButton);
