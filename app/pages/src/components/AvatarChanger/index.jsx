import React from 'react';
import { inject, observer } from 'mobx-react/index';
import { Input, Button } from 'semantic-ui-react';

@inject('currentUserStore')
@observer
class AvatarChanger extends React.Component {
    componentWillMount() {
        this.setState({ avatarUrl: this.props.avatarUrl });
    }
    render() {
        const { changeAvatarUrl, user } = this.props.currentUserStore;

        return (
            <Input
                placeholder={user.avatarUrl}
                className={this.props.className}
                onChange={(e, { value }) => this.setState({ avatarUrl: value })}
            >
                <input />
                <Button content="Сохранить" onClick={() => changeAvatarUrl(this.state.avatarUrl)} />
            </Input>);
    }
}

export default AvatarChanger;
