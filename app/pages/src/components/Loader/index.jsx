import React from 'react';
import { Icon } from 'semantic-ui-react';

class Loader extends React.Component {
    render() {
        const { status } = this.props;
        const style = {
            margin: '0 1em',
            'font-size': '1.2rem',
            height: '1rem',
            width: '1rem'
        };
        if (status === 'SENT') {
            return (
                <Icon className="ui active inline loader" size="tiny" style={style} />
            );
        } else if (status === 'REVOKED') {
            return (
                <Icon name="dont" size="large" color="red" style={style} />
            );
        }

        return '';
    }
}

export default Loader;
