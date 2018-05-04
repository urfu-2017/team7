import React from 'react';
import uuidv4 from 'uuid/v4';
import { inject, observer } from 'mobx-react';
import { Icon } from 'semantic-ui-react';
import ImageUploader from '../ImageUploader';


@inject('currentUserStore')
@observer
export default class AvatarChanger extends React.Component {
    state = { isLoading: false, gotError: false }

    onError() {
        this.setState({ gotError: true, isLoading: false });
    }

    onProgress(percent) {
        this.setState({ gotError: false, isLoading: percent !== 100 });
    }

    render() {
        const { changeAvatarUrl } = this.props.currentUserStore;
        const { gotError, isLoading } = this.state;
        const inputId = uuidv4();
        const icon = (gotError ? <Icon color="red" name="warning" /> : <Icon name="photo" />);

        return (
            <React.Fragment>
                <ImageUploader
                    onProgress={percent => this.onProgress(percent)}
                    onError={() => this.onError()}
                    onFinish={({ publicUrl }) => {
                        changeAvatarUrl(publicUrl);
                    }}
                    inputId={inputId}
                    avatar
                />
                {
                    isLoading ?
                        (<span><Icon loading name="circle notched" />Сменить аватарку</span>) :
                        (<label htmlFor={inputId}><a>{icon}Сменить аватарку</a></label>)
                }
            </React.Fragment>);
    }
}
