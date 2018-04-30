import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon } from 'semantic-ui-react';

export default ({ className }) => (
    <Button as={Link} to="/alarms" className={className}>
        <Icon name="clock" size="medium" /> Ваши Будильники
    </Button>
);
