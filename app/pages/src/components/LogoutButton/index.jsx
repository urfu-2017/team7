import React from 'react';
import { Button } from 'semantic-ui-react';

const LogoutButton = ({ className }) => (
    <form action="/logout" className={className}>
        <Button color="red" type="submit" content="LOGOUT" />
    </form>);

export default LogoutButton;
