import React from 'react';

class UserView extends React.Component {
  render() {
      return (
        <div>
            <div>{this.props.show ? '1': '2'}</div>
            <button onClick={this.props.onClick}>click</button>
        </div>   
    )
  }
}

UserView.displayName = 'UserView';

export default UserView;
