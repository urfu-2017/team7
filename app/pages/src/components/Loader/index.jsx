import React from 'react';

class Loader extends React.Component {
    render() {
        const { status } = this.props;
        if (status === 'SENT') {
            return (
                <div className="ui active inline loader tiny" style={{ margin: '0 1em' }} />
            );
        } else if (status === 'REVOKED') {
            return (
                <div style={{ color: 'red', display: 'inline-block', margin: '0, 1em' }}>&#10006;</div>
            );
        }

        return '';
    }
}

export default Loader;
