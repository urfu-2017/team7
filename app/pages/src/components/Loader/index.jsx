import React from 'react';

class Loader extends React.Component {
    render() {
        const { status } = this.props;
        if (status !== 'SENT') {
            return '';
        }

        return (
            <div className="ui active inline loader tiny" style={{ margin: '0 1em' }} />
        );
    }
}

export default Loader;
