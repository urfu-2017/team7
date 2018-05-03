import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';

export default ({ className }) => (
    <Link to="/alarms" className={className}>
        <Icon name="clock" size="medium" /> Ваши Будильники
    </Link>
);
