import React from 'react';
import uuidv4 from 'uuid/v4';
import { inject, observer } from 'mobx-react/index';
import ReactS3Uploader from 'react-s3-uploader';
import { Icon } from 'semantic-ui-react';


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
                <ReactS3Uploader
                    signingUrl="/s3/sign"
                    accept="image/*"
                    s3path="avatars/"
                    contentDisposition="auto"
                    onProgress={percent => this.onProgress(percent)}
                    onError={() => this.onError()}
                    onFinish={({ publicUrl }) => {
                        changeAvatarUrl(publicUrl);
                    }}
                    style={{ display: 'none' }}
                    id={inputId}
                />
                {
                    isLoading ?
                        (<span><Icon loading name="circle notched" />Сменить аватарку</span>) :
                        (<label htmlFor={inputId}><a>{icon}Сменить аватарку</a></label>)
                }
            </React.Fragment>);
    }
}
