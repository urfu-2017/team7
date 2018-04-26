import React from 'react';
import { Icon } from 'semantic-ui-react';

class Loader extends React.Component {
    render() {
        const { status } = this.props;
        if (status === 'SENT') {
            return (
                <div className="ui active inline loader tiny" style={{ margin: '0 1em' }} />
            );
        } else if (status === 'REVOKED') {
            return (
                <Icon name="dont" size="large" color="red" style={{ margin: '0 0.5em' }} />
            );
        }

        return '';
    }
}

export default Loader;
